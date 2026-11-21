let fichaIdAtual;

function obterUsuarioAtual() {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioAtual = localStorage.getItem("usuarioAtual");
    return usuarios.find(function(usuario) {
        return usuario.id === usuarioAtual;
    });
}

function salvarUsuario(usuario) {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const indice = usuarios.findIndex(function(item) {
        return item.id === usuario.id;
    });

    if (indice !== -1) {
        usuarios[indice] = usuario;
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }
}

$(document).ready(function() {

    const parametros = new URLSearchParams(window.location.search);
    const idFicha = parametros.get("id");

    fichaIdAtual = idFicha;

    const usuario = obterUsuarioAtual();

    if (!usuario) {
        window.location.href = "index.php";
        return;
    }

    const fichas = usuario.fichas || [];

    const ficha = fichas.find(function(f) {
        return f.id === idFicha;
    });

    if (!ficha) {
        alert("Ficha não encontrada.");
        window.location.href = "fichas.php";
        return;
    }

    if (!ficha.treinos) {
        ficha.treinos = [];

        salvarUsuario(usuario);
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

        salvarUsuario(usuario);

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
        "edicao-treino.php?ficha=" +
        fichaIdAtual +
        "&treino=" +
        treino.id
    );

    novoCard.find(".iniciar").attr(
        "href",
        "treino.php?ficha=" +
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

        const usuario = obterUsuarioAtual();
        const fichas = usuario ? usuario.fichas || [] : [];

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

        salvarUsuario(usuario);

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

        const usuario = obterUsuarioAtual();
        const fichas = usuario ? usuario.fichas || [] : [];

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

        salvarUsuario(usuario);

        treinoCard
            .find(".menu-ficha")
            .hide();
    }
);