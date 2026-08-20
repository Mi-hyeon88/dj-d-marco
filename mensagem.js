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

            coreia:
                "Coreia do Sul",

            japao:
                "Japão",

            "japão":
                "Japão",

            "estados unidos":
                "Estados Unidos",

            eua:
                "Estados Unidos",

            franca:
                "França",

            "frança":
                "França",

            portugal:
                "Portugal",

            mexico:
                "México",

            "méxico":
                "México",

            alemanha:
                "Alemanha",

            argentina:
                "Argentina",

            chile:
                "Chile",

            colombia:
                "Colômbia",

            "colômbia":
                "Colômbia",

            peru:
                "Peru",

            canada:
                "Canadá",

            italia:
                "Itália",

            "itália":
                "Itália",

            espanha:
                "Espanha",

            "espanha":
                "Espanha",

            reino_unido:
                "Reino Unido",

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
       ABRIR MENSAGEM
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
       VOLTAR
    ====================================================== */

    document
        .querySelectorAll("[data-voltar]")
        .forEach(botao => {

            botao.addEventListener(
                "click",
                () => {

                    const destino =
                        botao.dataset.voltar;


                    if (destino === "paises") {

                        criarListaPaises();

                        mostrarEstado("paises");

                    }


                    if (destino === "pais") {

                        mostrarEstado("pais");

                    }

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
       GLOBO INTERATIVO
    ====================================================== */

    function criarGlobo() {

        if (!globo) return;


        globo.innerHTML = "";


        const canvas =
            document.createElement("canvas");


        canvas.width = 900;
        canvas.height = 900;


        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.touchAction = "none";


        globo.appendChild(canvas);


        const ctx =
            canvas.getContext("2d");


        let rotacao = 0;

        let arrastando = false;

        let inicioX = 0;

        let movimentoToque = 0;

        let pontosGlobo = [];


        /* =================================================
           POSIÇÕES DOS PAÍSES
        ================================================== */

        const coordenadas = {

            brasil: [-52, -10],

            "coreia do sul": [127.8, 36.2],

            coreia: [127.8, 36.2],

            japao: [138, 36],

            "japão": [138, 36],

            "estados unidos": [-100, 38],

            eua: [-100, 38],

            canada: [-106, 56],

            mexico: [-102, 23],

            "méxico": [-102, 23],

            argentina: [-64, -34],

            chile: [-71, -33],

            portugal: [-8, 39],

            espanha: [-4, 40],

            franca: [2, 46],

            "frança": [2, 46],

            alemanha: [10, 51],

            italia: [12, 42],

            "itália": [12, 42],

            reino_unido: [-3, 55],

            "reino unido": [-3, 55],

            colombia: [-74, 4],

            "colômbia": [-74, 4],

            peru: [-75, -10]

        };


        /* =================================================
           POSIÇÃO DO PONTO NO GLOBO
        ================================================== */

        function projetarPonto(
            longitude,
            latitude,
            raio,
            centroX,
            centroY
        ) {

            const lon =
                (
                    longitude +
                    rotacao * 12
                ) *
                Math.PI /
                180;


            const lat =
                latitude *
                Math.PI /
                180;


            const x3d =
                Math.cos(lat) *
                Math.sin(lon);


            const y3d =
                Math.sin(lat);


            const z3d =
                Math.cos(lat) *
                Math.cos(lon);


            if (z3d < 0) {
                return null;
            }


            return {

                x:
                    centroX +
                    x3d * raio,

                y:
                    centroY -
                    y3d * raio,

                profundidade:
                    z3d

            };

        }


        /* =================================================
           DESENHAR
        ================================================== */

        function desenhar() {

            const largura =
                canvas.width;

            const altura =
                canvas.height;


            const raio =
                Math.min(
                    largura,
                    altura
                ) * 0.42;


            const centroX =
                largura / 2;

            const centroY =
                altura / 2;


            ctx.clearRect(
                0,
                0,
                largura,
                altura
            );


            /* ---------- ATMOSFERA ---------- */

            const atmosfera =
                ctx.createRadialGradient(
                    centroX,
                    centroY,
                    raio * 0.65,
                    centroX,
                    centroY,
                    raio * 1.12
                );


            atmosfera.addColorStop(
                0,
                "rgba(20,20,25,1)"
            );

            atmosfera.addColorStop(
                0.75,
                "rgba(3,3,5,1)"
            );

            atmosfera.addColorStop(
                1,
                "rgba(201,164,106,0)"
            );


            ctx.fillStyle =
                atmosfera;


            ctx.beginPath();

            ctx.arc(
                centroX,
                centroY,
                raio * 1.12,
                0,
                Math.PI * 2
            );

            ctx.fill();


            /* ---------- OCEANO ---------- */

            const oceano =
                ctx.createRadialGradient(
                    centroX - raio * 0.25,
                    centroY - raio * 0.3,
                    raio * 0.1,
                    centroX,
                    centroY,
                    raio
                );


            oceano.addColorStop(
                0,
                "#17212a"
            );

            oceano.addColorStop(
                0.7,
                "#071018"
            );

            oceano.addColorStop(
                1,
                "#010305"
            );


            ctx.fillStyle =
                oceano;


            ctx.beginPath();

            ctx.arc(
                centroX,
                centroY,
                raio,
                0,
                Math.PI * 2
            );

            ctx.fill();


            /* ---------- LONGITUDES ---------- */

            ctx.strokeStyle =
                "rgba(201,164,106,0.13)";

            ctx.lineWidth = 2;


            for (
                let i = -3;
                i <= 3;
                i++
            ) {

                ctx.beginPath();

                ctx.ellipse(
                    centroX,
                    centroY,
                    Math.max(
                        Math.abs(
                            Math.sin(
                                (i + rotacao) * 0.5
                            )
                        ) * raio,
                        2
                    ),
                    raio,
                    0,
                    0,
                    Math.PI * 2
                );

                ctx.stroke();

            }


            /* ---------- LATITUDES ---------- */

            for (
                let i = -2;
                i <= 2;
                i++
            ) {

                ctx.beginPath();

                ctx.ellipse(
                    centroX,
                    centroY,
                    raio,
                    Math.cos(
                        i * 0.35
                    ) * raio * 0.82,
                    0,
                    0,
                    Math.PI * 2
                );

                ctx.stroke();

            }


            /* =================================================
               PONTOS DOS PAÍSES
            ================================================== */

            pontosGlobo = [];


            const grupos =
                agruparPaises();


            Object.keys(grupos).forEach(
                pais => {

                    let coordenada =
                        coordenadas[pais];


                    /*
                     * Se o país ainda não estiver
                     * cadastrado acima, recebe uma
                     * posição automática.
                     */

                    if (!coordenada) {

                        const quantidade =
                            Object.keys(
                                grupos
                            ).length;


                        const posicao =
                            Object.keys(
                                grupos
                            ).indexOf(pais);


                        const angulo =
                            (
                                posicao /
                                Math.max(
                                    quantidade,
                                    1
                                )
                            ) *
                            Math.PI *
                            2;


                        coordenada = [

                            Math.sin(angulo) * 120,

                            Math.cos(angulo) * 45

                        ];

                    }


                    const ponto =
                        projetarPonto(
                            coordenada[0],
                            coordenada[1],
                            raio,
                            centroX,
                            centroY
                        );


                    if (!ponto) return;


                    pontosGlobo.push({

                        pais,

                        x: ponto.x,

                        y: ponto.y,

                        profundidade:
                            ponto.profundidade

                    });

                }
            );


            pontosGlobo
                .sort(
                    (a, b) =>
                        a.profundidade -
                        b.profundidade
                )
                .forEach(ponto => {

                    const tamanho =
                        3 +
                        ponto.profundidade *
                        3;


                    ctx.fillStyle =
                        "rgba(225,179,109,0.95)";


                    ctx.shadowBlur =
                        14;


                    ctx.shadowColor =
                        "rgba(225,179,109,0.9)";


                    ctx.beginPath();


                    ctx.arc(
                        ponto.x,
                        ponto.y,
                        tamanho,
                        0,
                        Math.PI * 2
                    );


                    ctx.fill();


                    ctx.shadowBlur = 0;

                });


            /* ---------- BORDA ---------- */

            ctx.strokeStyle =
                "rgba(201,164,106,0.45)";

            ctx.lineWidth = 2;


            ctx.beginPath();

            ctx.arc(
                centroX,
                centroY,
                raio,
                0,
                Math.PI * 2
            );

            ctx.stroke();


            /* ---------- ROTAÇÃO ---------- */

            if (!arrastando) {

                rotacao += 0.0025;

            }


            requestAnimationFrame(
                desenhar
            );

        }


        /* =================================================
           TOQUE / ARRASTAR
        ================================================== */

        canvas.addEventListener(
            "pointerdown",
            event => {

                arrastando = true;

                movimentoToque = 0;

                inicioX =
                    event.clientX;


                canvas.setPointerCapture(
                    event.pointerId
                );

            }
        );


        canvas.addEventListener(
            "pointermove",
            event => {

                if (!arrastando) return;


                const diferenca =
                    event.clientX -
                    inicioX;


                movimentoToque +=
                    Math.abs(diferenca);


                rotacao +=
                    diferenca * 0.012;


                inicioX =
                    event.clientX;

            }
        );


        canvas.addEventListener(
            "pointerup",
            event => {

                if (!arrastando) return;


                arrastando = false;


                /*
                 * Se quase não houve movimento,
                 * tratamos como TOQUE.
                 */

                if (movimentoToque < 12) {

                    const rect =
                        canvas.getBoundingClientRect();


                    const escalaX =
                        canvas.width /
                        rect.width;


                    const escalaY =
                        canvas.height /
                        rect.height;


                    const toqueX =
                        (
                            event.clientX -
                            rect.left
                        ) *
                        escalaX;


                    const toqueY =
                        (
                            event.clientY -
                            rect.top
                        ) *
                        escalaY;


                    let pontoEscolhido =
                        null;

                    let menorDistancia =
                        Infinity;


                    pontosGlobo.forEach(
                        ponto => {

                            const distancia =
                                Math.hypot(
                                    toqueX -
                                    ponto.x,
                                    toqueY -
                                    ponto.y
                                );


                            if (
                                distancia <
                                35 &&
                                distancia <
                                menorDistancia
                            ) {

                                menorDistancia =
                                    distancia;

                                pontoEscolhido =
                                    ponto;

                            }

                        }
                    );


                    if (pontoEscolhido) {

                        abrirPais(
                            pontoEscolhido.pais
                        );

                    }

                }

            }
        );


        canvas.addEventListener(
            "pointercancel",
            () => {

                arrastando = false;

            }
        );


        desenhar();

    }


    /* =====================================================
       CARREGAR MENSAGENS — JSONP
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

                    criarGlobo();

                    mostrarEstado("mural");


                    if (carregando) {
                        carregando.remove();
                    }


                } catch (error) {

                    console.error(
                        "Erro ao processar mensagens:",
                        error
                    );

                    mostrarErro();

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

                mostrarErro();


                delete window[nomeCallback];

                script.remove();

            };


        document.head.appendChild(
            script
        );

    }


    /* =====================================================
       ERRO
    ====================================================== */

    function mostrarErro() {

        if (carregando) {

            carregando.remove();

        }


        if (erro) {

            erro.hidden = false;

            erro.style.display =
                "flex";

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
       INICIAR
    ====================================================== */

    carregarMensagens();

});
               
