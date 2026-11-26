let fichas = [];

$(document).ready(function() {

    carregarFichas();

    // CRIAR FICHA
    $('#criar-ficha-card').on('click', function() {

        const nome = prompt('Digite o nome da ficha:');

        if (!nome || nome.trim() === '') {
            return;
        }

        $.ajax({
            url: 'backend/fichas.php',
            method: 'POST',
            dataType: 'json',
            data: {
                acao: 'criar',
                nome: nome.trim()
            },

            success: function(resposta) {

                if (!resposta.sucesso) {
                    alert(resposta.mensagem);
                    return;
                }

                // ID gerado pelo MySQL
                const novaFicha = {
                    id: resposta.id,
                    nome: resposta.nome,
                    atividades: []
                };

                fichas.push(novaFicha);

                exibirFicha(novaFicha);
            },

            error: function() {
                alert('Erro ao criar ficha.');
            }
        });

    });


    // ABRIR/FECHAR MENU
    $('main').on('click', '.editar-ficha', function(event) {

        event.stopPropagation();

        const menu = $(this).siblings('.menu-ficha');

        $('.menu-ficha').not(menu).hide();

        menu.toggle();

    });

    // ABRIR FICHA
    $('main').on('click', '.ficha-card', function(event) {

        // Evitar redirecionamento ao clicar nos botões e no menu
        if ($(event.target).closest('.editar-ficha, .menu-ficha, .card-img-top').length) {
            return;
        }

        const id = $(this).attr('data-id');

        window.location.href = `treinos.php?ficha_id=${id}`;

    });

    // EDITAR FICHA
    $('main').on('click', '.opcao-editar', function() {

        const card = $(this).closest('.ficha-card');
        const id = card.attr('data-id');

        const ficha = fichas.find(f => Number(f.id) === Number(id));

        if (!ficha) return;

        const novoNome = prompt(
            'Digite o novo nome:',
            ficha.nome
        );
        card.find('.nome-ficha').text(ficha.nome);
        card.find('.menu-ficha').hide();

        if (!novoNome || novoNome.trim() === '') {
            return;
        }

        $.ajax({
            url: 'backend/fichas.php',
            method: 'POST',
            dataType: 'json',
            data: {
                acao: 'editar',
                id: id,
                nome: novoNome.trim()
            },

            success: function(resposta) {

                if (!resposta.sucesso) {
                    alert(resposta.mensagem);
                    return;
                }

                ficha.nome = resposta.nome;

                card.find('.nome-ficha').text(ficha.nome);

            },

            error: function() {
                alert('Erro ao editar ficha.');
            }
        });

    });


    // EXCLUIR FICHA
    $('main').on('click', '.opcao-excluir', function() {

        const card = $(this).closest('.ficha-card');
        const id = card.attr('data-id');

        if (!confirm('Deseja excluir esta ficha?')) {
            return;
        }

        $.ajax({
            url: 'backend/fichas.php',
            method: 'POST',
            dataType: 'json',
            data: {
                acao: 'excluir',
                id: id
            },

            success: function(resposta) {

                if (!resposta.sucesso) {
                    alert(resposta.mensagem);
                    return;
                }

                fichas = fichas.filter(f => Number(f.id) !== Number(id));

                card.remove();

            },

            error: function() {
                alert('Erro ao excluir ficha.');
            }
        });

    });

});


// BUSCAR FICHAS NO BANCO
function carregarFichas() {
    $('.ficha-card').not('#modelo-ficha').remove();

    $.ajax({
        url: 'backend/fichas.php',
        method: 'GET',
        dataType: 'json',
        data: {
            acao: 'listar'
        },

        success: function(resposta) {

            if (!resposta.sucesso) {
                alert(resposta.mensagem);
                return;
            }

            fichas = resposta.fichas;

            fichas.forEach(function(ficha) {
                exibirFicha(ficha);
            });

        },

        error: function() {
            alert('Erro ao carregar fichas.');
        }
    });

}


// EXIBIR UMA FICHA
function exibirFicha(ficha) {

    const card = $('#modelo-ficha').clone();

    card.removeAttr('id');

    card.attr('data-id', ficha.id);

    card.find('.nome-ficha').text(ficha.nome);

    card.show();

    card.insertBefore('#criar-ficha-card');

}