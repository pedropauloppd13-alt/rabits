let fichaIdAtual;

$(document).ready(function() {

    const parametros = new URLSearchParams(window.location.search);
    const idFicha = parametros.get("id");

    fichaIdAtual = idFicha;

    let fichas = JSON.parse(localStorage.getItem("fichas")) || [];

    const ficha = fichas.find(function(f) {
        return f.id === idFicha;
    });

    if (!ficha) {
        alert("Ficha não encontrada.");
        window.location.href = "fichas.html";
        return;
    }

    if (!ficha.treinos) {
        ficha.treinos = [];

        localStorage.setItem(
            "fichas",
            JSON.stringify(fichas)
        );
    }

    ficha.treinos.forEach(function(treino) {
        criarTreino(treino);
    });

    $("#criar-treino-card").click(function() {

        const nome = prompt("Digite o nome do treino:");

        if (nome === null || nome.trim() === "") {
            return;
        }

        const novoTreino = {
            id: crypto.randomUUID(),
            nome: nome.trim(),
            descricao: "",
            atividades: []
        };

        ficha.treinos.push(novoTreino);

        localStorage.setItem(
            "fichas",
            JSON.stringify(fichas)
        );

        criarTreino(novoTreino);
    });
});


function criarTreino(treino) {

    const novoCard = $(".treino-card")
        .first()
        .clone();

    novoCard.show();

    novoCard.attr(
        "data-id",
        treino.id
    );

    novoCard
        .find(".card-title")
        .text(treino.nome);

    novoCard
        .find(".card-text")
        .text(
            treino.descricao || "Sem descrição"
        );

    novoCard.find(".abrir").attr(
        "href",
        "edicao-treino.html?ficha=" +
        fichaIdAtual +
        "&treino=" +
        treino.id
    );

    $("#criar-treino-card")
        .before(novoCard);
}


$(document).on(
    "click",
    ".editar-ficha",
    function() {

        const menu = $(this)
            .siblings(".menu-ficha");

        $(".menu-ficha")
            .not(menu)
            .hide();

        menu.toggle();
    }
);


$(document).on(
    "click",
    ".opcao-excluir",
    function() {

        const treinoCard = $(this)
            .closest(".treino-card");

        const treinoId = treinoCard
            .attr("data-id");

        let fichas = JSON.parse(
            localStorage.getItem("fichas")
        ) || [];

        const ficha = fichas.find(function(f) {
            return f.id === fichaIdAtual;
        });

        if (!ficha) {
            return;
        }

        ficha.treinos = ficha.treinos.filter(
            function(treino) {
                return treino.id !== treinoId;
            }
        );

        localStorage.setItem(
            "fichas",
            JSON.stringify(fichas)
        );

        treinoCard.remove();
    }
);


$(document).on(
    "click",
    ".opcao-editar",
    function() {

        const treinoCard = $(this)
            .closest(".treino-card");

        const treinoId = treinoCard
            .attr("data-id");

        const nomeAtual = treinoCard
            .find(".card-title")
            .text();

        const novoNome = prompt(
            "Digite o novo nome do treino:",
            nomeAtual
        );

        if (
            novoNome === null ||
            novoNome.trim() === ""
        ) {
            return;
        }

        treinoCard
            .find(".card-title")
            .text(novoNome.trim());

        let fichas = JSON.parse(
            localStorage.getItem("fichas")
        ) || [];

        const ficha = fichas.find(function(f) {
            return f.id === fichaIdAtual;
        });

        if (!ficha) {
            return;
        }

        const treino = ficha.treinos.find(
            function(t) {
                return t.id === treinoId;
            }
        );

        if (treino) {
            treino.nome = novoNome.trim();
        }

        localStorage.setItem(
            "fichas",
            JSON.stringify(fichas)
        );

        treinoCard
            .find(".menu-ficha")
            .hide();
    }
);