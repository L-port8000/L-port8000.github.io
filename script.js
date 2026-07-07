// 共通
const i18nData = {
    ja: {
        nav_home: "ホーム", nav_about: "私について", nav_projects: "プロジェクト", nav_blog: "ブログ", nav_contact: "連絡先", nav_etc: "その他",
        settings_title: "設定", mode_label: "ダークモード", lang_label: "言語",
        home_text: "ようこそ。こちらは一樹の個人ホームページです。\n特に大したものは有りませんが、ゆっくり見ていってください！",
        news: "おすすめ",
        about_text: "こんにちは！\nどうも一樹です！主にガジェット界隈に居ます\n結構ジャンル横断させてもらってます\n(例:中国語圏、情報技術系界隈等々)\n\n現在勉強中\n・中国語(簡体)\n・英語\n・電験三種\n・ITパスポート\n\nなどなど勉強中です。\n\n趣味\n・Windowsアプリ開発\n・Linuxいじり\n・アニメ、漫画\n・プログラミング\n・AIと討論（？）\n\n他にも個人的に興味のあるサイトなどをたくさん探したり、学タブでの規制突破方法を探したり、調べ物をするのがすきです。\nTwitterなどでも気軽に話しかけてください！ラフにリプされたらラフに答えます、丁寧にリプしてくれたら丁寧に答えるよう心がけています。\n皆さんこれからもよろしくお願いします！\n相互リンク募集中です！DMなどで教えてください！", // そいち相互リンクありがと
        slink_404: "404 Not Found!",
        soichiaishiteru: "Soichiのホームページ！！！<br>かっこいい",
        User0899: "User0899のホームページ。\niPhone 4sでも問題なく開けるとか。頻繁に鯖落ちしてます。",
        kotosandaaaa: "ことだよ！！のホームページ。\nとても可愛いサカバンパスピスです",
        Jüw: "Jüwのホームページ。\n多言語勉強中らしい...。結構フレンドリーな人です！",
        taitaitai: "taitai2661のホーム。\n最近いろんなWebツール作ってる",
        K_anon: "奏音のホームページ。\n私の垢の古参の人！中国語ができて、知識豊富な人で尊敬してる",
        Aizu: "博麗紅葉のホームページ\n音MAD系詳しい人、知識量がとにかくすごい",
        Name: "TheNameのホームページ\n博麗紅葉のドッペルゲンガー、たぶんこの人も頭いい",
        marunoringo: "マルノリンゴ。\nブログたくさん書いてる人です。",
        Liyun: "丽丽云のホームページ\nめちゃくちゃ桜が舞っている綺麗なウェブサイトです！",
        redirtect_slink: "相互リンク専用ページを開く",
        projects_text: "制作した作品の一覧です\nつまらないものですがどうぞ",
        project1_text: "その名の通りIPを確認するツールですIPv4,IPv6両方表示されます。\nただIPv6しか無いものだとバグってIPv4にもIPv6が表示される\nという設計です。終わってますね。",
        project2_text: "画像を画質を選択してPDFに変換するツールです(Gemini製)",
        web_tools: "WEBツール",
        app_tools: "アプリケーション",
        contact_text: "ご連絡はこちらから",
        link_title: "相互リンク",
        title_blank: "募集中",
        archive_title: "過去ホームページアーカイブ",
        archive_content: "私の過去のホームページの一覧です。メインのindex.htmlのみ保存しています。",
        archive_button: "アーカイブページへ",
        mirror_title: "ミラーページ",
        about_hujin: "布陣",
        blog_1: "アカウントが乗っ取られた話",
        blog_2: "アカウントが復元できた話",
        blog_3: "",
        blog_4: "",
        202601211: "アカウントが乗っ取られた時の話",
        202601251: "アカウントが復元できた話",
        backtohome: "←ホームに戻る",
        other_title: "まだ何もありません"
    },
    en: {
        nav_home: "Home", nav_about: "About", nav_projects: "Projects", nav_blog: "blog", nav_contact: "Contact", nav_etc: "Other",
        settings_title: "Settings", mode_label: "Dark Mode", lang_label: "Language",
        home_text: "Welcome. This is Ituki's personal website. \nThere's nothing particularly special here, but please take your time and have a look around！",
        news: "Recommended",
        about_text: "Hello!\nHi, I’m Ituki! I’m mainly active in the gadget community on X,\nbut I also dabble in a variety of other fields\n(e.g., the X's Chinese-speaking world, the X's IT community, etc.).\n\nCurrently studying:\n・Simplified Chinese\n・English\n・Chief Electrical Engineer (Grade 3)\n・IT Passport\n\nand more. \n\nHobbies\n・Windows app development\n・Tinkering with Linux\n・Anime and manga\n・Programming\n・Discuss with AI (?)\n\nI also enjoy searching for websites that interest me, figuring out ways to bypass restrictions on study platforms, and doing research. \nFeel free to reach out to me on Twitter or elsewhere! If you reply casually, I’ll reply casually; if you reply politely, I try to reply politely. \nI look forward to your continued support! \nI’m looking for link exchanges! Please let me know via DM or similar!",
        slink_404: "404 Not Found!",
        soichiaishiteru: "Soichi's Homepage！！！<br>too cooool!!!",
        User0899: "User0899's Homepage.\nIt opens without any problems even on an iPhone 4s. The server crashes frequently.",
        kotosandaaaa: "ことだよ！！'s Homepage.\nIt is a very cute Sacabambaspis.",
        Jüw: "Jüw's Homepage.\nSeems to be studying multiple languages... A quite friendly person!",
        taitaitai: "taitai2661's Homepage.\nRecently making various Web tools.",
        K_anon: "奏音's Homepage.\nAn old-timer follower of my account! Respect them because they can speak Chinese and are highly knowledgeable.",
        Aizu: "博麗紅葉's Homepage\nA person familiar with Oto-MAD, their amount of knowledge is just amazing.",
        Name: "TheName's Homepage\n博麗紅葉's doppelganger, probably this person is also smart.",
        marunoringo: "マルノリンゴ's Homepage\nHe is writting too many blogs!",
        Liyun: "丽丽云's Homepage!\nIt’s a beautiful website with cherry blossoms fluttering about!",
        redirtect_slink: "To the List of Mutual Links",
        projects_text: "A list of my works.",
        project1_text: "",
        project2_text: "",
        web_tools: "WEB tools",
        app_tools: "Applications",
        contact_text: "Get in touch here.",
        link_title: "Links",
        title_blank: "Open",
        archive_title: "Archive of Past Websites",
        archive_content: "This is a list of my past websites. Only the main index.html files are preserved.",
        archive_button: "Go to Archive Page",
        mirror_title: "mirror pages",
        about_hujin: "my Devices",
        blog_1: "My account was hacked",
        blog_2: "I got my account back",
        blog_3: "",
        blog_4: "",
        202601211: "When My Account Got Hacked",
        202601251: "How I Recovered My Account",
        backtohome: "←back to home",
        other_title: "Nothing here yet."
    },
    "zh-CN": {
        nav_home: "首页", nav_about: "关于", nav_projects: "项目", nav_blog: "博客", nav_contact: "联系", nav_etc: "其他",
        settings_title: "设置", mode_label: "深色模式", lang_label: "语言",
        home_text: "欢迎。这是Ituki的个人网站。\n这里没什么特别之处，但请您慢慢逛，随意看看！",
        news: "推荐",
        about_text: "你好！\n大家好，我是Ituki！我主要活跃在X平台上的科技圈，\n但也涉猎其他各种领域\n（例如X平台的中文圈、X平台的IT社区等）。\n\n目前正在学习：\n・简体中文\n・英语\n・首席电气工程师（3级）\n・IT护照\n\n等等。\n\n兴趣爱好\n・Windows应用开发\n・折腾Linux\n・动漫与漫画\n・编程\n・与AI对话（？）\n\n我还喜欢搜寻感兴趣的网站、研究如何绕过学习平台的限制，以及进行各种研究。\n欢迎在Twitter或其他平台联系我！如果你随意回复，我会随意回复；如果你礼貌回复，我会尽量礼貌回复。\n期待大家继续支持！\n正在寻找链接交换！请通过私信等方式联系我！",
        slink_404: "404 Not Found!",
        soichiaishiteru: "Soichi的网首！！！<br>他非常帅气！",
        User0899: "User0899的网首。\n据说用 iPhone 4s 也能正常打開。不過服務器經常炸服...",
        kotosandaaaa: "ことだよ！！的网首。\n是一隻非常可愛的薩卡班巴魚！",
        Jüw: "Jüw的网首。\n听说正在学習多国語言...。是一個挺随和的人！",
        taitaitai: "taitai2661的网首。\n最近在製作各種各樣的 Web 工具。",
        K_anon: "奏音的网首。\n我账号的老粉！会説中国話、知識淵博，非常令人尊敬。",
        Aizu: "博麗紅葉的网首\n對音 MAD 領域很了解的人，知識量總之超級厲害。",
        Name: "TheName的网首\n博麗紅葉的分身（雙胞胎?），估計這人也很聡明。",
        marunoringo: "マルノリンゴ的网首。\n是一位寫了好多博客的人。",
        Liyun: "丽丽云的网首\n充满美丽樱花的网站！",
        redirtect_slink: "前往友情链接列表",
        projects_text: "我的作品列表。",
        project1_text: "",
        project2_text: "",
        app_tools: "应用列表",
        web_tools: "Web工具列表",
        contact_text: "在这里联系我。",
        link_title: "友情链接",
        title_blank: "招募中",
        archive_title: "过往网站存档",
        archive_content: "这是我过去制作的网站列表，仅保存了主页面（index.html）。",
        archive_button: "前往存档页面",
        mirror_title: "镜像网站",
        about_hujin: "我的设备",
        blog_1: "我的账号被盗了",
        blog_2: "我找回了我的账号",
        blog_3: "",
        blog_4: "",
        202601211: "关于账号被盗的那点事",
        202601251: "關於帳號被盜的那點事",
        backtohome: "←返回首页",
        other_title: "目前什么都没有..."
    },
    "zh-TW": {
        nav_home: "首頁", nav_about: "關於", nav_projects: "項目", nav_blog: "部落格", nav_contact: "聯繫", nav_etc: "其他",
        settings_title: "設置", mode_label: "深色模式", lang_label: "語言",
        home_text: "欢迎。这是Ituki的个人网站。\n这里没什么特别之处，但请您慢慢逛，随意看看！",
        news: "推薦",
        about_text: "你好！\n大家好，我是Ituki！我主要活跃在X平台上的科技圈，\n但也涉猎其他各种领域\n（例如X平台的中文圈、X平台的IT社区等）。\n\n目前正在学习：\n・简体中文\n・英语\n・首席电气工程师（3级）\n・IT护照\n\n等等。\n\n兴趣爱好\n・Windows应用开发\n・折腾Linux\n・动漫与漫画\n・编程\n・与AI对话（？）\n\n我还喜欢搜寻感兴趣的网站、研究如何绕过学习平台的限制，以及进行各种研究。\n欢迎在Twitter或其他平台联系我！如果你随意回复，我会随意回复；如果你礼貌回复，我会尽量礼貌回复。\n期待大家继续支持！\n正在寻找链接交换！请通过私信等方式联系我！",
        slink_404: "404 Not Found!",
        soichiaishiteru: "Soichi的網頁！！！<br>他非常帥氣！",
        User0899: "User0899的網頁。\niPhone 4s 也能正常打開。不過伺服器經常炸裂...",
        kotosandaaaa: "ことだよ！！的網頁。\n是一隻非常可愛的萨卡班巴鱼！",
        Jüw: "Jüw的網頁。\n聽說正在學習多國語言...。是一個挺隨和的人！",
        taitaitai: "taitai2661的網頁。\n最近在製作各種各樣的 Web 工具。",
        K_anon: "奏音的網頁。\n我账号的老粉！会説中国話、知識淵博，非常令人尊敬。",
        Aizu: "博麗紅葉的網頁\n對音 MAD 領域很了解的人，知識量總之超級厲害。",
        Name: "TheName的網頁\n博麗紅葉的分身（雙胞胎?），估計這人也很聰明。",
        marunoringo: "マルノリンゴ的網頁。\n是一位寫了好多部落格的人。",
        Liyun: "丽丽云的網頁\n充滿美麗櫻花的網站！",
        redirtect_slink: "前往友情連結列表",
        projects_text: "我的作品列表。",
        project1_text: "",
        project2_text: "",
        app_tools: "应用程序列表",
        web_tools: "Web工具列表",
        contact_text: "在這裡聯繫我。",
        link_title: "友情連結",
        title_blank: "招募中",
        archive_title: "過去網站存檔",
        archive_content: "這是我過去製作的網站列表，僅保留主頁（index.html）。",
        archive_button: "前往存檔頁面",
        mirror_title: "镜像网站",
        about_hujin: "我的设备",
        blog_1: "我的账号被盗了",
        blog_2: "我找回了我的账号",
        blog_3: "",
        blog_4: "",
        202601211: "アカウントが乗っ取られた時の話",
        202601251: "アカウントが復元できた話",
        backtohome: "←返回首頁",
        other_title: "目前什麼都沒有..."
    }
};

const elements = {
    trigger: document.getElementById('menuTrigger'),
    close: document.getElementById('menuClose'),
    sideMenu: document.getElementById('sideMenu'),
    overlay: document.getElementById('overlay'),
    themeToggle: document.getElementById('themeToggle'),
    navLinks: document.getElementById('navLinks'),
    indicator: document.getElementById('scrollIndicator'),
    langBtns: document.querySelectorAll('.lang-btn')
};

const toggleMenu = () => {
    elements.sideMenu.classList.toggle('open');
    elements.overlay.classList.toggle('open');
};
elements.trigger.onclick = toggleMenu;
elements.close.onclick = toggleMenu;
elements.overlay.onclick = toggleMenu;


elements.themeToggle.onchange = (e) => {
    const theme = e.target.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
};


const formatText = (text) => {
    if (!text) return "";
    return text.replace(/\n/g, "<br>");
};


const updateLanguage = (lang) => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = i18nData[lang][key];
        if (value !== undefined) el.innerHTML = formatText(value);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const value = i18nData[lang][key];
        if (value !== undefined) el.placeholder = value;
    });

    localStorage.setItem('lang', lang);
    elements.langBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
};


elements.langBtns.forEach(btn => {
    btn.onclick = () => updateLanguage(btn.getAttribute('data-lang'));
});


const handleHashChange = () => {
    const hash = window.location.hash || '#home';
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    const target = document.querySelector(hash);
    if (target) {
        target.classList.add('active');
        if (elements.sideMenu.classList.contains('open')) toggleMenu();
    }
};

const updateIndicator = () => {
    const scrollRight = elements.navLinks.scrollWidth - (elements.navLinks.scrollLeft + elements.navLinks.clientWidth);
    elements.indicator.style.opacity = scrollRight > 20 ? "1" : "0";
};

// slink search
(function () {
    const input = document.getElementById('linkSearch');
    const grid = document.getElementById('bannerGrid');
    const noResults = document.getElementById('linkNoResults');
    if (!input || !grid) return;

    const items = Array.from(grid.querySelectorAll('.banner-item'));

    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        let visibleCount = 0;

        items.forEach(item => {
            const nameEl = item.querySelector('.banner-name');
            const text = nameEl ? nameEl.textContent.toLowerCase() : '';
            const img = item.querySelector('img');
            const altText = img ? (img.getAttribute('alt') || '').toLowerCase() : '';
            const match = !query || text.includes(query) || altText.includes(query);
            item.style.display = match ? '' : 'none';
            if (match) visibleCount++;
        });

        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    });
})();

window.addEventListener('hashchange', handleHashChange);
elements.navLinks.addEventListener('scroll', updateIndicator);

window.onload = () => {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    elements.themeToggle.checked = theme === 'dark';
    updateLanguage(localStorage.getItem('lang') || 'ja');
    handleHashChange();
    updateIndicator();
};

// Blog
document.addEventListener('DOMContentLoaded', () => {
    const blogSearch = document.getElementById('blogSearch');
    const tagButtons = document.querySelectorAll('.tag-btn');
    const blogCards = document.querySelectorAll('.blog-card');

    const performFilter = () => {
        const query = blogSearch.value.trim().toLowerCase();
        const activeBtn = document.querySelector('.tag-btn.active');
        const activeTag = activeBtn ? activeBtn.dataset.tag.toLowerCase() : 'all';

        blogCards.forEach(card => {
            const title = card.querySelector('.post-title').textContent.toLowerCase();
            const tagsAttr = card.dataset.tags || "";
            const tagsArray = tagsAttr.toLowerCase().split(' ');

            let isVisible = true;

            if (query !== "") {
                if (query.startsWith('#')) {
                    const tagQuery = query.substring(1);
                    isVisible = tagsArray.some(t => t.includes(tagQuery));
                } else {
                    isVisible = title.includes(query);
                }
            }

            if (isVisible && activeTag !== 'all') {
                isVisible = tagsArray.includes(activeTag);
            }

            card.style.display = isVisible ? 'block' : 'none';
        });
    };

    if (blogSearch) {
        blogSearch.addEventListener('input', performFilter);
    }

    tagButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tagButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            performFilter();
        });
    });
});

window.addEventListener("load", () => {
    const loader = document.getElementById("loader");

    loader.style.transition = "opacity 0.5s";
    loader.style.opacity = "0";

    setTimeout(() => {
        loader.style.display = "none";
    }, 500);
});
