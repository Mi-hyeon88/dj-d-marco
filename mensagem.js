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

   const mensagemVoltar =
    document.querySelector(".mensagens-voltar");

let mundoGlobo = null;
let indiceCoordenadasGlobo = {};
   

    /* =====================================================
       DADOS
    ====================================================== */

    let mensagens = [];
    let paisAtual = "";
    let mensagensPais = [];
    let indiceMensagem = 0;


    /* =====================================================
       ESTADO
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

        return String(pais || "")
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, " ");

    }


    /* =====================================================
       ALIASES CONHECIDOS
    ====================================================== */

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
        "united kingdom": "reino unido",
        uk: "reino unido"

    };


    function chavePais(pais) {

        const normalizada =
            normalizarPais(pais);

        return aliases[normalizada] ||
               normalizada;

    }


    /* =====================================================
       NOME PARA EXIBIÇÃO
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

        return nomes[chavePais(pais)] ||
               String(pais || "Outros países");

    }


    /* =====================================================
       AGRUPAR MENSAGENS POR PAÍS
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
       VOLTAR ENTRE ESTADOS
    ====================================================== */

    document
        .querySelectorAll("[data-voltar]")
        .forEach(botao => {

            botao.addEventListener(
                "click",
                evento => {

                    evento.preventDefault();
                    evento.stopPropagation();

                    mostrarEstado(
                        botao.dataset.voltar
                    );

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
       COORDENADAS DOS PAÍSES
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
            !Array.isArray(resultado.data)
        ) {

            throw new Error(
                "Formato de coordenadas inválido."
            );

        }

        return resultado.data;

    }


    /* =====================================================
       CRIAR ÍNDICE DE COORDENADAS
    ====================================================== */

    function criarIndiceCoordenadas(dados) {

        const indice = {};

        let displayNames = null;

        try {

            displayNames =
                new Intl.DisplayNames(
                    ["pt-BR"],
                    {
                        type: "region"
                    }
                );

        } catch (erro) {

            displayNames = null;

        }


        dados.forEach(item => {

            if (
                !item ||
                !item.lat ||
                item.long === undefined
            ) {
                return;
            }

            const coordenada = {

                lat:
                    Number(item.lat),

                lng:
                    Number(item.long)

            };


            if (
                !Number.isFinite(coordenada.lat) ||
                !Number.isFinite(coordenada.lng)
            ) {
                return;
            }


            /* Nome original da API */

            if (item.name) {

                indice[
                    chavePais(item.name)
                ] = coordenada;

            }


            /* Código ISO */

            if (item.iso2) {

                indice[
                    chavePais(item.iso2)
                ] = coordenada;

                if (displayNames) {

                    try {

                        const nomePT =
                            displayNames.of(
                                item.iso2
                            );

                        if (nomePT) {

                            indice[
                                chavePais(nomePT)
                            ] = coordenada;

                        }

                    } catch (erro) {}

                }

            }

        });


        return indice;

    }


   /* =====================================================
   GLOBO
===================================================== */

async function criarGlobo() {

    if (!globo) return;

    globo.innerHTML = "";

    /* =================================================
       CRIAR O GLOBO IMEDIATAMENTE
    ================================================== */

    mundoGlobo =
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

            .showAtmosphere(
                true
            )

            .atmosphereColor(
                "#c9a46a"
            )

            .atmosphereAltitude(
                0.12
            );


    /* =================================================
       CONFIGURAÇÃO DOS PONTOS
    ================================================== */

    mundoGlobo
        .pointsData([])

        .pointLat("lat")

        .pointLng("lng")

        .pointAltitude(0.02)

        .pointRadius(0)

        .pointColor(
            () => "rgba(0,0,0,0)"
        )

        .pointLabel(
            ponto =>
                nomePais(
                    ponto.pais
                )
        );


    /* =================================================
       LUZ DOS PAÍSES
    ================================================== */

    mundoGlobo

        .htmlElementsData([])

        .htmlLat("lat")

        .htmlLng("lng")

        .htmlAltitude(0.025)

        .htmlElement(
            ponto => {

                const marcador =
                    document.createElement("div");

                marcador.style.position =
                    "relative";

                marcador.style.width =
                    "34px";

                marcador.style.height =
                    "48px";

                marcador.style.pointerEvents =
                    "auto";

                marcador.style.cursor =
                    "pointer";

                marcador.style.transform =
                    "translate(-50%, -50%)";


                /* FEIXE */

                const feixe =
                    document.createElement("div");

                feixe.style.position =
                    "absolute";

                feixe.style.left =
                    "50%";

                feixe.style.bottom =
                    "50%";

                feixe.style.width =
                    "1px";

                feixe.style.height =
                    "38px";

                feixe.style.transform =
                    "translateX(-50%) rotate(28deg)";

                feixe.style.transformOrigin =
                    "bottom center";

                feixe.style.background =
                    "linear-gradient(" +
                    "to top," +
                    "rgba(225,179,109,0.70)," +
                    "rgba(225,179,109,0)" +
                    ")";

                feixe.style.boxShadow =
                    "0 0 5px rgba(225,179,109,0.35)";


                /* AURA */

                const aura =
                    document.createElement("div");

                aura.style.position =
                    "absolute";

                aura.style.left =
                    "50%";

                aura.style.top =
                    "50%";

                aura.style.width =
                    "18px";

                aura.style.height =
                    "18px";

                aura.style.transform =
                    "translate(-50%, -50%)";

                aura.style.borderRadius =
                    "50%";

                aura.style.background =
                    "radial-gradient(" +
                    "circle," +
                    "rgba(255,248,223,0.95) 0%," +
                    "rgba(225,179,109,0.65) 20%," +
                    "rgba(225,179,109,0.25) 42%," +
                    "rgba(225,179,109,0) 72%" +
                    ")";

                aura.style.boxShadow =
                    "0 0 6px rgba(255,241,196,0.8)," +
                    "0 0 14px rgba(225,179,109,0.65)";


                /* NÚCLEO */

                const nucleo =
                    document.createElement("div");

                nucleo.style.position =
                    "absolute";

                nucleo.style.left =
                    "50%";

                nucleo.style.top =
                    "50%";

                nucleo.style.width =
                    "5px";

                nucleo.style.height =
                    "5px";

                nucleo.style.transform =
                    "translate(-50%, -50%)";

                nucleo.style.borderRadius =
                    "50%";

                nucleo.style.background =
                    "#fff8df";

                nucleo.style.boxShadow =
                    "0 0 4px #fff8df," +
                    "0 0 9px #e1b36d";


                marcador.appendChild(feixe);

                marcador.appendChild(aura);

                marcador.appendChild(nucleo);


                /* CLIQUE */

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
            (elemento, visivel) => {

                elemento.style.opacity =
                    visivel ? "1" : "0";

            }
        )

        .htmlTransitionDuration(0);


    /* =================================================
       POSIÇÃO INICIAL
    ================================================== */

    mundoGlobo.pointOfView(
        {
            lat: 10,
            lng: -35,
            altitude: 2.15
        },
        0
    );


    /* =================================================
       CONTROLE POR TOQUE
    ================================================== */

    mundoGlobo.controls()
        .enableZoom = false;

    mundoGlobo.controls()
        .autoRotate = true;

    mundoGlobo.controls()
        .autoRotateSpeed = 0.35;


    /* =================================================
       RESPONSIVO
    ================================================== */

    function ajustarGlobo() {

        if (!mundoGlobo) return;

        mundoGlobo
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


    /* =================================================
       CARREGAR COORDENADAS EM PARALELO
    ================================================== */

    try {

        const dadosCoordenadas =
            await carregarCoordenadas();

        indiceCoordenadasGlobo =
            criarIndiceCoordenadas(
                dadosCoordenadas
            );

        atualizarPontosGlobo();

    } catch (erro) {

        console.error(
            "Erro ao carregar coordenadas:",
            erro
        );

    }

}


/* =====================================================
   ATUALIZAR PONTOS DO GLOBO
===================================================== */

function atualizarPontosGlobo() {

    if (!mundoGlobo) return;

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

                pais: pais,

                lat:
                    coordenada.lat,

                lng:
                    coordenada.lng,

                quantidade:
                    grupos[pais].length

            });

        });


    mundoGlobo
        .pointsData(pontos)

        .htmlElementsData(pontos);

}
   

/* =====================================================
   CARREGAR MENSAGENS DA PLANILHA
===================================================== */

function carregarMensagens() {

    const nomeCallback =
        "dmMarcoMensagens_" +
        Date.now();


    const script =
        document.createElement(
            "script"
        );


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


                criarGlobo();


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


            delete window[
                nomeCallback
            ];

            script.remove();

        };


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

            delete window[
                nomeCallback
            ];

            script.remove();

        };


    document.head.appendChild(
        script
    );

}


/* =====================================================
   FALHA DA API
===================================================== */

function tratarFalhaAPI() {

    mostrarEstado(
        "mural"
    );


    if (carregando) {

        carregando.remove();

    }


    if (erro) {

        erro.hidden =
            true;

        erro.style.display =
            "none";

    }

}


/* =====================================================
   TENTAR NOVAMENTE
===================================================== */

if (tentarNovamente) {

    tentarNovamente.addEventListener(
        "click",
        () => {

            if (erro) {

                erro.hidden =
                    true;

                erro.style.display =
                    "none";

            }

            carregarMensagens();

        }
    );

}


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

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


carregarMensagens();

});
