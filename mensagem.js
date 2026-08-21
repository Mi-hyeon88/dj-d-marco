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

    async function criarGlobo() {

    if (!globo) return;

    globo.innerHTML = "";

    const grupos = agruparPaises();

    const coordenadasPaises = {};
let promessaCoordenadas = null;

function adicionarChaveCoordenada(chave, coordenada) {

    if (!chave) return;

    const normalizada =
        String(chave)
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

    coordenadasPaises[normalizada] = coordenada;
}


async function obterCoordenadasPais(pais) {

    const chavePais =
        normalizarPais(pais);

    const chaveSimples =
        String(chavePais)
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");


    if (coordenadasPaises[chaveSimples]) {

        return coordenadasPaises[chaveSimples];

    }


    if (!promessaCoordenadas) {

        promessaCoordenadas =
            fetch(
                "https://restcountries.com/v3.1/all?fields=name,latlng,translations"
            )
            .then(resposta => {

                if (!resposta.ok) {
                    throw new Error(
                        "Falha ao carregar coordenadas dos países."
                    );
                }

                return resposta.json();

            })
            .then(dados => {

                dados.forEach(item => {

                    if (
                        !item ||
                        !item.latlng ||
                        !Array.isArray(item.latlng) ||
                        item.latlng.length < 2
                    ) {
                        return;
                    }


                    const coordenada = {

                        lat: item.latlng[0],

                        lng: item.latlng[1]

                    };


                    /* Nome principal */

                    if (item.name) {

                        adicionarChaveCoordenada(
                            item.name.common,
                            coordenada
                        );

                        adicionarChaveCoordenada(
                            item.name.official,
                            coordenada
                        );

                    }


                    /* Traduções */

                    if (item.translations) {

                        Object.values(
                            item.translations
                        ).forEach(traducao => {

                            if (!traducao) return;

                            adicionarChaveCoordenada(
                                traducao.common,
                                coordenada
                            );

                            adicionarChaveCoordenada(
                                traducao.official,
                                coordenada
                            );

                        });

                    }

                });

                return coordenadasPaises;

            })
            .catch(erro => {

                console.error(
                    "Erro ao carregar coordenadas:",
                    erro
                );

                promessaCoordenadas = null;

                return null;

            });

    }


    await promessaCoordenadas;


    return (
        coordenadasPaises[chaveSimples] ||
        null
    );

}


    const pontos = (
    await Promise.all(
        Object.keys(grupos).map(async pais => {

            const coordenada =
                await obterCoordenadasPais(pais);

            if (!coordenada) return null;

            return {
                pais: pais,
                lat: coordenada.lat,
                lng: coordenada.lng,
                quantidade: grupos[pais].length
            };
        })
    )
).filter(Boolean);


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

.pointAltitude(0.06)

.pointThreeObject(() => {

    const grupo = new THREE.Group();


    /* PONTO CENTRAL */

    const geometria =
        new THREE.SphereGeometry(
            1.6,
            12,
            12
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

    grupo.add(ponto);


    /* HALO SEPARADO */

    const canvas =
        document.createElement("canvas");

    canvas.width = 128;
    canvas.height = 128;

    const contexto =
        canvas.getContext("2d");

    const centro = 64;


    const gradiente =
        contexto.createRadialGradient(
            centro,
            centro,
            18,
            centro,
            centro,
            58
        );


    gradiente.addColorStop(
        0,
        "rgba(225,179,109,0)"
    );

    gradiente.addColorStop(
        0.30,
        "rgba(225,179,109,0)"
    );

    gradiente.addColorStop(
        0.55,
        "rgba(225,179,109,0.22)"
    );

    gradiente.addColorStop(
        0.72,
        "rgba(225,179,109,0.08)"
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
        6,
        6,
        1
    );


    grupo.add(halo);


    return grupo;

})

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

                   criarGlobo();

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

mostrarEstado("mural");


/*
 * Os dados são carregados depois,
 * sem bloquear o globo.
 */

carregarMensagens();

   });
