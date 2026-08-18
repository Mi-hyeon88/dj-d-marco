const translations = {
    ko: {
    welcome: "환영합니다",
    home: "홈",
    homeText: "모든 것은 여기서 시작됩니다. 이 공간의 의미.",
    mural: "메시지",
    muralText: "팬들이 당신에게 전하고 싶은 이야기.",
    memories: "추억",
    memoriesText: "우리가 다시 떠올리고 싶은 것들: 당신을 떠올리게 하는 순간, 사진, 영상, 그리고 음악.",
    language: "언어 / LANGUAGE"
},

pt: {
    welcome: "SEJA BEM-VINDO",
    home: "INÍCIO",
    homeText: "Tudo começa aqui. O propósito deste espaço.",
    mural: "MURAL",
    muralText: "O que os fãs querem te dizer.",
    memories: "MEMÓRIAS",
    memoriesText: "O que queremos relembrar: momentos, fotos, vídeos e músicas que nos fazem lembrar de você.",
    language: "IDIOMA / LANGUAGE"
},

en: {
    welcome: "WELCOME",
    home: "HOME",
    homeText: "It all starts here. The purpose of this space.",
    mural: "MURAL",
    muralText: "What the fans want to tell you.",
    memories: "MEMORIES",
    memoriesText: "What we want to remember: moments, photos, videos and songs that remind us of you.",
    language: "LANGUAGE"
}

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

changeLanguage("ko");