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
    const usuario = obterUsuarioAtual();

    if (!usuario) {
        window.location.href = "index.php";
        return;
    }

    const fichas = usuario.fichas || [];

    fichas.forEach(function(ficha) {
        criarFicha(ficha);
    });

});


// Criar nova ficha
$("#criar-ficha-card").click(function() {

    const nome = prompt("Digite o nome da ficha:");

    if (nome === null || nome.trim() === "") {
        return;
    }

    const usuario = obterUsuarioAtual();

    if (!usuario) {
        window.location.href = "index.php";
        return;
    }

    const fichas = usuario.fichas || (usuario.fichas = []);

    const novaFicha = {
        id: crypto.randomUUID(),
        nome: nome.trim()
    };

    fichas.push(novaFicha);

    salvarUsuario(usuario);

    criarFicha(novaFicha);
});


// Função para criar a ficha
function criarFicha(ficha) {

    const novaFicha = $(".ficha-card").first().clone();

    novaFicha.show();

    novaFicha.attr("data-id", ficha.id);

    novaFicha.find(".card-title").text(ficha.nome);

    $("#criar-ficha-card").before(novaFicha);
}


// Abrir menu da ficha
$(document).on("click", ".editar-ficha", function() {

    const menu = $(this).siblings(".menu-ficha");

    $(".menu-ficha").not(menu).hide();

    menu.toggle();

});


// Excluir ficha
$(document).on("click", ".opcao-excluir", function() {

    const ficha = $(this).closest(".ficha-card");
    const id = ficha.attr("data-id");

    const usuario = obterUsuarioAtual();

    if (!usuario) {
        return;
    }

    let fichas = usuario.fichas || [];

    fichas = fichas.filter(function(f) {
        return f.id !== id;
    });

    usuario.fichas = fichas;
    salvarUsuario(usuario);

    ficha.remove();
});


// Editar ficha
$(document).on("click", ".opcao-editar", function() {

    const ficha = $(this).closest(".ficha-card");

    const id = ficha.attr("data-id");
    const nomeAtual = ficha.find(".card-title").text();

    const novoNome = prompt(
        "Digite o novo nome da ficha:",
        nomeAtual
    );

    if (novoNome === null || novoNome.trim() === "") {
        return;
    }

    ficha.find(".card-title").text(novoNome.trim());

    const usuario = obterUsuarioAtual();

    if (!usuario) {
        return;
    }

    const fichas = usuario.fichas || [];

    const fichaEncontrada = fichas.find(function(f) {
        return f.id === id;
    });

    if (fichaEncontrada) {
        fichaEncontrada.nome = novoNome.trim();
    }

    salvarUsuario(usuario);

    ficha.find(".menu-ficha").hide();
});

//Entrar no JS
$(document).on("click", ".ficha-card .card-img-top", function() {

    const ficha = $(this).closest(".ficha-card");

    const id = ficha.attr("data-id");

    window.location.href = "edicao-fichatreino.php?id=" + id;

});