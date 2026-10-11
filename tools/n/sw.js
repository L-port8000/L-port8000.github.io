"use strict";

/**
 * E2EE Chat — Service Worker（プッシュ通知専用・単体で完結。importScriptsなし）
 *
 * index.html と同じフォルダに置くと、アプリを閉じていてもプッシュ通知が届くようになる。
 * 置かなくてもチャット本体は動く（その場合、通知はアプリを開いている間だけ）。
 *
 * サーバから届くpushペイロード: { kind, roomId, from, fromDisplayName, iv, ciphertext, ts }
 *   - ciphertext はルーム鍵(AES-GCM)で暗号化されたまま。サーバは中身を知らない。
 *   - 「通知に内容を表示する」がONで、この端末にルーム鍵があるときだけ、ここで復号して本文を出す。
 */

const DB_NAME = "e2ee-chat";

function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME);
    // 未ログイン（DBがまだ無い）なら作らずに中止する
    req.onupgradeneeded = () => { try { req.transaction.abort(); } catch {} };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
function idbGet(db, store, key) {
  return new Promise((resolve) => {
    try {
      if (!db.objectStoreNames.contains(store)) return resolve(null);
      const req = db.transaction(store, "readonly").objectStore(store).get(key);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => resolve(null);
    } catch { resolve(null); }
  });
}
function idbPut(db, store, value, key) {
  return new Promise((resolve) => {
    try {
      if (!db.objectStoreNames.contains(store)) return resolve();
      const tx = db.transaction(store, "readwrite");
      tx.objectStore(store).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch { resolve(); }
  });
}

function base64ToBuf(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}
async function decryptJson(rawKeyB64, ivB64, ciphertextB64) {
  const key = await crypto.subtle.importKey("raw", base64ToBuf(rawKeyB64), { name: "AES-GCM" }, false, ["decrypt"]);
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: base64ToBuf(ivB64) }, key, base64ToBuf(ciphertextB64));
  return JSON.parse(new TextDecoder().decode(plain));
}

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  event.waitUntil(handlePush(event));
});

async function handlePush(event) {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch {}

  // アプリの画面が表示中なら、アプリ側が通知・表示を行うのでここでは出さない
  const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  if (windows.some((c) => c.visibilityState === "visible")) return;

  let db = null;
  try { db = await openDb(); } catch {}

  let showBody = true;
  let room = null;
  if (db) {
    showBody = (await idbGet(db, "settings", "previewOnLockScreen")) !== false;
    if (data.roomId) room = await idbGet(db, "rooms", data.roomId);
  }

  let title = "E2EE Chat";
  let body = "新しいメッセージがあります";
  let silentUpdate = false;

  if (showBody && room && room.roomKeyRaw && data.iv && data.ciphertext) {
    try {
      const msg = await decryptJson(room.roomKeyRaw, data.iv, data.ciphertext);
      if (msg.kind === "text") {
        body = String(msg.text ?? "").slice(0, 300) || body;
        const label = (room.alias || room.name || "").trim();
        const sender = data.fromDisplayName || "新着メッセージ";
        title = room.kind === "group" && label ? `${label} ・ ${sender}` : sender;
      } else {
        silentUpdate = true; // 編集・削除の通知は目立たせない
      }
    } catch {
      // 復号できなければ汎用の通知にする
    }
  } else if (showBody && data.fromDisplayName) {
    title = data.fromDisplayName;
  }

  // 未読バッジ
  let count = 0;
  if (db) {
    count = ((await idbGet(db, "settings", "unreadCount")) || 0) + (silentUpdate ? 0 : 1);
    await idbPut(db, "settings", count, "unreadCount");
  }
  try { if (count > 0 && self.navigator.setAppBadge) await self.navigator.setAppBadge(count); } catch {}

  const tag = silentUpdate ? `upd-${data.roomId || "x"}` : `room-${data.roomId || "x"}`;
  await self.registration.showNotification(title, {
    body: silentUpdate ? "メッセージが更新されました" : body,
    tag,
    renotify: !silentUpdate,
    silent: silentUpdate,
    data: { roomId: data.roomId || null },
  });

  if (silentUpdate) {
    // pushでは必ず通知を出す必要があるため一瞬だけ出して消す
    await new Promise((r) => setTimeout(r, 1200));
    const list = await self.registration.getNotifications({ tag });
    list.forEach((n) => n.close());
  }
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const roomId = event.notification.data?.roomId || null;
  event.waitUntil((async () => {
    let pageUrl = null;
    try { const db = await openDb(); pageUrl = await idbGet(db, "settings", "pageUrl"); } catch {}
    const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of windows) {
      if ("focus" in c) {
        await c.focus();
        c.postMessage({ type: "open-room", roomId });
        return;
      }
    }
    const url = new URL(pageUrl || self.registration.scope);
    if (roomId) url.searchParams.set("room", roomId);
    await self.clients.openWindow(url.href);
  })());
});

// pushの購読が無効になったとき（ブラウザ側の更新など）は、可能なら自動で張り直してサーバに再登録する
self.addEventListener("pushsubscriptionchange", (event) => {
  event.waitUntil((async () => {
    try {
      const db = await openDb();
      const session = await idbGet(db, "identity", "session");
      if (!session?.token || !session?.apiBase) return;
      const options = event.oldSubscription?.options;
      const sub = await self.registration.pushManager.subscribe(options || { userVisibleOnly: true });
      await fetch(`${session.apiBase}/push/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      });
    } catch {}
  })());
});
