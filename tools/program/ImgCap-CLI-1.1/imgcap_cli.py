# py -3.14 -m PyInstaller "imgcap_cli.py" --onefile --collect-all selenium --collect-all webdriver_manager --collect-all browser_cookie3 --add-data "data;data"
import os
import random
import traceback
from datetime import datetime
from urllib.parse import urlparse
from data.common import BASE_DIR, select_browser_interactively
import importlib

# サイトごとの専用モジュールマッピング
HANDLER_MAP = {
    "pixiv.net": "data.pixiv",
    "rawlazy.io":  "data.rawlazy",
}

def resolve_handler_module(url: str) -> str:
    """URLのホスト名から使用する処理モジュールを決める。"""
    try:
        host = (urlparse(url).hostname or "").lower()
    except Exception:
        return "data.default"

    for domain, module in HANDLER_MAP.items():
        domain = domain.lower()
        if host == domain or host.endswith("." + domain):
            return module
    return "data.default"

def main():
    print("=" * 55)
    print("  Bulk Image Extractor")
    print("  Cookie対応 / Canvas・Blob・Screenshot救済版")
    print("=" * 55)

    # URL入力
    print("\nURLをカンマ区切りで入力してください:")
    urls = [u.strip() for u in input("> ").split(',') if u.strip()]
    if not urls:
        print("URLが入力されていません。終了します。")
        return

    # ブラウザCookie選択
    _, browser_cookies = select_browser_interactively()

    # 最小サイズ
    try:
        min_size = int(input("\n最小画像サイズ（px）（0=全取得、例: 200）: "))
    except ValueError:
        min_size = 0

    # スレッド数
    try:
        max_workers = int(input("ダウンロードスレッド数（例: 10）: "))
    except ValueError:
        max_workers = 10

    # 特殊画像取得オプション
    print("\n─ 特殊画像取得オプション ─")
    print("  Canvas（WebGL・ゲーム描画など）")
    use_canvas = input("  取得する？ (y/n) > ").strip().lower() == 'y'
    print("  Blob URL（JS動的生成画像）")
    use_blob = input("  取得する？ (y/n) > ").strip().lower() == 'y'
    print("  img要素スクリーンショット（表示中の全画像を強制取得）")
    use_screenshot = input("  取得する？ (y/n) > ").strip().lower() == 'y'

    # 保存先
    date_str = datetime.now().strftime("%Y%m%d_%H%M%S")
    base_save_dir = os.path.join(
        BASE_DIR, "downloaded_images",
        f"{date_str}_{random.randint(1000,9999)}"
    )

    print(f"\n保存先    : {os.path.abspath(base_save_dir)}")
    print(f"URL数     : {len(urls)}")
    print(f"最小サイズ: {min_size}px  スレッド: {max_workers}")
    cookie_info = f"あり ({len(browser_cookies)}件)" if browser_cookies else "なし"
    print(f"Cookie    : {cookie_info}")
    print(f"Canvas={use_canvas}  Blob={use_blob}  Screenshot={use_screenshot}")

    if input("\n開始しますか？ (y/n): ").strip().lower() != 'y':
        print("キャンセルしました。")
        return

    grand_total = 0
    for i, url in enumerate(urls, 1):
        print(f"\n[{i}/{len(urls)}] {url}")

        mod_path = resolve_handler_module(url)
        print(f"  使用ハンドラ: {mod_path}")

        try:
            handler = importlib.import_module(mod_path)
            if not hasattr(handler, "process"):
                raise AttributeError(f"{mod_path} に process() がありません")
            count = handler.process(url, min_size, max_workers, base_save_dir,
                                    browser_cookies, use_canvas, use_blob, use_screenshot)
            grand_total += count
            print(f"  完了 → {count} 枚")
        except Exception as e:
            print(f"\n  [エラー] 処理に失敗しました: {e}")
            traceback.print_exc()

    print(f"\n{'='*55}")
    print(f"  全処理完了！  合計: {grand_total} 枚")
    print(f"  保存場所: {os.path.abspath(base_save_dir)}")
    print(f"{'='*55}")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n中断されました。")
    except Exception as e:
        print(f"\n予期せぬエラー:\n{e}")
        traceback.print_exc()
    finally:
        print("\nEnterキーを押すと終了します...")
        input()
