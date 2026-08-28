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
    document.querySelector("#paisNome");

const listaMensagens =
    document.querySelector("#listaMensagens");

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
   IDIOMA
===================================================== */

const idiomaAtual =
    localStorage.getItem("idiomaDMarco") || "ko";


const traducoes = {

    ko: {
        tituloMural: "벽화",

        subtitulo: "세계 곳곳에서 온 메시지",

        instrucaoGlobo:
            "글로브를 움직여 나라를 둘러보세요.<br>빛나는 곳을 눌러 메시지를 확인하세요.",

        instrucaoPais:
            "나라를 눌러<br>메시지를 확인하세요 ♡",

       listaMensagensTitulo:
    "당신을 위한 메시지",
       
        paraVoce:
            "당신을 위해,",

        anterior:
            "이전",

        proxima:
            "다음",

        erro:
            "메시지를 불러오지 못했습니다.",

        tentarNovamente:
            "다시 시도",

        de:
            "보낸 사람",

        contador: "개"
    },

    pt: {
    tituloMural: "Mural",

    subtitulo:
        "Mensagens ao redor do mundo",
       
        instrucaoGlobo:
            "Mova o globo para explorar os países.<br>Toque nas luzes para ver as mensagens.",

        instrucaoPais:
            "Toque em um país para ver<br>as mensagens ♡",

       listaMensagensTitulo:
    "Mensagens para você",

        paraVoce:
            "Para você,",

        anterior:
            "Anterior",

        proxima:
            "Próxima",

        erro:
            "Não foi possível carregar as mensagens.",

        tentarNovamente:
            "Tentar novamente",

        de:
            "De",

        contador: "mensagens"
    },

    en: {
    tituloMural: "Mural",

    subtitulo:
        "Messages from around the world",

        instrucaoGlobo:
            "Move the globe to explore the countries.<br>Tap the lights to see the messages.",

        instrucaoPais:
            "Tap a country to see<br>the messages ♡",

       listaMensagensTitulo:
    "Messages for you",

        paraVoce:
            "For you,",

        anterior:
            "Previous",

        proxima:
            "Next",

        erro:
            "Could not load the messages.",

        tentarNovamente:
            "Try again",

        de:
            "From",

        contador: "messages"
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
       ESTADO
    ====================================================== */

    function mostrarEstado(nome) {

    if (mensagemVoltar) {

        mensagemVoltar.style.visibility =
            nome === "mural"
                ? "visible"
                : "hidden";

        mensagemVoltar.style.pointerEvents =
            nome === "mural"
                ? "auto"
                : "none";

    }

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
        uk: "reino unido",

       filipinas: "filipinas",
philippines: "filipinas",

polonia: "polonia",
poland: "polonia",
       
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


    const chave =
        chavePais(pais);

    const idioma =
        traducoes[idiomaAtual]
            ? idiomaAtual
            : "ko";


    return (
        nomes[chave] &&
        nomes[chave][idioma]
    )
        ? nomes[chave][idioma]
        : String(
            pais ||
            (
                idioma === "ko"
                    ? "기타 국가"
                    : idioma === "en"
                        ? "Other countries"
                        : "Outros países"
            )
        );

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
   LISTA DE MENSAGENS DO PAÍS
===================================================== */

function criarListaMensagens() {

    if (!listaMensagens) return;

    listaMensagens.innerHTML = "";


    mensagensPais.forEach(
        (mensagem, indice) => {

            const botao =
                document.createElement("button");

            botao.type = "button";

            botao.className =
                "mensagem-item";


            const numero =
                String(indice + 1)
                    .padStart(2, "0");


            const nome =
                mensagem.nome
                    ? mensagem.nome
                    : (
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

          const numeroAtual =
    indiceMensagem + 1;

const totalMensagens =
    mensagensPais.length;

contadorMensagens.textContent =
    idiomaAtual === "ko"
        ? `${numeroAtual} / ${totalMensagens}`
        : idiomaAtual === "en"
            ? `${numeroAtual} of ${totalMensagens}`
            : `${numeroAtual} de ${totalMensagens}`;

        mostrarEstado("mensagem");

iniciarFada();

    }

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
   FADA ANTES DA MENSAGEM
===================================================== */

function iniciarFada() {

    const estadoMensagem =
        document.querySelector(".estado-mensagem");

    if (!estadoMensagem) return;

    const fada =
        estadoMensagem.querySelector(".fada");

    const papel =
        estadoMensagem.querySelector(".fada-pergaminho");

    const poeira =
        estadoMensagem.querySelector(".po-fada");

    if (!fada || !papel || !poeira) return;


    /* =================================================
       REINICIAR ANIMAÇÃO
    ================================================== */

    estadoMensagem.classList.remove(
        "carregando-fada"
    );

    void estadoMensagem.offsetWidth;

    estadoMensagem.classList.add(
        "carregando-fada"
    );


    /* =================================================
       REINICIAR ELEMENTOS ANIMADOS
    ================================================== */

    [fada, papel, poeira].forEach(elemento => {

        elemento.style.animation = "none";

        void elemento.offsetWidth;

        elemento.style.animation = "";

    });


    /* =================================================
       MOMENTO EM QUE A MENSAGEM É REVELADA
    ================================================== */

    setTimeout(() => {

        estadoMensagem.classList.remove(
            "carregando-fada"
        );

    }, 2700);

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

       mostrarEstado("mensagem");

iniciarFada();

    }


    /* =====================================================
   VOLTAR ENTRE ESTADOS
===================================================== */

const botoesVoltar =
    document.querySelectorAll(
        "[data-voltar]"
    );

botoesVoltar.forEach(botao => {

    botao.addEventListener(
        "click",
        evento => {

            evento.preventDefault();
            evento.stopImmediatePropagation();

            const destino =
                botao.getAttribute(
                    "data-voltar"
                );

            if (!destino) return;

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
   CONFIGURAÇÃO VISUAL DOS PAÍSES
===================================================== */

const CONFIG_GLOBO = {

    brasil: {
        en: "BRAZIL",
        ko: "브라질",
        bandeira: "🇧🇷",
        lado: "esquerda",
        linha: 50,
        angulo: 0,
        offsetX: 0,
        offsetY: 0
    },

    colombia: {
        en: "COLOMBIA",
        ko: "콜롬비아",
        bandeira: "🇨🇴",
        lado: "esquerda",
        linha: 58,
        angulo: -12,
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
    "#8fc9ff"
)

.atmosphereAltitude(
    0.16

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

marcador.className =
    "globo-marcador";


const config =
    CONFIG_GLOBO[
        chavePais(ponto.pais)
    ];

if (!config) {
    return marcador;
}


/* =================================================
   TAMANHO DA LINHA — HERDADO PELA ETIQUETA
================================================= */

marcador.style.setProperty(
    "--linha-tamanho",
    `${config.linha}px`
);
      

        /* =================================================
           LUZ
        ================================================== */

        const luz =
            document.createElement("div");

        luz.className =
            "globo-luz";


        /* =================================================
           LINHA
        ================================================== */

        const linha =
    document.createElement("div");

linha.className =
    "globo-linha";

linha.style.setProperty(
    "--linha-tamanho",
    `${config.linha}px`
);

const anguloLinha =
    config.lado === "esquerda"
        ? 180 + config.angulo
        : config.angulo;

linha.style.transform =
    `rotate(${anguloLinha}deg)`;
   

        /* =================================================
           ETIQUETA
        ================================================== */

        const etiqueta =
    document.createElement("div");

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
            document.createElement("span");

        bandeira.className =
            "globo-bandeira";

        bandeira.textContent =
            config.bandeira;


        /* =================================================
           TEXTOS
        ================================================== */

        const textos =
            document.createElement("div");

        textos.className =
            "globo-textos";


        const nome =
            document.createElement("div");

        nome.className =
            "globo-nome";

        nome.textContent =
            config.en;


        const nomeCoreano =
            document.createElement("div");

        nomeCoreano.className =
            "globo-nome-coreano";

        nomeCoreano.textContent =
            config.ko;


        textos.appendChild(nome);

        textos.appendChild(nomeCoreano);


        etiqueta.appendChild(bandeira);

        etiqueta.appendChild(textos);


        marcador.appendChild(linha);

        marcador.appendChild(luz);

        marcador.appendChild(etiqueta);



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
        lat: 12,
        lng: -20,
        altitude: 2.35
    },
    0
);


    /* =================================================
       CONTROLE POR TOQUE
    ================================================== */

   mundoGlobo.controls()
    .enableZoom = false;

mundoGlobo.controls()
    .autoRotate = false;


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
   ESCOLHER MENSAGEM PELO IDIOMA
===================================================== */

function textoMensagem(mensagem) {

    if (!mensagem) {
        return "";
    }

    /* COREANO — usa a tradução */
    if (idiomaAtual === "ko") {

        return String(
            mensagem.mensagem_coreano ||
            mensagem.mensagem_original ||
            mensagem.mensagem ||
            ""
        ).trim();

    }

    /* PORTUGUÊS E INGLÊS — mantém a mensagem original */
    return String(
        mensagem.mensagem_original ||
        mensagem.mensagem ||
        ""
    ).trim();

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

   aplicarIdioma();


/* =====================================================
   MOSTRAR O GLOBO PRIMEIRO
===================================================== */

criarGlobo();


/* =====================================================
   CARREGAR MENSAGENS
===================================================== */

carregarMensagens();

});
