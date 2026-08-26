let fichaIdAtual;
let treinoIdAtual;

let fichas;
let fichaAtual;
let treinoAtual;


$(document).ready(function() {
    const parametros =
        new URLSearchParams(
            window.location.search
        );

    fichaIdAtual =
        parametros.get("ficha");

    treinoIdAtual =
        parametros.get("treino");

    fichas =
        JSON.parse(
            localStorage.getItem("fichas")
        ) || [];

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

    if (!treinoAtual.atividades) {
        treinoAtual.atividades = [];
    }

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

    info.text(

        atividade.series +
        " séries × " +
        atividade.repeticoes +
        " reps · " +
        atividade.peso +
        " · " +
        atividade.descanso +
        " descanso"
    );


    const series =
        $("<div>");
    series.addClass(
        "series"
    );

    for (
        let i = 1; i <= atividade.series; i++
    ) {
        const botao =
            $("<button>");

        botao.addClass(
            "serie"
        );

        botao.text(
            i
        );

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
                $(this).toggleClass(
                    "concluida"
                );
                atualizarProgresso();
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
    treinoAtual.atividades
        .forEach(
            function(atividade) {
                totalSeries +=
                    Number(
                        atividade.series
                    );
            }
        );

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
    alert(
        "Treino finalizado!"
    );
    history.back();
}