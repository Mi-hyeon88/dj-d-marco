document.addEventListener("DOMContentLoaded", () => {

    const idiomas = {
        ko: {
            pagina: "환영합니다",
            cards: [
                {
                    titulo: "홈",
                    texto: "모든 것은 여기에서 시작됩니다. 이 공간의 의미입니다."
                },
                {
                    titulo: "메시지",
                    texto: "팬들이 당신에게 전하고 싶은 이야기."
                },
                {
                    titulo: "추억",
                    texto: "우리가 기억하고 싶은 것: 당신을 떠올리게 하는 순간, 사진, 영상, 음악."
                }
            ]
        },

        pt: {
            pagina: "Bem-vindo",
            cards: [
                {
                    titulo: "Início",
                    texto: "Tudo começa aqui. O propósito deste espaço."
                },
                {
                    titulo: "Mensagem",
                    texto: "O que os fãs querem te dizer."
                },
                {
                    titulo: "Memórias",
                    texto: "O que queremos relembrar: momentos, fotos, vídeos e músicas que nos fazem lembrar de você."
                }
            ]
        },

        en: {
            pagina: "Welcome",
            cards: [
                {
                    titulo: "Home",
                    texto: "Everything starts here. The purpose of this space."
                },
                {
                    titulo: "Message",
                    texto: "What the fans want to tell you."
                },
                {
                    titulo: "Memories",
                    texto: "What we want to remember: moments, photos, videos and songs that remind us of you."
                }
            ]
        }
    };


    const botoes = document.querySelectorAll(
        ".idiomas button[data-language]"
    );

    const tituloPrincipal = document.querySelector(
        ".boas-vindas h1"
    );

    const cards = document.querySelectorAll(
        ".navegacao .card"
    );

    const idiomaTopo = document.querySelector(
        ".seletor-topo span:nth-child(2)"
    );


    function mudarIdioma(idioma) {

        const traducao = idiomas[idioma];

        if (!traducao) return;


        /* =========================
           TÍTULO PRINCIPAL
        ========================== */

        if (tituloPrincipal) {
            tituloPrincipal.textContent = traducao.pagina;
        }


        /* =========================
           CARDS
        ========================== */

        cards.forEach((card, index) => {

            const dados = traducao.cards[index];

            if (!dados) return;

            const titulo = card.querySelector("h2");
            const texto = card.querySelector("p");

            if (titulo) {
                titulo.textContent = dados.titulo;
            }

            if (texto) {
                texto.textContent = dados.texto;
            }

        });


        /* =========================
           BOTÃO ATIVO
        ========================== */

        botoes.forEach(botao => {

            botao.classList.toggle(
                "ativo",
                botao.dataset.language === idioma
            );

        });


        /* =========================
           SELETOR DO TOPO
        ========================== */

        if (idiomaTopo) {
            idiomaTopo.textContent = idioma.toUpperCase();
        }


        /* =========================
           HTML LANG
        ========================== */

        document.documentElement.lang = idioma;


        /* =========================
           SALVAR IDIOMA
        ========================== */

        localStorage.setItem(
            "idiomaDMarco",
            idioma
        );

    }


    /* =========================
       CLIQUE NOS IDIOMAS
    ========================== */

    botoes.forEach(botao => {

        botao.addEventListener("click", () => {

            mudarIdioma(
                botao.dataset.language
            );

        });

    });


    /* =========================
       IDIOMA INICIAL
    ========================== */

    const idiomaSalvo =
        localStorage.getItem("idiomaDMarco");


    if (
        idiomaSalvo &&
        idiomas[idiomaSalvo]
    ) {

        mudarIdioma(idiomaSalvo);

    } else {

        mudarIdioma("ko");

    }

});
