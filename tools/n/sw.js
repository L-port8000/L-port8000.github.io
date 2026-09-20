"use strict";

/**
 * Service Worker: プッシュ通知の受信、通知本文のローカル復号、PWAバッジの更新を担当。
 *
 * 【E2EEとの関係】サーバから届くpushペイロードにはチャット本文の暗号文(iv/ciphertext)が
 * そのまま入っている（サーバは復号できない）。ここでIndexedDBに保存済みのルーム鍵を使って
 * "この端末の中だけで" 復号し、通知に表示するかどうかを決めている。
 *
 * 【既知の制約】通知プレビューではECDSA署名の検証を行っていない（対応する送信者の
 * 検証用公開鍵をSWのIndexedDBキャッシュに持たせる設計にしていないため）。なりすまし
 * メッセージの検証は、アプリを開いて実際にチャット画面へ反映される際に行われる
 * （app.js の decryptAndAppendChat を参照）。通知本文はあくまで「速報」であり、
 * 正式な内容はアプリを開いたときに検証済みの状態で表示される。
 */

"use strict";

/**
 * index.html（メインスレッド）と sw.js（Service Worker）の両方から使う共通処理。
 * classic scriptとして両方から読み込まれるため import/export は使わない
 * （メイン側は <script src="shared.js">、SW側は importScripts('shared.js')）。
 */

// ===== base64 <-> ArrayBuffer =====

function bufToBase64(buf) {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
function base64ToBuf(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}
function utf8Encode(str) { return new TextEncoder().encode(str); }
function utf8Decode(buf) { return new TextDecoder().decode(buf); }

// ===== IndexedDB =====
// identity: 秘密鍵一式 + セッション情報（'me' / 'session'）
// rooms:    ルームごとのメタ情報・ルーム鍵（keyPath: roomId）
// settings: 通知プレビューON/OFF、未読数などの軽い設定値

const DB_NAME = "e2ee-chat";
const DB_VERSION = 2;

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("identity")) db.createObjectStore("identity");
      if (!db.objectStoreNames.contains("rooms")) db.createObjectStore("rooms", { keyPath: "roomId" });
      if (!db.objectStoreNames.contains("settings")) db.createObjectStore("settings");
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbGet(storeName, key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const req = tx.objectStore(storeName).get(key);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}
async function idbPut(storeName, value, key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const req = key !== undefined ? tx.objectStore(storeName).put(value, key) : tx.objectStore(storeName).put(value);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
async function idbGetAll(storeName) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const req = tx.objectStore(storeName).getAll();
    req.onsuccess = () => resolve(req.result ?? []);
    req.onerror = () => reject(req.error);
  });
}
async function idbDelete(storeName, key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const req = tx.objectStore(storeName).delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// ===== AES-GCM（ルーム鍵での復号。プッシュ通知プレビュー生成にも使う） =====

async function importRoomKeyRaw(base64Raw) {
  return crypto.subtle.importKey("raw", base64ToBuf(base64Raw), { name: "AES-GCM" }, true, ["encrypt", "decrypt"]);
}
async function aesGcmDecryptJson(aesKey, ivBase64, ciphertextBase64) {
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: base64ToBuf(ivBase64) },
    aesKey,
    base64ToBuf(ciphertextBase64)
  );
  return JSON.parse(utf8Decode(plaintext));
}

// ===== 設定値の既定値 =====

const DEFAULT_SETTINGS = {
  previewOnLockScreen: true, // 通知にメッセージ内容を表示するか
  unreadCount: 0,
};

async function getSetting(key) {
  const v = await idbGet("settings", key);
  return v === null ? DEFAULT_SETTINGS[key] : v;
}
async function setSetting(key, value) {
  await idbPut("settings", value, key);
}


self.addEventListener("install", () => {
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

async function updateBadge() {
  const count = await getSetting("unreadCount");
  try {
    if (count > 0 && self.navigator && "setAppBadge" in self.navigator) {
      await self.navigator.setAppBadge(count);
    } else if (self.navigator && "clearAppBadge" in self.navigator) {
      await self.navigator.clearAppBadge();
    }
  } catch {
    // Badging API未対応のブラウザでは何もしない
  }
}

async function incrementUnread() {
  const current = await getSetting("unreadCount");
  await setSetting("unreadCount", current + 1);
  await updateBadge();
}

self.addEventListener("push", (event) => {
  event.waitUntil(handlePush(event));
});

async function handlePush(event) {
  let payload;
  try {
    payload = event.data ? event.data.json() : null;
  } catch {
    payload = null;
  }
  if (!payload || payload.kind !== "chat") return;

  const previewEnabled = await getSetting("previewOnLockScreen");
  let title = "E2EE Chat";
  let body = "新しいメッセージがあります";

  if (previewEnabled) {
    try {
      const room = await idbGet("rooms", payload.roomId);
      if (room && room.roomKeyRaw) {
        const roomKey = await importRoomKeyRaw(room.roomKeyRaw);
        const decrypted = await aesGcmDecryptJson(roomKey, payload.iv, payload.ciphertext);
        title = payload.fromDisplayName || "メッセージ";
        body = decrypted.text;
      } else {
        title = payload.fromDisplayName || title;
      }
    } catch {
      // 復号に失敗した場合は汎用メッセージのまま表示する
    }
  } else {
    title = "E2EE Chat";
    body = "新しいメッセージがあります（プレビュー非表示設定中）";
  }

  await incrementUnread();

  await self.registration.showNotification(title, {
    body,
    icon: "icons/icon-192.png",
    badge: "icons/badge-96.png",
    tag: `room-${payload.roomId}`, // 同じルームの通知はまとめて1件に更新する
    data: { roomId: payload.roomId },
  });
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const roomId = event.notification.data && event.notification.data.roomId;
  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
      const existing = allClients.find((c) => "focus" in c);
      if (existing) {
        existing.focus();
        existing.postMessage({ type: "open-room", roomId });
      } else {
        await self.clients.openWindow(`./index.html?room=${encodeURIComponent(roomId || "")}`);
      }
    })()
  );
});

// プッシュサービス側の都合で購読が失効・更新された場合、自動的に再購読しサーバへ再登録する
self.addEventListener("pushsubscriptionchange", (event) => {
  event.waitUntil(
    (async () => {
      const session = await idbGet("identity", "session");
      if (!session || !session.apiBase) return;
      try {
        const res = await fetch(`${session.apiBase}/push/vapid-public-key`);
        const { publicKey } = await res.json();
        const newSub = await self.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });
        await fetch(`${session.apiBase}/push/subscribe`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.token}` },
          body: JSON.stringify({ subscription: newSub.toJSON() }),
        });
      } catch (e) {
        console.error("プッシュ購読の再登録に失敗しました", e);
      }
    })()
  );
});

function urlBase64ToUint8Array(base64UrlString) {
  const padding = "=".repeat((4 - (base64UrlString.length % 4)) % 4);
  const base64 = (base64UrlString + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}
