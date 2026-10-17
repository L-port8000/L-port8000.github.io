"use strict";


const DB_NAME = "e2ee-chat";
// アイコン画像（無ければブラウザ既定のアイコンになるだけで、通知自体は出る）
const ICON_URL = new URL("icons/icon-192.png", self.registration.scope).href;
const BADGE_URL = new URL("icons/badge-96.png", self.registration.scope).href;

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
function urlBase64ToUint8Array(b64url) {
  const padding = "=".repeat((4 - (b64url.length % 4)) % 4);
  const raw = atob((b64url + padding).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
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

  const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  // 開いているページには「今すぐ同期して」と知らせる（pushが届いた＝新着がある。定期的な問い合わせを待たずに表示できる）
  for (const c of windows) { try { c.postMessage({ type: "sync-now" }); } catch {} }

  // テスト通知（設定画面の「テスト通知を送る」）は常に表示する
  if (data.kind === "test") {
    await self.registration.showNotification("E2EE Chat", {
      body: "テスト通知です。この通知が見えていれば、アプリを閉じていても新着が届きます。",
      tag: "test",
      icon: ICON_URL,
      badge: BADGE_URL,
    });
    return;
  }

  // アプリの画面が表示中なら、ページ側が表示するのでここでは出さない
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
    icon: ICON_URL,
    badge: BADGE_URL,
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
      // サーバの「今の」VAPID公開鍵があればそれで張り直す（サーバ側で鍵が作り直されていても食い違わない）。
      // 取得できなければ、以前の購読と同じ鍵を使う。
      let applicationServerKey = event.oldSubscription?.options?.applicationServerKey;
      try {
        const res = await fetch(`${session.apiBase}/push/vapid-public-key`);
        if (res.ok) {
          const { publicKey } = await res.json();
          if (publicKey) applicationServerKey = urlBase64ToUint8Array(publicKey);
        }
      } catch {}
      const options = { userVisibleOnly: true };
      if (applicationServerKey) options.applicationServerKey = applicationServerKey;
      const sub = await self.registration.pushManager.subscribe(options);
      await fetch(`${session.apiBase}/push/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      });
    } catch {}
  })());
});
