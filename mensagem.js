/* =========================================================
   D.MARCO — MENSAGENS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const API_URL =
        "https://script.google.com/macros/s/AKfycbyj28gI2WD-ssp9hO-rtZ94_gMXfjOVDaBUXZcnOZKUBLSXHSqkJhGsKqbyiBbb-2vE/exec";


    /* =====================================================
       ELEMENTOS
    ====================================================== */

    const estados =
        document.querySelectorAll(".estado");

    const listaPaises =
        document.querySelector(".lista-paises");

    const tituloPais =
        document.querySelector(".pais-cabecalho h1");

    const contagemPais =
        document.querySelector(".pais-cabecalho span");

    const cartaPais =
        document.querySelector(".carta-pais");

    const cartaNome =
        document.querySelector(".carta-nome");

    const cartaTexto =
        document.querySelector(".carta-texto");

    const contadorMensagens =
        document.querySelector(".mensagem-controles span");

    const carregando =
        document.querySelector(".carregando");

    const erro =
        document.querySelector(".erro");

    const tentarNovamente =
        document.getElementById("tentarNovamente");

    const mensagemAnteriorBotao =
        document.getElementById("mensagemAnterior");

    const mensagemProximaBotao =
        document.getElementById("mensagemProxima");

    const globo =
        document.querySelector(".globo");


    /* =====================================================
       DADOS
    ====================================================== */

    let mensagens = [];

    let paisAtual = "";

    let mensagensPais = [];

    let indiceMensagem = 0;


    /* =====================================================
       ESTADO DA PÁGINA
    ====================================================== */

    function mostrarEstado(nome) {

        estados.forEach(estado => {

            estado.classList.toggle(
                "ativo",
                estado.dataset.estado === nome
            );

        });

    }


    /* =====================================================
       NORMALIZAR PAÍS
    ====================================================== */

    function normalizarPais(pais) {

        const valor =
            String(pais || "")
                .trim()
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

        const aliases = {

            brasil: "brasil",
            brazil: "brasil",

            "coreia do sul": "coreia do sul",
            coreia: "coreia do sul",
            korea: "coreia do sul",
            "south korea": "coreia do sul",

            japao: "japao",
            japan: "japao",

            "estados unidos": "estados unidos",
            "united states": "estados unidos",
            usa: "estados unidos",
            eua: "estados unidos",

            franca: "franca",
            france: "franca",

            portugal: "portugal",

            mexico: "mexico",

            alemanha: "alemanha",
            germany: "alemanha",

            argentina: "argentina",

            chile: "chile",

            colombia: "colombia",

            peru: "peru",

            canada: "canada",

            italia: "italia",
            italy: "italia",

            espanha: "espanha",
            spain: "espanha",

            "reino unido": "reino unido",
            "reino_unido": "reino unido",
            "united kingdom": "reino unido",
            uk: "reino unido"

        };

        return aliases[valor] || valor;

    }


    /* =====================================================
       NOME DO PAÍS
    ====================================================== */

    function nomePais(pais) {

        const nomes = {

            brasil: "Brasil",

            "coreia do sul":
                "Coreia do Sul",

            japao:
                "Japão",

            "estados unidos":
                "Estados Unidos",

            franca:
                "França",

            portugal:
                "Portugal",

            mexico:
                "México",

            alemanha:
                "Alemanha",

            argentina:
                "Argentina",

            chile:
                "Chile",

            colombia:
                "Colômbia",

            peru:
                "Peru",

            canada:
                "Canadá",

            italia:
                "Itália",

            espanha:
                "Espanha",

            "reino unido":
                "Reino Unido"

        };

        return nomes[normalizarPais(pais)] ||
               String(pais || "Outros países");

    }


    /* =====================================================
       AGRUPAR PAÍSES
    ====================================================== */

    function agruparPaises() {

        const grupos = {};

        mensagens.forEach(mensagem => {

            const pais =
                normalizarPais(mensagem.pais);

            if (!pais) return;

            if (!grupos[pais]) {
                grupos[pais] = [];
            }

            grupos[pais].push(mensagem);

        });

        return grupos;

    }


    /* =====================================================
       LISTA DE PAÍSES
    ====================================================== */

    function criarListaPaises() {

        if (!listaPaises) return;

        listaPaises.innerHTML = "";

        const grupos =
            agruparPaises();

        const paises =
            Object.keys(grupos)
                .sort((a, b) =>
                    nomePais(a).localeCompare(
                        nomePais(b),
                        "pt-BR"
                    )
                );


        paises.forEach(pais => {

            const botao =
                document.createElement("button");

            botao.type = "button";

            botao.className =
                "pais-item";


            botao.innerHTML = `
                <span class="pais-pin">⌖</span>

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


            listaPaises.appendChild(botao);

        });

    }


    /* =====================================================
       ABRIR PAÍS
    ====================================================== */

    function abrirPais(pais) {

        const grupos =
            agruparPaises();

        mensagensPais =
            grupos[pais] || [];


        if (!mensagensPais.length) {
            return;
        }


        paisAtual =
            pais;

        indiceMensagem =
            0;


        if (tituloPais) {

            tituloPais.textContent =
                nomePais(pais);

        }


        if (contagemPais) {

            contagemPais.textContent =
                `${mensagensPais.length} mensagens`;

        }


        mostrarEstado("pais");

    }


    /* =====================================================
       PREPARAR MENSAGEM
    ====================================================== */

    function prepararMensagem() {

        const mensagem =
            mensagensPais[indiceMensagem];

        if (!mensagem) return;


        if (cartaPais) {

            cartaPais.textContent =
                nomePais(paisAtual);

        }


        if (cartaNome) {

            cartaNome.textContent =
                mensagem.nome
                    ? `De ${mensagem.nome}`
                    : "";

        }


        if (cartaTexto) {

            cartaTexto.textContent =
                mensagem.mensagem || "";

        }


        if (contadorMensagens) {

            contadorMensagens.textContent =
                `${indiceMensagem + 1} de ${mensagensPais.length}`;

        }


        mostrarEstado("mensagem");

    }


    /* =====================================================
       PRÓXIMA MENSAGEM
    ====================================================== */

    function proximaMensagem() {

        if (!mensagensPais.length) return;

        indiceMensagem++;

        if (
            indiceMensagem >=
            mensagensPais.length
        ) {

            indiceMensagem = 0;

        }

        prepararMensagem();

    }


    /* =====================================================
       MENSAGEM ANTERIOR
    ====================================================== */

    function mensagemAnterior() {

        if (!mensagensPais.length) return;

        indiceMensagem--;

        if (indiceMensagem < 0) {

            indiceMensagem =
                mensagensPais.length - 1;

        }

        prepararMensagem();

    }


     /* =====================================================
   VOLTAR ENTRE OS ESTADOS
===================================================== */

document
    .querySelectorAll("[data-voltar]")
    .forEach(botao => {

        botao.addEventListener(
            "click",
            evento => {

                evento.preventDefault();
                evento.stopPropagation();

                const destino =
                    botao.dataset.voltar;

                mostrarEstado(destino);

            }
        );

    });


    /* =====================================================
       BOTÕES DA CARTA
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
       GLOBO
    ====================================================== */

    function criarGlobo() {

    if (!globo) return;

    globo.innerHTML = "";

    const grupos = agruparPaises();

    const coordenadasPaises = {

        brasil: {
            lat: -10,
            lng: -52
        },

        "coreia do sul": {
            lat: 36,
            lng: 128
        },

        japao: {
            lat: 36,
            lng: 138
        },

        "estados unidos": {
            lat: 38,
            lng: -97
        },

        franca: {
            lat: 46,
            lng: 2
        },

        portugal: {
            lat: 39,
            lng: -8
        },

        mexico: {
            lat: 23,
            lng: -102
        },

        alemanha: {
            lat: 51,
            lng: 10
        },

        argentina: {
            lat: -34,
            lng: -64
        },

        chile: {
            lat: -33,
            lng: -71
        },

        colombia: {
            lat: 4,
            lng: -74
        },

        peru: {
            lat: -9,
            lng: -75
        },

        canada: {
            lat: 56,
            lng: -106
        },

        italia: {
            lat: 42,
            lng: 12
        },

        espanha: {
            lat: 40,
            lng: -4
        },

        "reino unido": {
            lat: 55,
            lng: -3
        }

    };


    const pontos = Object.keys(grupos)
        .map(pais => {

            const coordenada =
                coordenadasPaises[pais];

            if (!coordenada) return null;

            return {

                pais: pais,

                lat: coordenada.lat,

                lng: coordenada.lng,

                quantidade:
                    grupos[pais].length

            };

        })
        .filter(Boolean);


    const mundo =
        Globe()(globo)

            .width(
                globo.clientWidth
            )

            .height(
                globo.clientHeight
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

            .showAtmosphere(true)

            .atmosphereColor(
                "#c9a46a"
            )

            .atmosphereAltitude(
                0.12
            )

            .pointsData(pontos)

.pointLat("lat")
.pointLng("lng")

.pointColor(
    () => "rgba(225,179,109,0.95)"
)

.pointRadius(0.32)

.pointAltitude(0.035)

.pointResolution(12)

.pointLabel(
    ponto =>
        `${nomePais(ponto.pais)}`
)

.onPointClick(
    ponto => {

        abrirPais(
            ponto.pais
        );

    }
);


    /* =====================================================
       POSIÇÃO INICIAL
    ====================================================== */

    mundo.pointOfView(
        {
            lat: 10,
            lng: -35,
            altitude: 2.15
        },
        0
    );


    /* =====================================================
       CONTROLE POR TOQUE
    ====================================================== */

    mundo.controls().enableZoom = false;

    mundo.controls().autoRotate = true;

    mundo.controls().autoRotateSpeed = 0.35;


    /* =====================================================
       AJUSTE RESPONSIVO
    ====================================================== */

    function ajustarGlobo() {

        mundo
            .width(
                globo.clientWidth
            )
            .height(
                globo.clientHeight
            );

    }


    window.addEventListener(
        "resize",
        ajustarGlobo
    );

    }


    /* =====================================================
       CARREGAR MENSAGENS
    ====================================================== */

    function carregarMensagens() {

        const nomeCallback =
            "dmMarcoMensagens_" +
            Date.now();


        window[nomeCallback] =
            function(dados) {

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
                                item.mensagem
                        );


                    criarListaPaises();


                    if (carregando) {

                        carregando.remove();

                    }


                    /*
                     * Se a API funcionar,
                     * o Globo permanece exatamente onde está.
                     */

                    if (erro) {

                        erro.hidden = true;

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


                delete window[nomeCallback];

                if (script) {

                    script.remove();

                }

            };


        const script =
            document.createElement("script");


        script.src =
            API_URL +
            "?callback=" +
            encodeURIComponent(
                nomeCallback
            );


        script.onerror =
            function() {

                console.error(
                    "Não foi possível acessar a API."
                );


                tratarFalhaAPI();


                delete window[nomeCallback];

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

        /*
         * O Globo NÃO é removido.
         * A tela mural continua ativa.
         */

        mostrarEstado("mural");


        if (carregando) {

            carregando.remove();

        }


        /*
         * Não usamos a tela de erro como uma
         * camada que cobre o Globo.
         *
         * O botão de tentar novamente continua
         * disponível, mas sem esconder o mural.
         */

        if (erro) {

            erro.hidden = true;

            erro.style.display =
                "none";

        }

    }


    /* =====================================================
       TENTAR NOVAMENTE
    ====================================================== */

    if (tentarNovamente) {

        tentarNovamente.addEventListener(
            "click",
            () => {

                if (erro) {

                    erro.hidden = true;

                    erro.style.display =
                        "none";

                }


                carregarMensagens();

            }
        );

    }


   /* =====================================================
   INICIALIZAÇÃO
====================================================== */

/*
 * O globo é a primeira coisa exibida.
 */

if (erro) {
    erro.hidden = true;
    erro.style.display = "none";
}

if (carregando) {
    carregando.remove();
}

criarGlobo();

mostrarEstado("mural");


/*
 * Os dados são carregados depois,
 * sem bloquear o globo.
 */

carregarMensagens();

   });
