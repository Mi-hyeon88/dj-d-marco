/* =========================================================
   D.MARCO — MENSAGENS
   MURAL + GLOBO + FADA + PERGAMINHO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       API
    ====================================================== */

    const API_URL =
        "https://script.google.com/macros/s/AKfycbyj28gI2WD-ssp9hO-rtZ94_gMXfjOVDaBUXZcnOZKUBLSXHSqkJhGsKqbyiBbb-2vE/exec";


    /* =====================================================
       ELEMENTOS
    ====================================================== */

    const estados =
        document.querySelectorAll(".estado");

    const listaPaises =
        document.querySelector("#listaPaises");

    const tituloPais =
        document.querySelector("#paisNome");

    const listaMensagens =
        document.querySelector("#listaMensagens");

    const cartaPais =
        document.querySelector("#cartaPais");

    const cartaNome =
        document.querySelector("#cartaNome");

    const cartaTexto =
        document.querySelector("#cartaTexto");

    const contadorMensagens =
        document.querySelector(".mensagem-controles span");

    const carregando =
        document.querySelector("#carregando");

    const erro =
        document.querySelector("#erro");

    const tentarNovamente =
        document.querySelector("#tentarNovamente");

    const mensagemAnteriorBotao =
        document.querySelector("#mensagemAnterior");

    const mensagemProximaBotao =
        document.querySelector("#mensagemProxima");

    const globo =
        document.querySelector("#globo");

    const fadaCena =
        document.querySelector("#fadaCena");

    const mensagemCarta =
        document.querySelector("#mensagemCarta");

    const mensagemVoltar =
        document.querySelector(".mensagens-voltar");


    /* =====================================================
       ESTADO
    ====================================================== */

    let mundoGlobo = null;

    let mensagens = [];

    let mensagensPais = [];

    let paisAtual = "";

    let indiceMensagem = 0;

    let indiceCoordenadasGlobo = {};

    let intervaloFada = null;

    let frameFada = 0;

    let temposAnimacao = [];

    let animacaoId = 0;


    /* =====================================================
       IDIOMA
    ====================================================== */

    const idiomaAtual =
        localStorage.getItem("idiomaDMarco") || "ko";


    const traducoes = {

        ko: {

            tituloMural:
                "벽화",

            subtitulo:
                "세계 곳곳에서 온 메시지",

            instrucaoGlobo:
                "글로브를 움직여 나라를 둘러보세요.<br>빛나는 곳을 눌러 메시지를 확인하세요.",

            instrucaoPais:
                "나라를 눌러<br>메시지를 확인하세요 ♡",

            listaMensagensTitulo:
                "당신을 위한 메시지",

            anterior:
                "이전",

            proxima:
                "다음",

            erro:
                "메시지를 불러오지 못했습니다.",

            tentarNovamente:
                "다시 시도",

            de:
                "보낸 사람"

        },


        pt: {

            tituloMural:
                "Mural",

            subtitulo:
                "Mensagens ao redor do mundo",

            instrucaoGlobo:
                "Mova o globo para explorar os países.<br>Toque nas luzes para ver as mensagens.",

            instrucaoPais:
                "Toque em um país para ver<br>as mensagens ♡",

            listaMensagensTitulo:
                "Mensagens para você",

            anterior:
                "Anterior",

            proxima:
                "Próxima",

            erro:
                "Não foi possível carregar as mensagens.",

            tentarNovamente:
                "Tentar novamente",

            de:
                "De"

        },


        en: {

            tituloMural:
                "Mural",

            subtitulo:
                "Messages from around the world",

            instrucaoGlobo:
                "Move the globe to explore the countries.<br>Tap the lights to see the messages.",

            instrucaoPais:
                "Tap a country to see<br>the messages ♡",

            listaMensagensTitulo:
                "Messages for you",

            anterior:
                "Previous",

            proxima:
                "Next",

            erro:
                "Could not load the messages.",

            tentarNovamente:
                "Try again",

            de:
                "From"

        }

    };


    function aplicarIdioma() {

        const traducao =
            traducoes[idiomaAtual] ||
            traducoes.ko;


        document.documentElement.lang =
            idiomaAtual === "pt"
                ? "pt-BR"
                : idiomaAtual === "ko"
                    ? "ko"
                    : "en";


        document
            .querySelectorAll("[data-i18n]")
            .forEach(elemento => {

                const chave =
                    elemento.dataset.i18n;

                if (
                    traducao[chave] !== undefined
                ) {

                    elemento.innerHTML =
                        traducao[chave];

                }

            });

    }


    /* =====================================================
       ESTADOS DA PÁGINA
    ====================================================== */

    function mostrarEstado(nome) {

        estados.forEach(estado => {

            estado.classList.toggle(
                "ativo",
                estado.dataset.estado === nome
            );

        });


        if (mensagemVoltar) {

            const mural =
                nome === "mural";

            mensagemVoltar.style.visibility =
                mural
                    ? "visible"
                    : "hidden";

            mensagemVoltar.style.pointerEvents =
                mural
                    ? "auto"
                    : "none";

        }


        if (
            nome === "mural" &&
            mundoGlobo
        ) {

            requestAnimationFrame(() => {

                ajustarGlobo();

            });

        }

    }


    /* =====================================================
       NORMALIZAÇÃO
    ====================================================== */

    function normalizarPais(pais) {

        return String(pais || "")
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, " ");

    }


    const aliases = {

        brasil:
            "brasil",

        brazil:
            "brasil",

        coreia:
            "coreia do sul",

        "coreia do sul":
            "coreia do sul",

        korea:
            "coreia do sul",

        "south korea":
            "coreia do sul",

        japao:
            "japao",

        japan:
            "japao",

        "estados unidos":
            "estados unidos",

        "united states":
            "estados unidos",

        usa:
            "estados unidos",

        eua:
            "estados unidos",

        franca:
            "franca",

        france:
            "franca",

        portugal:
            "portugal",

        mexico:
            "mexico",

        alemanha:
            "alemanha",

        germany:
            "alemanha",

        argentina:
            "argentina",

        chile:
            "chile",

        colombia:
            "colombia",

        peru:
            "peru",

        canada:
            "canada",

        italia:
            "italia",

        italy:
            "italia",

        espanha:
            "espanha",

        spain:
            "espanha",

        "reino unido":
            "reino unido",

        "united kingdom":
            "reino unido",

        uk:
            "reino unido",

        filipinas:
            "filipinas",

        philippines:
            "filipinas",

        polonia:
            "polonia",

        poland:
            "polonia"

    };


    function chavePais(pais) {

        const normalizada =
            normalizarPais(pais);

        return (
            aliases[normalizada] ||
            normalizada
        );

    }


    /* =====================================================
       NOMES DOS PAÍSES
    ====================================================== */

    const nomesPaises = {

        brasil: {
            ko: "브라질",
            pt: "Brasil",
            en: "Brazil"
        },

        "coreia do sul": {
            ko: "대한민국",
            pt: "Coreia do Sul",
            en: "South Korea"
        },

        japao: {
            ko: "일본",
            pt: "Japão",
            en: "Japan"
        },

        "estados unidos": {
            ko: "미국",
            pt: "Estados Unidos",
            en: "United States"
        },

        franca: {
            ko: "프랑스",
            pt: "França",
            en: "France"
        },

        portugal: {
            ko: "포르투갈",
            pt: "Portugal",
            en: "Portugal"
        },

        mexico: {
            ko: "멕시코",
            pt: "México",
            en: "Mexico"
        },

        alemanha: {
            ko: "독일",
            pt: "Alemanha",
            en: "Germany"
        },

        argentina: {
            ko: "아르헨티나",
            pt: "Argentina",
            en: "Argentina"
        },

        chile: {
            ko: "칠레",
            pt: "Chile",
            en: "Chile"
        },

        colombia: {
            ko: "콜롬비아",
            pt: "Colômbia",
            en: "Colombia"
        },

        peru: {
            ko: "페루",
            pt: "Peru",
            en: "Peru"
        },

        canada: {
            ko: "캐나다",
            pt: "Canadá",
            en: "Canada"
        },

        italia: {
            ko: "이탈리아",
            pt: "Itália",
            en: "Italy"
        },

        espanha: {
            ko: "스페인",
            pt: "Espanha",
            en: "Spain"
        },

        filipinas: {
            ko: "필리핀",
            pt: "Filipinas",
            en: "Philippines"
        },

        polonia: {
            ko: "폴란드",
            pt: "Polônia",
            en: "Poland"
        },

        "reino unido": {
            ko: "영국",
            pt: "Reino Unido",
            en: "United Kingdom"
        }

    };


    function nomePais(pais) {

        const chave =
            chavePais(pais);

        const dados =
            nomesPaises[chave];

        if (dados) {

            return (
                dados[idiomaAtual] ||
                dados.ko
            );

        }


        return String(pais || "");

    }


    /* =====================================================
       CONFIGURAÇÃO DOS MARCADORES DO GLOBO
    ====================================================== */

    const CONFIG_GLOBO = {

        brasil: {
            en: "BRAZIL",
            ko: "브라질",
            bandeira: "🇧🇷",
            lado: "esquerda",
            linha: 62,
            angulo: 15,
            offsetX: 0,
            offsetY: 0
        },

        "coreia do sul": {
            en: "SOUTH KOREA",
            ko: "대한민국",
            bandeira: "🇰🇷",
            lado: "direita",
            linha: 62,
            angulo: -10,
            offsetX: 0,
            offsetY: 0
        },

        japao: {
            en: "JAPAN",
            ko: "일본",
            bandeira: "🇯🇵",
            lado: "direita",
            linha: 55,
            angulo: 12,
            offsetX: 0,
            offsetY: 0
        },

        "estados unidos": {
            en: "UNITED STATES",
            ko: "미국",
            bandeira: "🇺🇸",
            lado: "esquerda",
            linha: 60,
            angulo: -15,
            offsetX: 0,
            offsetY: 0
        },

        franca: {
            en: "FRANCE",
            ko: "프랑스",
            bandeira: "🇫🇷",
            lado: "direita",
            linha: 48,
            angulo: -20,
            offsetX: 0,
            offsetY: -25
        },

        portugal: {
            en: "PORTUGAL",
            ko: "포르투갈",
            bandeira: "🇵🇹",
            lado: "esquerda",
            linha: 45,
            angulo: 20,
            offsetX: 0,
            offsetY: 20
        },

        mexico: {
            en: "MEXICO",
            ko: "멕시코",
            bandeira: "🇲🇽",
            lado: "esquerda",
            linha: 55,
            angulo: -15,
            offsetX: 0,
            offsetY: 0
        },

        chile: {
            en: "CHILE",
            ko: "칠레",
            bandeira: "🇨🇱",
            lado: "esquerda",
            linha: 50,
            angulo: 10,
            offsetX: 0,
            offsetY: 0
        },

        argentina: {
            en: "ARGENTINA",
            ko: "아르헨티나",
            bandeira: "🇦🇷",
            lado: "esquerda",
            linha: 50,
            angulo: 12,
            offsetX: 0,
            offsetY: 0
        },

        alemanha: {
            en: "GERMANY",
            ko: "독일",
            bandeira: "🇩🇪",
            lado: "direita",
            linha: 50,
            angulo: -25,
            offsetX: 0,
            offsetY: -35
        },

        polonia: {
            en: "POLAND",
            ko: "폴란드",
            bandeira: "🇵🇱",
            lado: "direita",
            linha: 58,
            angulo: 25,
            offsetX: 0,
            offsetY: 35
        },

        filipinas: {
            en: "PHILIPPINES",
            ko: "필리핀",
            bandeira: "🇵🇭",
            lado: "direita",
            linha: 60,
            angulo: 0,
            offsetX: 0,
            offsetY: 0
        }

    };


    /* =====================================================
       AGRUPAR PAÍSES
    ====================================================== */

    function agruparPaises() {

        const grupos = {};

        mensagens.forEach(mensagem => {

            const pais =
                chavePais(mensagem.pais);

            if (!pais) return;

            if (!grupos[pais]) {

                grupos[pais] = [];

            }

            grupos[pais].push(
                mensagem
            );

        });

        return grupos;

    }


    /* =====================================================
       TEXTO DA MENSAGEM
    ====================================================== */

    function textoMensagem(mensagem) {

        if (!mensagem) {
            return "";
        }


        if (idiomaAtual === "ko") {

            return String(
                mensagem.mensagem_coreano ||
                mensagem.mensagem_original ||
                mensagem.mensagem ||
                ""
            ).trim();

        }


        return String(
            mensagem.mensagem_original ||
            mensagem.mensagem ||
            ""
        ).trim();

    }


    /* =====================================================
       LISTA DE PAÍSES
    ====================================================== */

    function criarListaPaises() {

        if (!listaPaises) {
            return;
        }


        listaPaises.innerHTML = "";


        const grupos =
            agruparPaises();


        const paises =
            Object.keys(grupos)
                .sort((a, b) =>
                    nomePais(a).localeCompare(
                        nomePais(b),
                        idiomaAtual === "ko"
                            ? "ko"
                            : "pt-BR"
                    )
                );


        paises.forEach(pais => {

            const botao =
                document.createElement("button");


            botao.type =
                "button";


            botao.className =
                "pais-item";


            botao.innerHTML = `

                <span class="pais-pin">
                    ⌖
                </span>

                <span class="pais-nome">
                    ${nomePais(pais)}
                </span>

                <span class="pais-contagem">
                    ${String(
                        grupos[pais].length
                    ).padStart(2, "0")}
                </span>

                <span class="pais-seta">
                    ›
                </span>

            `;


            botao.addEventListener(
                "click",
                () => abrirPais(pais)
            );


            listaPaises.appendChild(
                botao
            );

        });

    }


    /* =====================================================
       LISTA DE MENSAGENS
    ====================================================== */

    function criarListaMensagens() {

        if (!listaMensagens) {
            return;
        }


        listaMensagens.innerHTML = "";


        mensagensPais.forEach(
            (mensagem, indice) => {

                const botao =
                    document.createElement("button");


                botao.type =
                    "button";


                botao.className =
                    "mensagem-item";


                const numero =
                    String(indice + 1)
                        .padStart(2, "0");


                const nome =
                    mensagem.nome ||
                    (
                        idiomaAtual === "ko"
                            ? "익명"
                            : idiomaAtual === "en"
                                ? "Anonymous"
                                : "Anônimo"
                    );


                botao.innerHTML = `

                    <span class="mensagem-numero">
                        ${numero}
                    </span>

                    <span class="mensagem-item-conteudo">

                        <strong>
                            ${nome}
                        </strong>

                        <small>
                            ${textoMensagem(mensagem)}
                        </small>

                    </span>

                    <span class="mensagem-item-seta">
                        ›
                    </span>

                `;


                botao.addEventListener(
                    "click",
                    () => {

                        indiceMensagem =
                            indice;

                        prepararMensagem();

                    }
                );


                listaMensagens.appendChild(
                    botao
                );

            }
        );

    }


    /* =====================================================
       ABRIR PAÍS
    ====================================================== */

    function abrirPais(pais) {

        const grupos =
            agruparPaises();


        mensagensPais =
            grupos[chavePais(pais)] || [];


        if (!mensagensPais.length) {
            return;
        }


        paisAtual =
            chavePais(pais);


        indiceMensagem =
            0;


        if (tituloPais) {

            tituloPais.textContent =
                nomePais(paisAtual);

        }


        criarListaMensagens();


        mostrarEstado(
            "pais"
        );

    }


    /* =====================================================
       PREPARAR MENSAGEM
    ====================================================== */

    function prepararMensagem() {

        const mensagem =
            mensagensPais[indiceMensagem];


        if (!mensagem) {
            return;
        }


        if (cartaPais) {

            cartaPais.textContent =
                nomePais(paisAtual);

        }


        if (cartaNome) {

            const traducao =
                traducoes[idiomaAtual] ||
                traducoes.ko;


            cartaNome.textContent =
                mensagem.nome
                    ? `${traducao.de} ${mensagem.nome}`
                    : "";

        }


        if (cartaTexto) {

            cartaTexto.textContent =
                textoMensagem(mensagem);

        }


        if (contadorMensagens) {

            contadorMensagens.textContent =
                `${indiceMensagem + 1} / ${mensagensPais.length}`;

        }


        mostrarEstado(
            "mensagem"
        );


        animarFada();

    }


    /* =====================================================
       FRAMES DA FADA
    ====================================================== */

    const fadaAnimada =
        document.querySelector("#fadaAnimada");


    const framesFada = [

        "fada-01.png",
        "fada-02.png",
        "fada-03.png",
        "fada-04.png",
        "fada-05.png",
        "fada-06.png",
        "fada-07.png",
        "fada-08.png",
        "fada-09.png",
        "fada-10.png",
        "fada-11.png",
        "fada-12.png"

    ];


    /* =====================================================
       PRÉ-CARREGAR FRAMES
    ====================================================== */

    function carregarFramesFada() {

        framesFada.forEach(
            arquivo => {

                const imagem =
                    new Image();

                imagem.src =
                    arquivo;

            }
        );

    }


    /* =====================================================
       INICIAR FRAMES
    ====================================================== */

    function iniciarFramesFada() {

        if (!fadaAnimada) {
            return;
        }


        pararFramesFada();


        frameFada =
            0;


        fadaAnimada.src =
            framesFada[0];


        intervaloFada =
            setInterval(
                () => {

                    frameFada++;

                    if (
                        frameFada >=
                        framesFada.length
                    ) {

                        frameFada =
                            0;

                    }


                    fadaAnimada.src =
                        framesFada[
                            frameFada
                        ];

                },
                90
            );

    }


    /* =====================================================
       PARAR FRAMES
    ====================================================== */

    function pararFramesFada() {

        if (!intervaloFada) {
            return;
        }


        clearInterval(
            intervaloFada
        );


        intervaloFada =
            null;

    }


    /* =====================================================
       LIMPAR ANIMAÇÃO
    ====================================================== */

    function limparAnimacaoMensagem() {

        temposAnimacao.forEach(
            tempo =>
                clearTimeout(tempo)
        );


        temposAnimacao =
            [];


        pararFramesFada();


        if (fadaCena) {

            fadaCena.classList.remove(
                "viva"
            );

            fadaCena.classList.remove(
                "fada-chegou"
            );

        }


        if (mensagemCarta) {

            mensagemCarta.classList.remove(
                "carta-visivel"
            );

            mensagemCarta.scrollTop =
                0;

        }

    }


  /* =====================================================
   ANIMAÇÃO DA FADA + FALA
===================================================== */

function animarFada() {

    if (!fadaCena || !fadaAnimada) {
        return;
    }


    animacaoId++;

    const idAtual =
        animacaoId;


    limparAnimacaoMensagem();


    void fadaCena.offsetWidth;


    /* =================================================
       BALÃO DE FALA
    ================================================== */

    let balaoFala =
        fadaVoo.querySelector(
            ".fada-fala"
        );


    if (!balaoFala) {

        balaoFala =
            document.createElement(
                "div"
            );

        balaoFala.className =
            "fada-fala";

        balaoFala.textContent =
            "Trouxe uma mensagem para você.";

        fadaVoo.appendChild(
            balaoFala
        );

    }


    balaoFala.classList.remove(
        "visivel"
    );


    /* =================================================
       FADA COMEÇA O VOO
    ================================================== */

    iniciarFramesFada();


    fadaCena.classList.add(
        "viva"
    );


    /* =================================================
       FADA CHEGOU — MOSTRA A FALA
    ================================================== */

    temposAnimacao.push(

        setTimeout(
            () => {

                if (
                    idAtual !==
                    animacaoId
                ) {
                    return;
                }


                balaoFala.classList.add(
                    "visivel"
                );

            },
            4300
        )

    );


    /* =================================================
       FADA TERMINA A FALA E DESAPARECE
    ================================================== */

    temposAnimacao.push(

        setTimeout(
            () => {

                if (
                    idAtual !==
                    animacaoId
                ) {
                    return;
                }


                balaoFala.classList.remove(
                    "visivel"
                );


                fadaCena.classList.add(
                    "fada-saindo"
                );


                pararFramesFada();

            },
            5700
        )

    );


    /* =================================================
       MENSAGEM APARECE SOMENTE APÓS A FADA SUMIR
    ================================================== */

    temposAnimacao.push(

        setTimeout(
            () => {

                if (
                    idAtual !==
                    animacaoId
                ) {
                    return;
                }


                if (!mensagemCarta) {
                    return;
                }


                mensagemCarta.classList.add(
                    "carta-visivel"
                );

            },
            6500
        )

    );

}   


    /* =================================================
       PERGAMINHO COMEÇA A ABRIR
    ================================================== */

    temposAnimacao.push(

        setTimeout(
            () => {

                if (
                    idAtual !==
                    animacaoId
                ) {
                    return;
                }


                if (!pergaminho) {
                    return;
                }


                pergaminho.classList.add(
                    "abrindo"
                );

            },
            3250
        )

    );


    /* =================================================
       PERGAMINHO TERMINOU DE ABRIR
    ================================================== */

    temposAnimacao.push(

        setTimeout(
            () => {

                if (
                    idAtual !==
                    animacaoId
                ) {
                    return;
                }


                if (!pergaminho) {
                    return;
                }


                pergaminho.classList.remove(
                    "abrindo"
                );


                pergaminho.classList.add(
                    "aberto"
                );

            },
            4700
        )

    );


    /* =================================================
       MOSTRAR MENSAGEM
    ================================================== */

    temposAnimacao.push(

        setTimeout(
            () => {

                if (
                    idAtual !==
                    animacaoId
                ) {
                    return;
                }


                if (!mensagemCarta) {
                    return;
                }


                mensagemCarta.classList.add(
                    "carta-visivel"
                );


                pararFramesFada();

            },
            4850
        )

    );

}



    /* =====================================================
       PRÓXIMA MENSAGEM
    ====================================================== */

    function proximaMensagem() {

        if (!mensagensPais.length) {
            return;
        }


        indiceMensagem++;


        if (
            indiceMensagem >=
            mensagensPais.length
        ) {

            indiceMensagem =
                0;

        }


        prepararMensagem();

    }


    /* =====================================================
       MENSAGEM ANTERIOR
    ====================================================== */

    function mensagemAnterior() {

        if (!mensagensPais.length) {
            return;
        }


        indiceMensagem--;


        if (
            indiceMensagem < 0
        ) {

            indiceMensagem =
                mensagensPais.length - 1;

        }


        prepararMensagem();

    }


    /* =====================================================
       BOTÕES VOLTAR
    ====================================================== */

    document
        .querySelectorAll("[data-voltar]")
        .forEach(botao => {

            botao.addEventListener(
                "click",
                evento => {

                    evento.preventDefault();

                    evento.stopPropagation();


                    const destino =
                        botao.getAttribute(
                            "data-voltar"
                        );


                    if (!destino) {
                        return;
                    }


                    limparAnimacaoMensagem();


                    mostrarEstado(
                        destino
                    );

                }
            );

        });


    /* =====================================================
       BOTÕES DA MENSAGEM
    ====================================================== */

    if (mensagemAnteriorBotao) {

        mensagemAnteriorBotao.addEventListener(
            "click",
            mensagemAnterior
        );

    }


    if (mensagemProximaBotao) {

        mensagemProximaBotao.addEventListener(
            "click",
            proximaMensagem
        );

    }


    /* =====================================================
       COORDENADAS DO GLOBO
    ====================================================== */

    async function carregarCoordenadas() {

        const resposta =
            await fetch(
                "https://countriesnow.space/api/v0.1/countries/positions"
            );


        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar as coordenadas."
            );

        }


        const resultado =
            await resposta.json();


        if (
            !resultado ||
            !Array.isArray(
                resultado.data
            )
        ) {

            throw new Error(
                "Formato de coordenadas inválido."
            );

        }


        return resultado.data;

    }


    /* =====================================================
       ÍNDICE DAS COORDENADAS
    ====================================================== */

    function criarIndiceCoordenadas(dados) {

        const indice = {};


        let displayNames =
            null;


        try {

            displayNames =
                new Intl.DisplayNames(
                    ["pt-BR"],
                    {
                        type: "region"
                    }
                );

        } catch (error) {

            displayNames =
                null;

        }


        dados.forEach(item => {

            if (
                !item ||
                item.lat === undefined ||
                item.long === undefined
            ) {

                return;

            }


            const lat =
                Number(item.lat);


            const lng =
                Number(item.long);


            if (
                !Number.isFinite(lat) ||
                !Number.isFinite(lng)
            ) {

                return;

            }


            const coordenada = {
                lat,
                lng
            };


            if (item.name) {

                indice[
                    chavePais(item.name)
                ] =
                    coordenada;

            }


            if (item.iso2) {

                indice[
                    chavePais(item.iso2)
                ] =
                    coordenada;


                if (displayNames) {

                    try {

                        const nome =
                            displayNames.of(
                                item.iso2
                            );


                        if (nome) {

                            indice[
                                chavePais(nome)
                            ] =
                                coordenada;

                        }

                    } catch (error) {}

                }

            }

        });


        return indice;

    }


    /* =====================================================
       AJUSTAR GLOBO
    ====================================================== */

    function ajustarGlobo() {

        if (
            !mundoGlobo ||
            !globo
        ) {

            return;

        }


        const largura =
            globo.clientWidth;


        const altura =
            globo.clientHeight;


        if (
            largura <= 0 ||
            altura <= 0
        ) {

            return;

        }


        mundoGlobo
            .width(largura)
            .height(altura);


        const canvas =
            globo.querySelector(
                "canvas"
            );


        if (canvas) {

            canvas.style.width =
                "100%";

            canvas.style.height =
                "100%";

        }

    }


    /* =====================================================
       CRIAR GLOBO
    ====================================================== */

    async function criarGlobo() {

        if (!globo) {
            return;
        }


        if (
            typeof Globe !==
            "function"
        ) {

            console.error(
                "Globe.gl não foi carregado."
            );

            return;

        }


        globo.innerHTML =
            "";


        const largura =
            Math.max(
                globo.clientWidth,
                280
            );


        const altura =
            Math.max(
                globo.clientHeight,
                280
            );


        mundoGlobo =
            Globe()(globo)

                .width(
                    largura
                )

                .height(
                    altura
                )

                .backgroundColor(
                    "rgba(0,0,0,0)"
                )

                .globeImageUrl(
                    "https://unpkg.com/three-globe/example/img/earth-night.jpg"
                )

                .bumpImageUrl(
                    "https://unpkg.com/three-globe/example/img/earth-topology.png"
                )

                .showAtmosphere(
                    true
                )

                .atmosphereColor(
                    "#8fc9ff"
                )

                .atmosphereAltitude(
                    0.16
                );


        /* =================================================
           PONTOS
        ================================================== */

        mundoGlobo

            .pointsData([])

            .pointLat(
                "lat"
            )

            .pointLng(
                "lng"
            )

            .pointAltitude(
                0.02
            )

            .pointRadius(
                0
            )

            .pointColor(
                () =>
                    "rgba(0,0,0,0)"
            );


        /* =================================================
           MARCADORES
        ================================================== */

        mundoGlobo

            .htmlElementsData([])

            .htmlLat(
                "lat"
            )

            .htmlLng(
                "lng"
            )

            .htmlAltitude(
                0.025
            )

            .htmlElement(
                ponto => {

                    const marcador =
                        document.createElement(
                            "div"
                        );


                    marcador.className =
                        "globo-marcador";


                    const config =
                        CONFIG_GLOBO[
                            chavePais(
                                ponto.pais
                            )
                        ];


                    if (!config) {

                        return marcador;

                    }


                    /* =================================================
                       LINHA
                    ================================================== */

                    const linha =
                        document.createElement(
                            "div"
                        );


                    linha.className =
                        "globo-linha";


                    linha.style.setProperty(
                        "--linha-tamanho",
                        `${config.linha}px`
                    );


                    const angulo =
                        config.lado ===
                        "esquerda"
                            ? 180 +
                              config.angulo
                            : config.angulo;


                    linha.style.transform =
                        `rotate(${angulo}deg)`;


                    /* =================================================
                       LUZ
                    ================================================== */

                    const luz =
                        document.createElement(
                            "div"
                        );


                    luz.className =
                        "globo-luz";


                    /* =================================================
                       ETIQUETA
                    ================================================== */

                    const etiqueta =
                        document.createElement(
                            "div"
                        );


                    etiqueta.className =
                        `globo-etiqueta ${config.lado} ${chavePais(ponto.pais)}`;


                    etiqueta.style.setProperty(
                        "--offset-x",
                        `${config.offsetX}px`
                    );


                    etiqueta.style.setProperty(
                        "--offset-y",
                        `${config.offsetY}px`
                    );


                    /* =================================================
                       BANDEIRA
                    ================================================== */

                    const bandeira =
                        document.createElement(
                            "span"
                        );


                    bandeira.className =
                        "globo-bandeira";


                    bandeira.textContent =
                        config.bandeira;


                    /* =================================================
                       TEXTOS
                    ================================================== */

                    const textos =
                        document.createElement(
                            "div"
                        );


                    textos.className =
                        "globo-textos";


                    const nome =
                        document.createElement(
                            "div"
                        );


                    nome.className =
                        "globo-nome";


                    nome.textContent =
                        config.en;


                    const nomeCoreano =
                        document.createElement(
                            "div"
                        );


                    nomeCoreano.className =
                        "globo-nome-coreano";


                    nomeCoreano.textContent =
                        config.ko;


                    textos.appendChild(
                        nome
                    );


                    textos.appendChild(
                        nomeCoreano
                    );


                    etiqueta.appendChild(
                        bandeira
                    );


                    etiqueta.appendChild(
                        textos
                    );


                    marcador.appendChild(
                        linha
                    );


                    marcador.appendChild(
                        luz
                    );


                    marcador.appendChild(
                        etiqueta
                    );


                    /* =================================================
                       CLIQUE
                    ================================================== */

                    marcador.addEventListener(
                        "click",
                        evento => {

                            evento.stopPropagation();


                            abrirPais(
                                ponto.pais
                            );

                        }
                    );


                    return marcador;

                }
            )

            .htmlElementVisibilityModifier(
                (
                    elemento,
                    visivel
                ) => {

                    elemento.style.opacity =
                        visivel
                            ? "1"
                            : "0";

                }
            )

            .htmlTransitionDuration(
                0
            );


        /* =================================================
           POSIÇÃO INICIAL
        ================================================== */

        mundoGlobo.pointOfView(
            {
                lat: 12,
                lng: -20,
                altitude: 2.35
            },
            0
        );


        /* =================================================
           CONTROLES
        ================================================== */

        const controles =
            mundoGlobo.controls();


        controles.enableZoom =
            false;


        controles.enablePan =
            false;


        controles.autoRotate =
            false;


        controles.enableDamping =
            true;


        /* =================================================
           REDIMENSIONAMENTO
        ================================================== */

        requestAnimationFrame(
            ajustarGlobo
        );


        setTimeout(
            ajustarGlobo,
            100
        );


        setTimeout(
            ajustarGlobo,
            500
        );


        window.addEventListener(
            "resize",
            ajustarGlobo
        );


        window.addEventListener(
            "orientationchange",
            () => {

                setTimeout(
                    ajustarGlobo,
                    250
                );

            }
        );


        /* =================================================
           COORDENADAS
        ================================================== */

        try {

            const dados =
                await carregarCoordenadas();


            indiceCoordenadasGlobo =
                criarIndiceCoordenadas(
                    dados
                );


            atualizarPontosGlobo();

        } catch (error) {

            console.error(
                "Erro ao carregar coordenadas:",
                error
            );

        }

    }


    /* =====================================================
       ATUALIZAR PONTOS
    ====================================================== */

    function atualizarPontosGlobo() {

        if (!mundoGlobo) {
            return;
        }


        const grupos =
            agruparPaises();


        const pontos = [];


        Object.keys(grupos)
            .forEach(pais => {

                let coordenada =
                    indiceCoordenadasGlobo[
                        chavePais(pais)
                    ];


                if (!coordenada) {

                    coordenada =
                        indiceCoordenadasGlobo[
                            chavePais(
                                nomePais(pais)
                            )
                        ];

                }


                if (!coordenada) {

                    console.warn(
                        "País sem coordenada:",
                        pais
                    );

                    return;

                }


                pontos.push({

                    pais,

                    lat:
                        coordenada.lat,

                    lng:
                        coordenada.lng,

                    quantidade:
                        grupos[pais].length

                });

            });


        mundoGlobo
            .pointsData(
                pontos
            )
            .htmlElementsData(
                pontos
            );


        requestAnimationFrame(
            ajustarGlobo
        );

    }


    /* =====================================================
       CARREGAR MENSAGENS
    ====================================================== */

    function carregarMensagens() {

        const callback =
            "dmMarcoMensagens_" +
            Date.now();


        const script =
            document.createElement(
                "script"
            );


        window[callback] =
            dados => {

                try {

                    if (
                        !dados ||
                        !Array.isArray(
                            dados.mensagens
                        )
                    ) {

                        throw new Error(
                            "Formato de dados inválido."
                        );

                    }


                    mensagens =
                        dados.mensagens.filter(
                            item =>
                                item &&
                                item.pais &&
                                textoMensagem(item)
                        );


                    criarListaPaises();


                    atualizarPontosGlobo();


                    if (carregando) {

                        carregando.remove();

                    }


                    if (erro) {

                        erro.hidden =
                            true;

                        erro.style.display =
                            "none";

                    }

                } catch (error) {

                    console.error(
                        "Erro ao processar mensagens:",
                        error
                    );

                    tratarFalhaAPI();

                }


                delete window[callback];


                script.remove();

            };


        script.src =
            API_URL +
            "?callback=" +
            encodeURIComponent(
                callback
            );


        script.onerror =
            () => {

                console.error(
                    "Não foi possível acessar a API."
                );


                tratarFalhaAPI();


                delete window[callback];


                script.remove();

            };


        document.head.appendChild(
            script
        );

    }


    /* =====================================================
       FALHA DA API
    ====================================================== */

    function tratarFalhaAPI() {

        if (carregando) {

            carregando.remove();

        }


        /*
         * NÃO esconder o globo.
         */

        if (erro) {

            erro.hidden =
                true;

            erro.style.display =
                "none";

        }


        mostrarEstado(
            "mural"
        );

    }


    /* =====================================================
       TENTAR NOVAMENTE
    ====================================================== */

    if (tentarNovamente) {

        tentarNovamente.addEventListener(
            "click",
            () => {

                carregarMensagens();

            }
        );

    }


    /* =====================================================
       INICIALIZAÇÃO
    ====================================================== */

    aplicarIdioma();

    carregarFramesFada();


    if (erro) {

        erro.hidden =
            true;

        erro.style.display =
            "none";

    }


    if (carregando) {

        carregando.remove();

    }


    mostrarEstado(
        "mural"
    );


    criarGlobo();


    carregarMensagens();

});
