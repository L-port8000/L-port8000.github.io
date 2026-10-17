"use strict";


const DB_NAME = "e2ee-chat";

/**
 * 通知アイコン。以前は icons/icon-192.png を参照していたが、そのファイルが置かれていない
 * 環境では404になり、Android では showNotification 自体が失敗して通知が出ないことがあった。
 * ここに埋め込んでおけば外部取得が不要なので、必ずアイコン付きで表示できる。
 * （サイズはアプリの192x192アイコンと同じ）
 */
const ICON_DATA_URL = "data:image/png;base64,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";
const BADGE_DATA_URL = ICON_DATA_URL;

// 受信ログ（「通知が来ない」ときの切り分け用）。設定のIndexedDBに直近20件だけ残す。
const PUSH_LOG_KEY = "pushLog";
const PUSH_LOG_MAX = 20;

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

/** プッシュを受けた事実と結果を記録する（アプリの「通知の診断」に表示される）。 */
async function appendPushLog(entry) {
  try {
    const db = await openDb();
    const prev = (await idbGet(db, "settings", PUSH_LOG_KEY)) || [];
    const next = [entry, ...(Array.isArray(prev) ? prev : [])].slice(0, PUSH_LOG_MAX);
    await idbPut(db, "settings", next, PUSH_LOG_KEY);
  } catch {}
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

/** 通知を必ず出す。アイコン等の理由で失敗しても、最小構成で出し直す。
 *  （pushイベントでは「必ず通知を出す」必要があり、出せないとブラウザが購読を無効扱いにすることがある） */
async function showNotificationSafe(title, options) {
  try {
    await self.registration.showNotification(title, options);
    return null;
  } catch (e) {
    const msg = String((e && e.message) || e);
    try {
      // アイコン・バッジを外して再試行（アイコン取得失敗が原因のことがある）
      await self.registration.showNotification(title, {
        body: options.body,
        tag: options.tag,
        renotify: options.renotify,
        silent: options.silent,
        data: options.data,
      });
      return "アイコンなしで表示: " + msg;
    } catch (e2) {
      // 最後の手段（本文なし）
      await self.registration.showNotification(title, { tag: options.tag });
      return "最小構成で表示: " + msg;
    }
  }
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
  const hasVisibleWindow = windows.some((c) => c.visibilityState === "visible");
  // 開いているページには「プッシュが届いた」ことと「今すぐ同期して」を知らせる。
  // ページ側はこれを見て「プッシュが機能している」と判断し、二重通知を避ける。
  for (const c of windows) {
    try { c.postMessage({ type: "push", roomId: data.roomId || null, ts: Date.now() }); } catch {}
    try { c.postMessage({ type: "sync-now" }); } catch {}
  }

  const log = {
    ts: Date.now(),
    roomId: data.roomId || null,
    kind: data.kind || null,
    action: "",
    error: null,
    note: hasVisibleWindow ? "画面表示中のためページ側が通知" : "",
  };

  try {
    // テスト通知（設定画面の「テスト通知を送る」）は常に表示する
    if (data.kind === "test") {
      log.error = await showNotificationSafe("E2EE Chat", {
        body: "テスト通知です。この通知が見えていれば、アプリを閉じていても新着が届きます。",
        tag: "test",
        icon: ICON_DATA_URL,
        badge: BADGE_DATA_URL,
      });
      log.action = "テスト通知を表示";
      return;
    }

    // アプリの画面が表示中なら、ページ側が表示するのでここでは出さない
    if (hasVisibleWindow) { log.action = "表示しない（画面表示中）"; return; }

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
    log.error = await showNotificationSafe(title, {
      body: silentUpdate ? "メッセージが更新されました" : body,
      tag,
      renotify: !silentUpdate,
      silent: silentUpdate,
      icon: ICON_DATA_URL,
      badge: BADGE_DATA_URL,
      data: { roomId: data.roomId || null },
    });
    log.action = silentUpdate ? "更新通知を表示" : "通知を表示";

    if (silentUpdate) {
      // pushでは必ず通知を出す必要があるため一瞬だけ出して消す
      await new Promise((r) => setTimeout(r, 1200));
      const list = await self.registration.getNotifications({ tag });
      list.forEach((n) => n.close());
    }
  } catch (e) {
    log.error = String((e && e.message) || e);
    log.action = log.action || "エラー";
  } finally {
    await appendPushLog(log);
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
      await appendPushLog({ ts: Date.now(), roomId: null, kind: "subscriptionchange", action: "購読を張り直しました", error: null, note: "" });
    } catch (e) {
      await appendPushLog({ ts: Date.now(), roomId: null, kind: "subscriptionchange", action: "購読の張り直しに失敗", error: String((e && e.message) || e), note: "" });
    }
  })());
});
