const calendario = document.querySelector('.calendar');
const seletorMes = document.querySelector('#month-selector');
const diasCalendario = calendario.querySelector('.date-nav-container');
const anoAtual = new Date().getFullYear();

function dataLocal(data) {
    return data.getFullYear() + '-' +
        String(data.getMonth() + 1).padStart(2, '0') + '-' +
        String(data.getDate()).padStart(2, '0');
}

function obterDados() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const idUsuario = localStorage.getItem('usuarioAtual');
    const usuario = usuarios.find(function(item) {
        return item.id === idUsuario;
    });
    const datas = new Set();

    (usuario && usuario.fichas || []).forEach(function(ficha) {
        (ficha.treinos || []).forEach(function(treino) {
            (treino.execucoes || []).forEach(function(data) {
                datas.add(data);
            });
        });
    });

    return { usuario: usuario, datas: datas };
}

function gerarCalendario(mes, datasConcluidas) {
    const primeiroDia = new Date(anoAtual, mes, 1);
    const diaDaSemana = primeiroDia.getDay();
    const quantidadeDias = new Date(anoAtual, mes + 1, 0).getDate();

    diasCalendario.innerHTML = '';

    for (let i = 0; i < diaDaSemana; i++) {
        diasCalendario.innerHTML += '<div class="day-item-empty"></div>';
    }

    for (let dia = 1; dia <= quantidadeDias; dia++) {
        const data = new Date(anoAtual, mes, dia);
        const hoje = dataLocal(data) === dataLocal(new Date());
        const classes = datasConcluidas.has(dataLocal(data)) ? ' treino-feito' : '';

        diasCalendario.innerHTML += `
            <div class="day-item ${hoje ? 'day-active' : ''}${classes}">
                <div class="day-number">${dia}</div>
            </div>`;
    }
}

function gerarCalendariosDasFichas(usuario) {
    const container = document.querySelector('.fichas-container');
    const modelo = container.querySelector('.meeting-card');
    container.innerHTML = '';

    (usuario && usuario.fichas || []).forEach(function(ficha) {
        const card = modelo.cloneNode(true);
        const datasFicha = new Set();
        const nav = card.querySelector('.date-nav-container');

        card.style.display = '';
        card.querySelector('.ficha-nome').textContent = ficha.nome;

        (ficha.treinos || []).forEach(function(treino) {
            (treino.execucoes || []).forEach(function(data) {
                datasFicha.add(data);
            });
        });

        nav.innerHTML = '';
        for (let i = 6; i >= 0; i--) {
            const data = new Date();
            data.setHours(0, 0, 0, 0);
            data.setDate(data.getDate() - i);
            const hoje = i === 0;
            const classes = datasFicha.has(dataLocal(data)) ? ' treino-feito' : '';

            nav.innerHTML += `
                <div class="day-item ${hoje ? 'day-active' : ''}${classes}">
                    <div class="day-number">${data.getDate()}</div>
                    <div class="day-name">${data.toLocaleDateString('pt-BR', { weekday: 'short' })}</div>
                </div>`;
        }

        container.appendChild(card);
    });
}

const dados = obterDados();
const hoje = new Date();
seletorMes.value = String(hoje.getMonth());
gerarCalendario(hoje.getMonth(), dados.datas);
gerarCalendariosDasFichas(dados.usuario);

seletorMes.addEventListener('change', function() {
    gerarCalendario(Number(this.value), dados.datas);
});