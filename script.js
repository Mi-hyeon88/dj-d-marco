/* =========================================================
   D.MARCO — HOME
========================================================= */

:root {
    --preto: #030303;
    --dourado: #c9a46a;
    --creme: #eee4d8;
    --cinza: #b8aea5;
    --borda: rgba(201, 164, 106, 0.45);
}


/* =========================================================
   BASE
========================================================= */

* {
    box-sizing: border-box;
}

html,
body {
    margin: 0;
    padding: 0;
    min-height: 100%;
}

body {
    background: var(--preto);
    color: var(--creme);
    font-family: Georgia, "Times New Roman", serif;
}


/* =========================================================
   HOME
========================================================= */

.home {
    position: relative;

    min-height: 100vh;
    min-height: 100svh;

    background-image:
        linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.05),
            rgba(0, 0, 0, 0.18) 45%,
            rgba(0, 0, 0, 0.72) 100%
        ),
        url("home-bg.jpg");

    background-size: cover;
    background-position: center top;
    background-repeat: no-repeat;

    overflow-x: hidden;
}


/* =========================================================
   TOPO
========================================================= */

.topo {
    position: relative;
    z-index: 5;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 42px 55px;
}

.logo {
    color: var(--dourado);

    font-size: 30px;
    letter-spacing: 2px;
}

.topo-direita {
    display: flex;
    align-items: center;

    gap: 28px;
}

.seletor-topo {
    display: flex;
    align-items: center;

    gap: 7px;

    color: var(--creme);

    font-family: Arial, sans-serif;
    font-size: 14px;
}

.globo {
    color: var(--dourado);
    font-size: 25px;
}

.seta {
    color: var(--dourado);
    font-size: 18px;
}

.menu-mobile {
    display: flex;
    flex-direction: column;
    justify-content: center;

    width: 30px;

    gap: 6px;
}

.menu-mobile span {
    display: block;

    width: 100%;
    height: 2px;

    background: var(--dourado);
}


/* =========================================================
   BOAS-VINDAS
========================================================= */

.boas-vindas {
    position: relative;
    z-index: 2;

    width: min(1050px, 90%);

    margin: 7vh auto 0;

    text-align: center;
}

.boas-vindas h1 {
    margin: 0 0 42px;

    color: var(--creme);

    font-size: clamp(32px, 4vw, 58px);
    font-weight: 400;

    letter-spacing: 2px;
}


/* =========================================================
   NAVEGAÇÃO
========================================================= */

.navegacao {
    display: grid;

    grid-template-columns: repeat(3, 1fr);

    gap: 22px;
}


/* =========================================================
   CARDS
========================================================= */

.card {
    position: relative;

    min-height: 260px;

    padding: 30px 22px;

    border: 1px solid var(--borda);
    border-radius: 18px;

    appearance: none;
    -webkit-appearance: none;

    overflow: hidden;

    background-color: rgba(0, 0, 0, 0.35);

    background-image:
        linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.25),
            rgba(0, 0, 0, 0.68)
        ),
        url("cards-bg.jpg");

    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;

    color: var(--creme);

    font-family: Georgia, "Times New Roman", serif;

    cursor: pointer;

    transition:
        border-color 0.3s ease,
        transform 0.3s ease;
}

.card:hover {
    border-color: rgba(201, 164, 106, 0.75);

    transform: translateY(-3px);
}

.icone {
    position: relative;
    z-index: 1;

    margin-bottom: 24px;

    color: var(--dourado);

    font-size: 38px;
}

.card h2 {
    position: relative;
    z-index: 1;

    margin: 0 0 16px;

    color: var(--dourado);

    font-size: 18px;
    font-weight: 400;

    letter-spacing: 2px;
}

.card p {
    position: relative;
    z-index: 1;

    margin: 0;

    color: var(--creme);

    font-family: Arial, sans-serif;

    font-size: 13px;
    line-height: 1.7;
}


/* =========================================================
   IDIOMA
========================================================= */

.idioma {
    display: flex;
    flex-direction: column;
    align-items: center;

    gap: 12px;

    margin-top: 34px;
    padding-bottom: 40px;

    color: var(--cinza);

    font-family: Arial, sans-serif;

    font-size: 11px;
    letter-spacing: 2px;
}

.idiomas {
    display: flex;

    padding: 3px;

    border: 1px solid var(--borda);
    border-radius: 30px;
}

.idiomas button {
    border: 0;

    background: transparent;

    padding: 8px 20px;

    color: var(--cinza);

    font-family: Georgia, "Times New Roman", serif;
    font-size: inherit;

    cursor: pointer;
}

.idiomas .ativo {
    color: var(--dourado);
}


/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 700px) {

    /* ---------- FUNDO ---------- */

    .home {
        min-height: 100svh;

        background-image:
            linear-gradient(
                to bottom,
                rgba(0, 0, 0, 0.08) 0%,
                rgba(0, 0, 0, 0.10) 36%,
                rgba(0, 0, 0, 0.42) 62%,
                rgba(0, 0, 0, 0.94) 100%
            ),
            url("home-bg.jpg");

        background-size: 100% auto;
        background-position: center top;
        background-repeat: no-repeat;

        overflow-x: hidden;
        overflow-y: visible;
    }


    /* ---------- TOPO ---------- */

    .topo {
        padding: 24px 22px 0;
    }

    .logo {
        font-size: 24px;
        letter-spacing: 1.5px;
    }

    .topo-direita {
        gap: 17px;
    }

    .seletor-topo {
        gap: 5px;
        font-size: 12px;
    }

    .globo {
        font-size: 21px;
    }

    .seta {
        font-size: 15px;
    }

    .menu-mobile {
        width: 26px;
        gap: 5px;
    }


    /* ---------- CONTEÚDO ---------- */

    .boas-vindas {
        width: calc(100% - 40px);

        margin: 0 auto;
        padding-top: 48vw;

        text-align: center;
    }

    .boas-vindas h1 {
        margin: 0 0 20px;

        color: var(--dourado);

        font-size: 28px;
        font-weight: 400;

        letter-spacing: 1px;

        white-space: nowrap;
    }


    /* ---------- GRID ---------- */

    .navegacao {
        display: grid;

        grid-template-columns: repeat(2, minmax(0, 1fr));

        gap: 12px 18px;
    }


    /* ---------- CARDS SUPERIORES ---------- */

    .card {
        min-height: 0;
        height: 340px;

        padding: 22px 12px;

        border-radius: 15px;

        background-color: rgba(0, 0, 0, 0.30);

        background-image:
            linear-gradient(
                to bottom,
                rgba(0, 0, 0, 0.25),
                rgba(0, 0, 0, 0.68)
            ),
            url("cards-bg.jpg");

        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;

        text-align: center;
    }

    .icone {
        margin-bottom: 14px;

        font-size: 35px;
    }

    .card h2 {
        margin: 0 0 10px;

        color: var(--dourado);

        font-size: 16px;
        letter-spacing: 1px;
    }

    .card p {
        color: var(--creme);

        font-size: 10px;
        line-height: 1.55;
    }


    /* ---------- MEMÓRIAS ---------- */

    .card:nth-child(3) {
        grid-column: 1 / -1;

        height: 205px;
        min-height: 0;

        display: grid;

        grid-template-columns: 105px 1fr;

        column-gap: 14px;

        align-items: start;

        padding: 30px 24px;

        text-align: left;

        background-image:
            linear-gradient(
                to right,
                rgba(0, 0, 0, 0.28),
                rgba(0, 0, 0, 0.70)
            ),
            url("cards-bg.jpg");

        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }

    .card:nth-child(3) .icone {
        margin: 0;

        font-size: 42px;

        text-align: center;
    }

    .card:nth-child(3) h2 {
        margin: 4px 0 8px;

        font-size: 17px;
    }

    .card:nth-child(3) p {
        font-size: 10px;
        line-height: 1.55;
    }


    /* ---------- IDIOMA ---------- */

    .idioma {
        gap: 9px;

        margin-top: 20px;
        padding-bottom: 28px;

        font-size: 9px;

        letter-spacing: 1.5px;
    }

    .idiomas {
        padding: 2px 9px;
    }

    .idiomas button {
        padding: 7px 15px;

        font-size: 11px;
    }
}