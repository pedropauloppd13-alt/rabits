const treino = {
    nome: "TREINO A",
    grupo: "Grupo 1",

    exercicios: [{
            nome: "Supino Reto",
            series: 3,
            repeticoes: 12,
            peso: "77kg",
            descanso: "60s"
        },
        {
            nome: "Agachamento Livre",
            series: 4,
            repeticoes: 10,
            peso: "55kg",
            descanso: "90s"
        },
        {
            nome: "Leg Press",
            series: 4,
            repeticoes: 12,
            peso: "23kg",
            descanso: "90s"
        }
    ]
};


$(document).ready(function() {
    carregarTreino();
    $("#fechar-treino").click(function() {
        history.back();
    });

    $("#finalizar-treino").click(function() {
        finalizarTreino();
    });
});


function carregarTreino() {
    $("#nome-treino").text(
        treino.nome
    );
    $("#grupo-treino").text(
        treino.grupo
    );
    $("#lista-exercicios").empty();

    treino.exercicios.forEach(function(exercicio, indice) {
        criarExercicio(
            exercicio,
            indice
        );
    });

    atualizarProgresso();
}


function criarExercicio(exercicio, indice) {
    const card = $("<div>");
    card.addClass("exercicio");
    const titulo = $("<h2>");
    titulo.addClass("exercicio-nome");
    titulo.text(
        exercicio.nome
    );
    const info = $("<p>");
    info.addClass("exercicio-info");
    info.text(
        exercicio.series +
        " séries × " +
        exercicio.repeticoes +
        " reps · " +
        exercicio.peso +
        " · " +
        exercicio.descanso +
        " descanso"
    );

    const series = $("<div>");
    series.addClass("series");

    for (
        let i = 1; i <= exercicio.series; i++
    ) {
        const botao = $("<button>");
        botao.addClass("serie");
        botao.text(i);
        botao.attr(
            "data-exercicio",
            indice
        );
        botao.attr(
            "data-serie",
            i
        );

        botao.click(function() {
            $(this).toggleClass(
                "concluida"
            );
            atualizarProgresso();
        });

        series.append(botao);
    }


    card.append(titulo);
    card.append(info);
    card.append(series);

    $("#lista-exercicios").append(card);
}


function atualizarProgresso() {
    let totalSeries = 0;
    let seriesConcluidas = 0;

    treino.exercicios.forEach(function(exercicio) {

        totalSeries += exercicio.series;

    });

    seriesConcluidas = $(".serie.concluida").length;
    let porcentagem = 0;

    if (totalSeries > 0) {
        porcentagem =
            Math.round(
                (seriesConcluidas / totalSeries) * 100
            );
    }


    $("#series-concluidas").text(
        seriesConcluidas +
        " de " +
        totalSeries +
        " séries"
    );


    $("#porcentagem").text(
        porcentagem + "%"
    );


    $("#barra-progresso").css(
        "width",
        porcentagem + "%"
    );


    $("#grupo-progresso").text(
        seriesConcluidas +
        "/" +
        totalSeries
    );

}


function finalizarTreino() {
    const totalSeries = $(".serie").length;
    const seriesConcluidas =
        $(".serie.concluida").length;

    if (seriesConcluidas < totalSeries) {
        const confirmar = confirm(
            "Você ainda não completou todas as séries. Deseja finalizar mesmo assim?"
        );
        if (!confirmar) {
            return;
        }
    }

    alert("Treino finalizado!");
    history.back();
}