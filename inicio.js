document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       TRADUÇÕES
    ====================================================== */

    const traducoes = {

        ko: {

            nav: {
    paraVoce: "당신을 위해",
    mensagens: "메시지",
    memorias: "추억"
},

            abertura: `
                이곳은 당신을 위해 만들어졌습니다.
            `,

            paragrafo1:
                "언제든 다시 돌아오고 싶을 때, 당신이 이곳에 남겨둔 순간들의 일부를 다시 만날 수 있도록.",

            paragrafo2:
                "어쩌면 당신은 알아차리지 못할지도 모릅니다. 하지만 당신의 모습은 사람들의 마음을 스쳐 갑니다. 당신의 자연스럽고, 즐겁고, 특별한 모습은 오래 남습니다.",

            paragrafo3:
                "그리고 세상 곳곳에는 당신을 아끼는 사람들이 있습니다. 당신이 어디로 가든 잘 되기를 바라는 사람들이.",

            paragrafo4:
                "그러니 이것을 기억하고 싶을 때, 돌아오세요. 이곳은 언제나 여기 있을 테니까요.",

            porque:
                "왜냐하면 이곳에서,",

            estrela:
                "당신은 우리의<br><em>가장 큰 별입니다.</em><b>✦</b>",

            assinatura1:
                "프로젝트 기획",

            assinatura2:
                "ADM DA @FANPAGE_D.MARCOEFFECT"
        },


        pt: {

            nav: {
    paraVoce: "PARA VOCÊ",
    mensagens: "MENSAGENS",
    memorias: "MEMÓRIAS"
},

            abertura:
                "este lugar foi criado<br><span>para você.</span>",

            paragrafo1:
                "Para que, quando quiser voltar,<br>possa encontrar aqui um pouco<br>dos momentos que deixou pelo caminho.",

            paragrafo2:
                "Talvez você nem perceba,<br>mas o seu jeito de ser atravessa pessoas.<br>Seu jeito <span>espontâneo</span>, <span>divertido</span> e único fica.",

            paragrafo3:
                "E existem pessoas, em diferentes<br>lugares do mundo, que guardam<br>um <span>carinho</span> por você e torcem por onde<br>quer que você vá.",

            paragrafo4:
                "Então, quando quiser lembrar disso, volte.<br>Este lugar estará aqui.",

            porque:
                "Porque aqui,",

            estrela:
                "você é a nossa<br><em>estrela maior.</em><b>✦</b>",

            assinatura1:
                "PROJETO IDEALIZADO PELA",

            assinatura2:
                "ADM DA @FANPAGE_D.MARCOEFFECT"
        },


        en: {

            nav: {
    paraVoce: "FOR YOU",
    mensagens: "MESSAGES",
    memorias: "MEMORIES"
},

            abertura:
                "this place was created<br><span>for you.</span>",

            paragrafo1:
                "So that, whenever you want to return,<br>you can find here a little of<br>the moments you left along the way.",

            paragrafo2:
                "Maybe you don't even realize it,<br>but the way you are touches people.<br>Your <span>spontaneous</span>, <span>fun</span> and unique way stays with us.",

            paragrafo3:
                "And there are people, in different<br>places around the world, who hold<br><span>affection</span> for you and wish you well,<br>wherever you may go.",

            paragrafo4:
                "So, whenever you want to remember this, come back.<br>This place will be here.",

            porque:
                "Because here,",

            estrela:
                "you are our<br><em>greatest star.</em><b>✦</b>",

            assinatura1:
                "A PROJECT CREATED BY",

            assinatura2:
                "ADM DA @FANPAGE_D.MARCOEFFECT"
        }

    };


    /* =====================================================
       ELEMENTOS
    ====================================================== */

    const elementosTexto =
        document.querySelectorAll("[data-i18n]");

    const elementosHTML =
        document.querySelectorAll("[data-i18n-html]");


    /* =====================================================
       APLICAR IDIOMA
    ====================================================== */

    function aplicarIdioma(idioma) {

        const traducao = traducoes[idioma];

        if (!traducao) return;


        /* ---------- TEXTOS SIMPLES ---------- */

        elementosTexto.forEach(elemento => {

            const chave = elemento.dataset.i18n;

            const partes = chave.split(".");

            let valor = traducao;

            partes.forEach(parte => {
                valor = valor?.[parte];
            });

            if (valor !== undefined) {
                elemento.textContent = valor;
            }

        });


        /* ---------- TEXTOS COM HTML ---------- */

        elementosHTML.forEach(elemento => {

            const chave = elemento.dataset.i18nHtml;

            const valor = traducao[chave];

            if (valor !== undefined) {
                elemento.innerHTML = valor;
            }

        });


        /* ---------- HTML LANG ---------- */

        document.documentElement.lang = idioma;

    }


    /* =====================================================
       IDIOMA ESCOLHIDO NO SITE
    ====================================================== */

    const idiomaSalvo =
        localStorage.getItem("idiomaDMarco") || "ko";


    aplicarIdioma(idiomaSalvo);


    /* =====================================================
       NAVEGAÇÃO
    ====================================================== */

    const links =
        document.querySelectorAll(".inicio-link");


    links.forEach(link => {

        link.addEventListener("click", event => {

            const destino =
                link.dataset.nav;


            if (
    destino === "mensagens" ||
    destino === "memorias"
) {

                event.preventDefault();

                /*
                 * Essas páginas serão conectadas
                 * quando criarmos as próximas sessões.
                 */

                return;
            }


            links.forEach(outro => {
                outro.classList.remove("ativo");
            });

            link.classList.add("ativo");

        });

    });

});
