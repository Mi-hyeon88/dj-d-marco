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
        mexico: "mexico",

        alemanha: "alemanha",
        germany: "alemanha",

        argentina: "argentina",

        chile: "chile",

        colombia: "colombia",
        colombia: "colombia",

        peru: "peru",

        canada: "canada",
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
    ====================================================== */

    async function criarGlobo() {

        if (!globo) return;

        globo.innerHTML = "";

        const grupos =
            agruparPaises();


        let dadosCoordenadas;

        try {

            dadosCoordenadas =
                await carregarCoordenadas();

        } catch (erro) {

            console.error(
                "Erro ao carregar coordenadas:",
                erro
            );

            return;

        }


        const indiceCoordenadas =
            criarIndiceCoordenadas(
                dadosCoordenadas
            );


        /* =================================================
           CRIAR PONTOS SOMENTE DOS PAÍSES COM MENSAGEM
        ================================================== */

        const pontos = [];

        Object.keys(grupos)
            .forEach(pais => {

                let coordenada =
                    indiceCoordenadas[
                        chavePais(pais)
                    ];


                /*
                 * Segunda tentativa:
                 * procura diretamente pelo nome exibido.
                 */

                if (!coordenada) {

                    coordenada =
                        indiceCoordenadas[
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

                    pais:
                        pais,

                    lat:
                        coordenada.lat,

                    lng:
                        coordenada.lng,

                    quantidade:
                        grupos[pais].length

                });

            });


        console.log(
            "Países com mensagens:",
            Object.keys(grupos)
        );

        console.log(
            "Pontos criados:",
            pontos
        );


        /* =================================================
           GLOBO
        ================================================== */

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

                .showAtmosphere(
                    true
                )

                .atmosphereColor(
                    "#c9a46a"
                )

                .atmosphereAltitude(
                    0.12
                )

                .pointsData(
                    pontos
                )

                .pointLat(
                    "lat"
                )

                .pointLng(
                    "lng"
                )

                .pointAltitude(
                    0.06
                )


                /* =================================================
   PONTO + HALO
================================================= */

.pointThreeObject(() => {

    const grupo =
        new THREE.Group();


    /* PONTO CENTRAL */

    const geometria =
        new THREE.SphereGeometry(
            0.018,
            16,
            16
        );

    const material =
        new THREE.MeshBasicMaterial({
            color: 0xe1b36d
        });

    const ponto =
        new THREE.Mesh(
            geometria,
            material
        );

    grupo.add(
        ponto
    );


    /* HALO SEPARADO */

    const canvas =
        document.createElement(
            "canvas"
        );

    canvas.width = 128;
    canvas.height = 128;

    const contexto =
        canvas.getContext("2d");

    const centro = 64;


    const gradiente =
        contexto.createRadialGradient(
            centro,
            centro,
            28,
            centro,
            centro,
            58
        );


    /* CENTRO TOTALMENTE TRANSPARENTE */

    gradiente.addColorStop(
        0,
        "rgba(225,179,109,0)"
    );

    gradiente.addColorStop(
        0.48,
        "rgba(225,179,109,0)"
    );


    /* LUZ MUITO SUTIL */

    gradiente.addColorStop(
        0.62,
        "rgba(225,179,109,0.16)"
    );

    gradiente.addColorStop(
        0.76,
        "rgba(225,179,109,0.06)"
    );

    gradiente.addColorStop(
        1,
        "rgba(225,179,109,0)"
    );


    contexto.fillStyle =
        gradiente;

    contexto.fillRect(
        0,
        0,
        128,
        128
    );


    const textura =
        new THREE.CanvasTexture(
            canvas
        );

    textura.needsUpdate = true;


    const materialHalo =
        new THREE.SpriteMaterial({

            map: textura,

            transparent: true,

            depthWrite: false

        });


    const halo =
        new THREE.Sprite(
            materialHalo
        );


    halo.scale.set(
        0.14,
        0.14,
        1
    );


    grupo.add(
        halo
    );


    return grupo;

})


/* =====================================================
   POSIÇÃO INICIAL
===================================================== */

mundo.pointOfView(
    {
        lat:
            10,

        lng:
            -35,

        altitude:
            2.15

    },
    0
);


/* =====================================================
   CONTROLE POR TOQUE
===================================================== */

mundo.controls()
    .enableZoom = false;

mundo.controls()
    .autoRotate = true;

mundo.controls()
    .autoRotateSpeed = 0.35;


/* =====================================================
   RESPONSIVO
===================================================== */

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
       
