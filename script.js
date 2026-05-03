const i18nData = {
    ja: {
        nav_home: "ホーム", nav_about: "私について", nav_projects: "プロジェクト", nav_blog: "ブログ", nav_contact: "連絡先", nav_etc: "その他",
        settings_title: "設定", mode_label: "ダークモード", lang_label: "言語",
        home_text: "ようこそ。こちらは一樹の個人ホームページです。\n特に大したものは有りませんが、ゆっくり見ていってください！",
        news: "おすすめ",
        about_text: "こんにちは！\nどうも一樹です！主にガジェット界隈に居ます\n結構ジャンル横断させてもらってます\n(例:中国語圏、情報技術系界隈等々)\n\n現在勉強中\n・中国語(簡体)\n・英語\n・電験三種\n・ITパスポート\n\nなどなど勉強中です。\n\n趣味\n・Windowsアプリ開発\n・Linuxいじり\n・アニメ、漫画\n・プログラミング\n・AIと討論（？）\n\n他にも個人的に興味のあるサイトなどをたくさん探したり、学タブでの規制突破方法を探したり、調べ物をするのがすきです。\nTwitterなどでも気軽に話しかけてください！ラフにリプされたらラフに答えます、丁寧にリプしてくれたら丁寧に答えるよう心がけています。\n皆さんこれからもよろしくお願いします！\n相互リンク募集中です！DMなどで教えてください！", // そいち相互リンクしよ
        projects_text: "制作した作品の一覧です\nつまらないものですがどうぞ",
        projects_text: "その名の通りIPを確認するツールですIPv4,IPv6両方表示されます。\nただIPv6しか無いものだとバグってIPv4にもIPv6が表示される\nという設計です。終わってますね。",
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
        backtohome: "←ホームに戻る"
    },
    en: {
        nav_home: "Home", nav_about: "About", nav_projects: "Projects", nav_blog: "blog", nav_contact: "Contact", nav_etc: "Other",
        settings_title: "Settings", mode_label: "Dark Mode", lang_label: "Language",
        home_text: "Welcome.",
        news: "Recommended",
        about_text: "This is where my profile goes.",
        projects_text: "A list of my works.",
        contact_text: "Get in touch here.",
        link_title: "Links",
        title_blank: "Open",
        archive_title: "Archive of Past Websites",
        archive_content: "This is a list of my past websites. Only the main index.html files are preserved.",
        archive_button: "Go to Archive Page",
        mirror_title: "mirror pages",
        about_hujin: "",
        blog_1: "",
        blog_2: "",
        blog_3: "",
        blog_4: "",
        backtohome: "←back to home"
    },
    "zh-CN": {
        nav_home: "首页", nav_about: "关于", nav_projects: "项目", nav_blog: "()()()", nav_contact: "联系", nav_etc: "其他",
        settings_title: "设置", mode_label: "深色模式", lang_label: "语言",
        home_text: "欢迎。",
        news: "推荐",
        about_text: "这里是我的个人介绍。",
        projects_text: "我的作品列表。",
        contact_text: "在这里联系我。",
        link_title: "友情链接",
        title_blank: "招募中",
        archive_title: "过往网站存档",
        archive_content: "这是我过去制作的网站列表，仅保存了主页面（index.html）。",
        archive_button: "前往存档页面",
        mirror_title: "",
        about_hujin: "",
        blog_1: "",
        blog_2: "",
        blog_3: "",
        blog_4: "",
        backtohome: ""
    },
    "zh-TW": {
        nav_home: "首頁", nav_about: "關於", nav_projects: "項目", nav_blog: "()()()", nav_contact: "聯繫", nav_etc: "其他",
        settings_title: "設置", mode_label: "深色模式", lang_label: "語言",
        home_text: "歡迎。",
        news: "推薦",
        about_text: "這裡是我的個人介紹。",
        projects_text: "我的作品列表。",
        contact_text: "在這裡聯繫我。",
        link_title: "友情連結",
        title_blank: "招募中",
        archive_title: "過去網站存檔",
        archive_content: "這是我過去製作的網站列表，僅保留主頁（index.html）。",
        archive_button: "前往存檔頁面",
        mirror_title: "",
        about_hujin: "",
        blog_1: "",
        blog_2: "",
        blog_3: "",
        blog_4: "",
        backtohome: ""
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


/* ★追加：\n → <br>変換関数 */
const formatText = (text) => {
    if (!text) return "";
    return text.replace(/\n/g, "<br>");
};


const updateLanguage = (lang) => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const value = i18nData[lang][key];

        if (value !== undefined) {
            el.innerHTML = formatText(value);
        }
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
