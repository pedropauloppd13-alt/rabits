const calendar = document.querySelector('.calendar');
const monthSelector = document.querySelector('#month-selector');
const dateNav = calendar.querySelector('.date-nav-container');

const ano = 2026;

function gerarCalendario(mes) {

    // Primeiro dia do mês
    const primeiroDia = new Date(ano, mes, 1);

    // Dia da semana:
    // 0 = Domingo
    // 1 = Segunda
    // 2 = Terça
    // 3 = Quarta
    // 4 = Quinta
    // 5 = Sexta
    // 6 = Sábado
    const diaDaSemana = primeiroDia.getDay();

    // Quantidade de dias do mês
    const quantidadeDias = new Date(ano, mes + 1, 0).getDate();

    // Limpa o calendário
    dateNav.innerHTML = '';

    // Espaços antes do dia 1
    for (let i = 0; i < diaDaSemana; i++) {
        dateNav.innerHTML += `
            <div class="day-item-empty"></div>
        `;
    }

    // Cria os dias
    for (let i = 1; i <= quantidadeDias; i++) {

        const hoje = new Date();

        const eHoje = i === hoje.getDate() &&
            mes === hoje.getMonth() &&
            ano === hoje.getFullYear();

        dateNav.innerHTML += `
            <div class="day-item ${eHoje?'day-active':''}">
                <div class="day-number">${i}</div>
            </div>
        `;
    }
}

function gerarUltimosSete() {
    const fichas = document.querySelectorAll('.ficha-dias');

    const hoje = new Date();

    fichas.forEach(ficha => {
        const dateNavFicha = ficha.querySelector('.date-nav-container');

        // Limpa os dias anteriores
        dateNavFicha.innerHTML = '';

        // Cria os últimos 7 dias, incluindo hoje
        for (let i = 6; i >= 0; i--) {

            const data = new Date(hoje);

            data.setDate(hoje.getDate() - i);

            const numero = data.getDate();

            const diaDaSemana = data.toLocaleDateString('pt-BR', {
                weekday: 'short'
            });

            const eHoje = i === 0;

            dateNavFicha.innerHTML += `
                <div class="day-item ${eHoje ? 'day-active' : ''}">
                    <div class="day-number">${numero}</div>
                    <div class="day-name">${diaDaSemana}</div>
                </div>
            `;
        }
    });
}
// Gera o calendário inicialmente
gerarCalendario(Number(monthSelector.value));

// Gera os últimos sete dias para as ofensivas individuais
gerarUltimosSete();

// Quando o usuário trocar o mês
monthSelector.addEventListener('change', function() {
    gerarCalendario(Number(this.value));
});