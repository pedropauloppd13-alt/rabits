// Carrega as fichas quando a página abre
$(document).ready(function() {

    let fichas = JSON.parse(localStorage.getItem("fichas")) || [];

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

    let fichas = JSON.parse(localStorage.getItem("fichas")) || [];

    const novaFicha = {
        id: crypto.randomUUID(),
        nome: nome.trim()
    };

    fichas.push(novaFicha);

    localStorage.setItem("fichas", JSON.stringify(fichas));

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

    let fichas = JSON.parse(localStorage.getItem("fichas")) || [];

    fichas = fichas.filter(function(f) {
        return f.id !== id;
    });

    localStorage.setItem("fichas", JSON.stringify(fichas));

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

    let fichas = JSON.parse(localStorage.getItem("fichas")) || [];

    const fichaEncontrada = fichas.find(function(f) {
        return f.id === id;
    });

    if (fichaEncontrada) {
        fichaEncontrada.nome = novoNome.trim();
    }

    localStorage.setItem("fichas", JSON.stringify(fichas));

    ficha.find(".menu-ficha").hide();
});

//Entrar no JS
$(document).on("click", ".ficha-card .card-img-top", function() {

    const ficha = $(this).closest(".ficha-card");

    const id = ficha.attr("data-id");

    window.location.href = "edicao-fichatreino.html?id=" + id;

});