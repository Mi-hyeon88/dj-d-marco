const translations = {
    ko: {
        welcome: "환영합니다",
        home: "홈",
        homeText: "이 공간의 이야기와 의미를 만나보세요.",
        mural: "메시지",
        muralText: "전 세계 팬들이 남긴 메시지와 마음을 만나보세요.",
        memories: "추억",
        memoriesText: "당신을 떠올리게 하는 음악과 소중한 순간들.",
        language: "언어 / LANGUAGE"
    },

    pt: {
        welcome: "SEJA BEM-VINDO",
        home: "INÍCIO",
        homeText: "Conheça o projeto, o propósito e quem idealizou este espaço.",
        mural: "MURAL",
        muralText: "Leia mensagens, homenagens e palavras deixadas para você.",
        memories: "MEMÓRIAS",
        memoriesText: "Músicas, fotografias e momentos que queremos guardar.",
        language: "IDIOMA / LANGUAGE"
    },

    en: {
        welcome: "WELCOME",
        home: "HOME",
        homeText: "Discover the project, its purpose and the story behind this space.",
        mural: "MESSAGES",
        muralText: "Read messages, tributes and words left especially for you.",
        memories: "MEMORIES",
        memoriesText: "Music, photographs and moments we want to keep.",
        language: "LANGUAGE"
    }
};

const welcome = document.querySelector(".boas-vindas h1");
const cards = document.querySelectorAll(".card");
const languageLabel = document.querySelector(".idioma span:nth-child(2)");

const languageButtons = document.querySelectorAll(".idiomas button");

function changeLanguage(language) {

    const text = translations[language];

    welcome.textContent = text.welcome;
    cards[0].querySelector("h2").textContent = text.home;
cards[0].querySelector("p").textContent = text.homeText;

cards[1].querySelector("h2").textContent = text.mural;
cards[1].querySelector("p").textContent = text.muralText;

cards[2].querySelector("h2").textContent = text.memories;
cards[2].querySelector("p").textContent = text.memoriesText;
    languageLabel.textContent = text.language;

    document.documentElement.lang = language;

    languageButtons.forEach(button => {
        button.classList.remove("ativo");
    });

    document
        .querySelector(`.idiomas button[data-language="${language}"]`)
        .classList.add("ativo");
}

languageButtons.forEach(button => {

    button.addEventListener("click", () => {

        changeLanguage(button.dataset.language);

    });

});