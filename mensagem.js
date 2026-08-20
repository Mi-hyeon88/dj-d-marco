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

    const mensagemAnteriorBotao =
        document.getElementById("mensagemAnterior");

    const mensagemProximaBotao =
        document.getElementById("mensagemProxima");

    const tentarNovamente =
        document.getElementById("tentarNovamente");


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

        return String(pais || "")
            .trim()
            .toLowerCase();

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
                "Argentina"

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
       CRIAR LISTA DE PAÍSES
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
                        nomePais(b)
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
       ABRIR PRIMEIRA MENSAGEM
    ====================================================== */

    function abrirMensagem() {

        if (!mensagensPais.length) {
            return;
        }

        prepararMensagem();

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

        if (!mensagensPais.length) {
            return;
        }


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

        if (!mensagensPais.length) {
            return;
        }


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

                        return;

                    }


                    if (destino === "pais") {

                        mostrarEstado("pais");

                    }

                }
            );

        });


    /* =====================================================
       ABRIR MENSAGEM AO TOCAR NA APRESENTAÇÃO DO PAÍS
    ====================================================== */

    const paisCentro =
        document.querySelector(".pais-centro");

    if (paisCentro) {

        paisCentro.style.cursor = "pointer";

        paisCentro.addEventListener(
            "click",
            abrirMensagem
        );

    }


    /* =====================================================
       BOTÃO ANTERIOR
    ====================================================== */

    if (mensagemAnteriorBotao) {

        mensagemAnteriorBotao.addEventListener(
            "click",
            mensagemAnterior
        );

    }


    /* =====================================================
       BOTÃO PRÓXIMA
    ====================================================== */

    if (mensagemProximaBotao) {

        mensagemProximaBotao.addEventListener(
            "click",
            proximaMensagem
        );

    }


    /* =====================================================
       GLOBO
    ====================================================== */

    const globo =
        document.querySelector(".globo");


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
                    Math.abs(
                        Math.sin(
                            (i + rotacao) * 0.5
                        )
                    ) * raio,
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


            /* ---------- PONTOS DE LUZ ---------- */

            const pontos = [

                [0.73, 0.38],
                [0.68, 0.45],
                [0.58, 0.53],
                [0.51, 0.65],
                [0.42, 0.70],
                [0.31, 0.58],
                [0.23, 0.42],
                [0.62, 0.30],
                [0.39, 0.33]

            ];


            pontos.forEach(([x, y]) => {

                const px =
                    centroX +
                    (x - 0.5) *
                    raio *
                    1.7;


                const py =
                    centroY +
                    (y - 0.5) *
                    raio *
                    1.7;


                const distancia =
                    Math.hypot(
                        px - centroX,
                        py - centroY
                    );


                if (
                    distancia >
                    raio * 0.88
                ) return;


                ctx.fillStyle =
                    "rgba(225,179,109,0.9)";


                ctx.shadowBlur = 12;

                ctx.shadowColor =
                    "rgba(225,179,109,0.9)";


                ctx.beginPath();

                ctx.arc(
                    px,
                    py,
                    4,
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


        /* =====================================================
           INTERAÇÃO DO GLOBO
        ====================================================== */

        canvas.addEventListener(
            "pointerdown",
            event => {

                arrastando = true;

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


                rotacao +=
                    diferenca * 0.008;


                inicioX =
                    event.clientX;

            }
        );


        canvas.addEventListener(
            "pointerup",
            () => {

                arrastando = false;

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


        const script =
            document.createElement("script");


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


                mostrarErro();


                delete window[nomeCallback];

                script.remove();

            };


        document
            .head
            .appendChild(script);

    }


    /* =====================================================
       MOSTRAR ERRO
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


                if (carregando) {

                    carregando.style.display =
                        "flex";

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
