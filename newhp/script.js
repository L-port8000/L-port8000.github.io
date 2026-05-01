const i18nData = {
    ja: {
        nav_home: "ホーム", nav_about: "私について", nav_projects: "プロジェクト", nav_contact: "連絡先", nav_etc: "その他",
        site_title: "あなたの名前", settings_title: "設定", mode_label: "ダークモード", lang_label: "言語",
        home_text: "ようこそ。",
        news: "おすすめ",
        about_text: "自己紹介の内容がここに入ります。",
        projects_text: "制作した作品の一覧です。",
        contact_text: "ご連絡はこちらから。"
    },
    en: {
        nav_home: "Home", nav_about: "About", nav_projects: "Projects", nav_contact: "Contact", nav_etc: "Etc",
        site_title: "Your Name", settings_title: "Settings", mode_label: "Dark Mode", lang_label: "Language",
        home_text: "Welcome.",
        news: "Recommended",
        about_text: "Here is where your bio goes.",
        projects_text: "A list of my works.",
        contact_text: "Get in touch here."
    },
    "zh-CN": {
        nav_home: "首页", nav_about: "关于", nav_projects: "项目", nav_contact: "联系", nav_etc: "其他",
        site_title: "你的名字", settings_title: "设置", mode_label: "深色模式", lang_label: "语言",
        home_text: "欢迎。",
        news: "推荐",
        about_text: "这里是关于我的介绍。",
        projects_text: "项目列表。",
        contact_text: "在这里联系我。"
    },
    "zh-TW": {
        nav_home: "首頁", nav_about: "關於", nav_projects: "項目", nav_contact: "聯繫", nav_etc: "其他",
        site_title: "你的名字", settings_title: "設置", mode_label: "深色模式", lang_label: "語言",
        home_text: "歡迎。",
        news: "推薦",
        about_text: "這裡是關於我的介紹。",
        projects_text: "項目列表。",
        contact_text: "在這裡聯繫我。"
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

const updateLanguage = (lang) => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (i18nData[lang][key]) el.textContent = i18nData[lang][key];
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
