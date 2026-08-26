const atividade = {
    nome: '',
    descricao: '',
    id: 0,
    imagem: '',
    tipo: '',
    series: 0,
    repeticoes: 0,
    duracao: 0,
    descanso: 0,

    armazenarImagem(imagem) {

    }

}

if (!localStorage.getItem('atividadeID')) {
    localStorage.setItem('atividadeID', 0);
}

let atvArray = JSON.parse(localStorage.getItem('atividades')) || [];

let atvID = parseInt(localStorage.getItem('atividadeID'));

$('#criar-atividade-card').on('click', function(e) {
    e.preventDefault();
    const modal = bootstrap.Modal.getOrCreateInstance(
        document.getElementById('dialog-criar-atividade')
    );
    modal.show();
});

const configAtividade = $('.config-atividade');
let imagemAtividade = '';

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
    let atv = Object.create(atividade);
    atv.nome = $('#nome-atividade').val();
    atv.descricao = $('#descricao').val();
    atv.imagem = imagemAtividade;
    atv.tipo = $("input[name='tipo']:checked").val();
    atv.id = atvID++;
    localStorage.setItem('atividadeID', atvID);
    if (atv.tipo === 'series') {
        atv.series = parseInt($('#quantidade-series').val());
        atv.repeticoes = parseInt($('#quantidade-repeticoes').val());
        atv.descanso = parseInt($('#descanso-series').val());
    } else if (atv.tipo === 'tempo') {
        atv.duracao = parseInt($('#duracao').val());
        atv.descanso = parseInt($('#descanso-tempo').val());
    }

    console.log(atv);
    atvArray.push(atv);
    localStorage.setItem('atividades', JSON.stringify(atvArray));
    renderizarAtividades();
});

function renderizarAtividades() {
    atvArray = JSON.parse(localStorage.getItem('atividades')) || [];
    const container = $('.atividades-container');
    container.find('.atividade').remove();
    atvArray.forEach(atv => {
        const card = $(`
            <div class="card atividade" style="width: 18rem;">
            <img src="${atv.imagem || 'images/icones/activity.svg'}" class="card-img-top" alt="Imagem da atividade">
            <div class="card-body">
                <h5 class="card-title">${atv.nome}</h5>
                <p class="card-text">${atv.descricao}</p>
            </div>
            </div>
        `);
        container.prepend(card);
    });
}

$(document).ready(function() {
    renderizarAtividades();
});