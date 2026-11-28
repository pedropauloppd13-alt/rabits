console.log('1 - executar-treino.js carregado!');

console.log('2 - fichaId:', typeof fichaId !== 'undefined' ? fichaId : 'NÃO DEFINIDO');

$(document).ready(function() {

    console.log('3 - Documento pronto!');

    let atividades = [];
    let totalEtapas = 0;
    let etapasConcluidas = 0;
    let cronometro = null;

    // VERIFICAR ELEMENTOS DO HTML
    console.log('4 - Verificando elementos HTML...');

    const elementos = [
        '#lista-exercicios',
        '#nome-ficha',
        '#nome-treino',
        '#contador-atividade',
        '#atividade-progresso',
        '#series-concluidas',
        '#porcentagem',
        '#barra-progresso',
        '#descanso-overlay',
        '#cronometro-descanso',
        '#pular-descanso',
        '#fechar-treino',
        '#finalizar-treino'
    ];

    elementos.forEach(function(seletor) {
        console.log(
            seletor,
            $(seletor).length > 0 ? 'ENCONTRADO' : 'NÃO ENCONTRADO'
        );
    });

    // CARREGAR TREINO
    function carregarTreino() {

        console.log('5 - Iniciando requisição AJAX...');
        console.log('Ficha solicitada:', fichaId);

        $.ajax({
            url: 'backend/executar-treino.php',
            method: 'GET',
            data: {
                ficha_id: fichaId
            },
            dataType: 'json',

            success: function(response) {

                console.log('6 - AJAX concluído!');
                console.log('Resposta completa:', response);

                console.log('Sucesso:', response.sucesso);
                console.log('Ficha:', response.ficha);
                console.log('Atividades:', response.atividades);

                if (!response.sucesso) {
                    console.error('Erro retornado pelo PHP:', response.mensagem);
                    alert(response.mensagem || 'Não foi possível carregar o treino.');
                    return;
                }

                if (!Array.isArray(response.atividades)) {
                    console.error('A propriedade atividades não é um array!');
                    alert('Formato de resposta inválido do servidor.');
                    return;
                }

                atividades = response.atividades;

                console.log('7 - Quantidade de atividades:', atividades.length);
                console.log('Primeira atividade:', atividades[0]);

                $('#nome-ficha').text(response.ficha.nome);
                $('#nome-treino').text('TREINO');

                if (atividades.length === 0) {
                    $('#lista-exercicios').text(
                        'Esta ficha não possui atividades.'
                    );

                    atualizarProgresso();
                    return;
                }

                renderizarAtividades();
                atualizarProgresso();

                console.log(
                    '8 - Cards criados:',
                    $('#lista-exercicios .exercicio').length
                );

                console.log(
                    '9 - Botões criados:',
                    $('#lista-exercicios .serie').length
                );

                console.log(
                    '10 - HTML gerado:',
                    $('#lista-exercicios').html()
                );

                console.log(
                    '11 - Lista visível:',
                    $('#lista-exercicios').is(':visible')
                );

                console.log(
                    '12 - Dimensões da lista:',
                    $('#lista-exercicios').get(0).getBoundingClientRect()
                );

                console.log('13 - Treino carregado com sucesso!');

            },

            error: function(xhr, status, error) {

                console.error('ERRO NO AJAX!');
                console.error('Status:', status);
                console.error('Erro:', error);
                console.error('Código HTTP:', xhr.status);
                console.error('Resposta do servidor:', xhr.responseText);

                let mensagem = 'Erro ao carregar treino.';

                if (xhr.responseJSON && xhr.responseJSON.mensagem) {
                    mensagem = xhr.responseJSON.mensagem;
                }

                alert(mensagem);
            }
        });
    }

    // RENDERIZAR ATIVIDADES
    function renderizarAtividades() {

        console.log('RENDERIZANDO ATIVIDADES...');

        const lista = $('#lista-exercicios');

        lista.empty();

        totalEtapas = 0;
        etapasConcluidas = 0;

        atividades.forEach(function(atividade, indice) {

            console.log('Renderizando atividade:', atividade);

            atividade.concluida = false;

            const porTempo =
                atividade.tempo !== null &&
                atividade.tempo !== undefined &&
                atividade.tempo !== '';

            const quantidade = porTempo ?
                1 :
                Number(atividade.series || 0);

            totalEtapas += quantidade;

            const card = $(`
                <div class="exercicio">
                    <h2 class="exercicio-nome"></h2>
                    <p class="exercicio-info"></p>
                    <div class="series"></div>
                </div>
            `);

            card.find('.exercicio-nome').text(atividade.nome);

            let detalhes = '';

            if (porTempo) {
                detalhes = `Duração: ${atividade.tempo} segundos`;
            } else {
                detalhes = `${atividade.series} séries × ${atividade.repeticoes} repetições`;
            }

            if (atividade.peso !== null && atividade.peso !== '') {
                detalhes += ` | ${atividade.peso} kg`;
            }

            card.find('.exercicio-info').text(detalhes);

            const series = card.find('.series');

            if (porTempo) {

                series.append(`
                    <button type="button"
                        class="serie"
                        data-indice="${indice}">
                        Concluir atividade
                    </button>
                `);

            } else {

                for (let i = 1; i <= quantidade; i++) {

                    series.append(`
                        <button type="button"
                            class="serie"
                            data-indice="${indice}"
                            data-serie="${i}">
                            ${i}
                        </button>
                    `);

                }
            }

            lista.append(card);

        });

        $('#contador-atividade').text(`1/${atividades.length}`);
        $('#atividade-progresso').text(`0/${totalEtapas}`);

        console.log('Renderização finalizada!');
    }

    // ATUALIZAR PROGRESSO
    function atualizarProgresso() {

        const porcentagem = totalEtapas > 0 ?
            Math.round((etapasConcluidas / totalEtapas) * 100) :
            0;

        $('#series-concluidas').text(
            `${etapasConcluidas} de ${totalEtapas} etapas`
        );

        $('#porcentagem').text(`${porcentagem}%`);

        $('#barra-progresso').css('width', `${porcentagem}%`);

        $('#atividade-progresso').text(
            `${etapasConcluidas}/${totalEtapas}`
        );

        const indiceAtual = atividades.findIndex(function(atividade) {
            return !atividade.concluida;
        });

        $('#contador-atividade').text(
            `${indiceAtual === -1
                ? atividades.length
                : indiceAtual + 1}/${atividades.length}`
        );
    }

    // CONCLUIR SÉRIE OU ATIVIDADE
    $('#lista-exercicios').on('click', '.serie', function() {

        const botao = $(this);

        if (botao.prop('disabled')) return;

        botao.prop('disabled', true);
        botao.addClass('concluida');

        const serie = Number(botao.data('serie'));

        if (serie) {
            botao.text('✓');
        } else {
            botao.text('Concluído ✓');
        }

        etapasConcluidas++;

        const indice = Number(botao.data('indice'));
        const atividade = atividades[indice];

        const botoes = $(
            `#lista-exercicios .serie[data-indice="${indice}"]`
        );

        const todasConcluidas =
            botoes.filter(':disabled').length === botoes.length;

        if (todasConcluidas) {
            atividade.concluida = true;
        }

        atualizarProgresso();

        const totalSeries = Number(atividade.series);
        const descanso = Number(atividade.tempoDescansoSegundos);

        if (serie && serie < totalSeries && descanso > 0) {
            iniciarDescanso(descanso);
        }
    });

    // CRONÔMETRO DE DESCANSO
    function iniciarDescanso(segundos) {

        let restante = segundos;

        clearInterval(cronometro);

        $('#descanso-overlay').prop('hidden', false);

        $('#cronometro-descanso').text(
            String(restante).padStart(2, '0')
        );

        cronometro = setInterval(function() {

            restante--;

            $('#cronometro-descanso').text(
                String(restante).padStart(2, '0')
            );

            if (restante <= 0) {
                encerrarDescanso();
            }

        }, 1000);
    }

    // ENCERRAR DESCANSO
    function encerrarDescanso() {

        clearInterval(cronometro);
        cronometro = null;

        $('#descanso-overlay').prop('hidden', true);
    }

    // PULAR DESCANSO
    $('#pular-descanso').click(function() {
        encerrarDescanso();
    });

    // FECHAR TREINO
    $('#fechar-treino').click(function() {

        if (confirm('Deseja sair do treino?')) {
            encerrarDescanso();
            window.history.back();
        }
    });

    // FINALIZAR TREINO
    $('#finalizar-treino').click(function() {

        if (confirm('Deseja finalizar o treino?')) {

            encerrarDescanso();

            alert(
                `Treino finalizado!\n${etapasConcluidas} de ${totalEtapas} etapas concluídas.`
            );

            window.location.href = 'fichas.php';
        }
    });

    // INICIAR
    console.log('14 - Chamando carregarTreino()...');

    if (typeof fichaId === 'undefined') {
        console.error('ERRO: fichaId não foi definido pelo PHP!');
        alert('Erro: ID da ficha não foi recebido.');
        return;
    }

    carregarTreino();

});