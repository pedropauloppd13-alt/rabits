let usuarioAtual;
let fichaAtual;
let treinoAtual;
let imagemAtividade = '';

function obterUsuarioAtual() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const idUsuario = localStorage.getItem('usuarioAtual');
    return usuarios.find(function(usuario) {
        return usuario.id === idUsuario;
    });
}

function salvarUsuario(usuario) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const indice = usuarios.findIndex(function(item) {
        return item.id === usuario.id;
    });

    if (indice !== -1) {
        usuarios[indice] = usuario;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
}

function carregarContexto() {
    const parametros = new URLSearchParams(window.location.search);
    const fichaId = parametros.get('ficha');
    const treinoId = parametros.get('treino');
    usuarioAtual = obterUsuarioAtual();
    fichaAtual = usuarioAtual && (usuarioAtual.fichas || []).find(function(ficha) {
        return ficha.id === fichaId;
    });
    treinoAtual = fichaAtual && (fichaAtual.treinos || []).find(function(treino) {
        return treino.id === treinoId;
    });

    if (!usuarioAtual) {
        window.location.href = 'index.html';
        return false;
    }
    if (!fichaAtual) {
        alert('Ficha não encontrada.');
        window.location.href = 'fichas.html';
        return false;
    }
    if (!treinoAtual) {
        alert('Treino não encontrado.');
        window.location.href = 'edicao-fichatreino.html?id=' + fichaId;
        return false;
    }
    treinoAtual.atividades = treinoAtual.atividades || [];
    return true;
}

$('#criar-atividade-card').on('click', function(e) {
    e.preventDefault();
    const modal = bootstrap.Modal.getOrCreateInstance(
        document.getElementById('dialog-criar-atividade')
    );
    modal.show();
});

const configAtividade = $('.config-atividade');

$('#imagem-atividade').on('change', function() {
    const arquivo = this.files[0];

    if (!arquivo) {
        imagemAtividade = '';
        return;
    }

    const leitor = new FileReader();
    leitor.onload = function(evento) {
        imagemAtividade = evento.target.result;
    };
    leitor.readAsDataURL(arquivo);
});

function renderizarConfigAtividade(tipo) {
    if (tipo === 'series') {
        configAtividade.html(`
            <div class="form-floating mb-3">
                <input type="number" class="form-control" id="quantidade-series"
                    name="series" min="1" placeholder="3">
                <label for="quantidade-series">Quantidade de séries</label>
            </div>
            <div class="form-floating mb-3">
                <input type="number" class="form-control" id="quantidade-repeticoes"
                    name="repeticoes" min="1" placeholder="10">
                <label for="quantidade-repeticoes">Repetições por série</label>
            </div>
            <div class="form-floating mb-3">
                <input type="number" class="form-control" id="descanso-series"
                    name="descanso" min="0" placeholder="60">
                <label for="descanso-series">Descanso (segundos)</label>
            </div>
        `);
        return;
    }

    if (tipo === 'tempo') {
        configAtividade.html(`
            <div class="form-floating mb-3">
                <input type="number" class="form-control" id="duracao"
                    name="duracao" min="1" placeholder="30">
                <label for="duracao">Duração (segundos)</label>
            </div>
            <div class="form-floating mb-3">
                <input type="number" class="form-control" id="descanso-tempo"
                    name="descanso" min="0" placeholder="60">
                <label for="descanso-tempo">Descanso (segundos)</label>
            </div>
        `);
        return;
    }

    configAtividade.empty();
}

$("input[name='tipo']").on('change', function() {
    renderizarConfigAtividade(this.value);
});

$('#salvar').on('click', function(e) {
    e.preventDefault();
    const tipo = $("input[name='tipo']:checked").val();
    const atv = {
        id: crypto.randomUUID(),
        nome: $('#nome-atividade').val().trim(),
        descricao: $('#descricao').val().trim(),
        imagem: imagemAtividade,
        tipo: tipo,
        series: tipo === 'series' ? Number($('#quantidade-series').val()) : 0,
        repeticoes: tipo === 'series' ? Number($('#quantidade-repeticoes').val()) : 0,
        duracao: tipo === 'tempo' ? Number($('#duracao').val()) : 0,
        descanso: Number($('[name="descanso"]:visible').val()) || 0
    };

    if (!atv.nome || !tipo) {
        alert('Informe o nome e o tipo da atividade.');
        return;
    }

    treinoAtual.atividades.push(atv);
    salvarUsuario(usuarioAtual);
    renderizarAtividades();
});

function renderizarAtividades() {
    const container = $('.atividades-container');
    container.find('.atividade').remove();
    treinoAtual.atividades.forEach(atv => {
        const card = $(`
            <div class="card atividade" style="width: 18rem;">
            <img class="card-img-top" alt="Imagem da atividade">
            <div class="card-body">
            <h5 class="card-title"></h5>
            <p class="card-text"></p>
            </div>
            </div>
        `);
        card.find('img').attr('src', atv.imagem || 'images/icones/activity.svg');
        card.find('.card-title').text(atv.nome);
        card.find('.card-text').text(atv.descricao);
        container.prepend(card);
    });
}

$(document).ready(function() {
    if (carregarContexto()) {
        renderizarAtividades();
    }
});