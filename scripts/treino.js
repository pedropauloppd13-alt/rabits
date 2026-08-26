let fichaIdAtual;
let treinoIdAtual;

let fichas;
let fichaAtual;
let treinoAtual;
let cronometroIntervalo;


$(document).ready(function() {
    const parametros =
        new URLSearchParams(
            window.location.search
        );

    fichaIdAtual =
        parametros.get("ficha");

    treinoIdAtual =
        parametros.get("treino");

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioAtual = usuarios.find(function(usuario) {
        return usuario.id === localStorage.getItem("usuarioAtual");
    });

    if (!usuarioAtual) {
        window.location.href = "index.html";
        return;
    }

    fichas = usuarioAtual.fichas || [];

    fichaAtual =
        fichas.find(function(ficha) {
            return ficha.id === fichaIdAtual;
        });


    if (!fichaAtual) {
        alert("Ficha não encontrada.");
        window.location.href =
            "fichas.html";
        return;
    }


    treinoAtual =
        fichaAtual.treinos.find(
            function(treino) {
                return treino.id === treinoIdAtual;
            }
        );


    if (!treinoAtual) {
        alert("Treino não encontrado.");
        window.location.href =
            "edicao-fichatreino.html?id=" +
            fichaIdAtual;
        return;
    }

    treinoAtual.atividades = treinoAtual.atividades || [];

    $("#nome-treino").text(
        treinoAtual.nome
    );

    $("#nome-ficha").text(
        fichaAtual.nome
    );

    carregarAtividades();

    $("#fechar-treino").click(
        function() {
            history.back();
        }
    );


    $("#finalizar-treino").click(
        function() {
            finalizarTreino();
        }
    );

    $("#pular-descanso").click(function() {
        finalizarDescanso();
    });
});

function carregarAtividades() {
    $("#lista-exercicios").empty();

    treinoAtual.atividades.forEach(
        function(atividade, indice) {
            criarExercicio(
                atividade,
                indice
            );
        }
    );
    atualizarProgresso();
}

function criarExercicio(
    atividade,
    indice
) {
    const card =
        $("<div>");
    card.addClass(
        "exercicio"
    );
    const titulo =
        $("<h2>");
    titulo.addClass(
        "exercicio-nome"
    );
    titulo.text(
        atividade.nome
    );

    const info =
        $("<p>");

    info.addClass(
        "exercicio-info"
    );

    info.text(formatarInformacoes(atividade));


    const series =
        $("<div>");
    series.addClass(
        "series"
    );

    const quantidadeEtapas = atividade.tipo === "tempo" ? 1 : Number(atividade.series) || 0;

    for (let i = 1; i <= quantidadeEtapas; i++) {
        const botao =
            $("<button>");

        botao.addClass(
            "serie"
        );

        botao.text(atividade.tipo === "tempo" ? "Concluir" : i);

        botao.attr(
            "data-exercicio",
            indice
        );

        botao.attr(
            "data-serie",
            i
        );

        botao.click(
            function() {
                const botaoAtual = $(this);

                if (botaoAtual.hasClass("concluida")) {
                    return;
                }

                botaoAtual.addClass("concluida");
                atualizarProgresso();

                if ($(".serie:not(.concluida)").length > 0) {
                    iniciarDescanso(Number(atividade.descanso) || 0);
                } else {
                    clearInterval(cronometroIntervalo);
                    $("#cronometro-descanso").text("00:00");
                }
            }
        );

        series.append(
            botao
        );
    }

    card.append(
        titulo
    );

    card.append(
        info
    );

    card.append(
        series
    );

    $("#lista-exercicios")
        .append(card);
}

function atualizarProgresso() {

    let totalSeries = 0;
    treinoAtual.atividades.forEach(function(atividade) {
        totalSeries += atividade.tipo === "tempo" ? 1 : Number(atividade.series) || 0;
    });

    const concluidas =
        $(".serie.concluida")
        .length;

    let porcentagem = 0;

    if (totalSeries > 0) {

        porcentagem =
            Math.round(
                (
                    concluidas /
                    totalSeries
                ) * 100
            );
    }

    $("#series-concluidas")
        .text(
            concluidas +
            " de " +
            totalSeries +
            " séries"
        );

    $("#porcentagem")
        .text(
            porcentagem + "%"
        );

    $("#grupo-progresso")
        .text(
            concluidas +
            "/" +
            totalSeries
        );

    $("#barra-progresso")
        .css(
            "width",
            porcentagem + "%"
        );
}

function formatarInformacoes(atividade) {
    if (atividade.tipo === "tempo") {
        return "Duração: " + (Number(atividade.duracao) || 0) +
            " segundos · Descanso: " + (Number(atividade.descanso) || 0) + " segundos";
    }

    return (Number(atividade.series) || 0) + " séries × " +
        (Number(atividade.repeticoes) || 0) + " reps · Descanso: " +
        (Number(atividade.descanso) || 0) + " segundos";
}

function iniciarDescanso(segundos) {
    clearInterval(cronometroIntervalo);

    if (segundos <= 0) {
        finalizarDescanso();
        return;
    }

    let restante = segundos;
    $("#descanso-overlay").prop("hidden", false);
    atualizarCronometro(restante);
    cronometroIntervalo = setInterval(function() {
        restante -= 1;
        atualizarCronometro(restante);

        if (restante <= 0) {
            finalizarDescanso();
        }
    }, 1000);
}

function atualizarCronometro(segundos) {
    $("#cronometro-descanso").text(Math.max(0, segundos));
}

function finalizarDescanso() {
    clearInterval(cronometroIntervalo);
    cronometroIntervalo = null;
    $("#descanso-overlay").prop("hidden", true);
    $("#cronometro-descanso").text("00");
}

function finalizarTreino() {

    const total =
        $(".serie").length;
    const concluidas =
        $(".serie.concluida").length;
    if (
        total > 0 &&
        concluidas < total
    ) {
        const confirmar =
            confirm(
                "Você ainda não completou todas as séries. Deseja finalizar mesmo assim?"
            );
        if (!confirmar) {
            return;
        }
    }

    treinoAtual.execucoes = treinoAtual.execucoes || [];
    const hoje = new Date();
    const dataExecucao = hoje.getFullYear() + "-" +
        String(hoje.getMonth() + 1).padStart(2, "0") + "-" +
        String(hoje.getDate()).padStart(2, "0");

    if (!treinoAtual.execucoes.includes(dataExecucao)) {
        treinoAtual.execucoes.push(dataExecucao);
        const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        const usuarioIndex = usuarios.findIndex(function(usuario) {
            return usuario.id === localStorage.getItem("usuarioAtual");
        });

        if (usuarioIndex !== -1) {
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
        }
    }

    alert(
        "Treino finalizado!"
    );
    history.back();
}