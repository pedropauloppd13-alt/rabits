$(document).ready(function() {

    const container = $('.atividades-container');
    const modalEl = document.getElementById('dialog-criar-atividade');
    const modal = new bootstrap.Modal(modalEl);

    let atividadeEditando = null;

    //ALTERNAR CONFIGs
    $('input[name="tipo"]').change(function() {
        $('.config-serie, .config-tempo').hide();

        if ($(this).val() === 'series') {
            $('.config-serie').show();
        } else if ($(this).val() === 'tempo') {
            $('.config-tempo').show();
        }
    });

    //LIMPAR
    function limparFormulario() {
        $('#nome-atividade').val('');
        $('#descricao').val('');
        $('#quantidade-series').val('');
        $('#quantidade-repeticoes').val('');
        $('#descanso-series').val('');
        $('#tempo-atividade').val('');
        $('#peso').val('');

        $('input[name="tipo"]').prop('checked', false);

        $('#config-series, #config-tempo').hide();

        atividadeEditando = null;
        $('#salvar').text('Salvar atividade');
    }

    //LISTAR ATIV
    function carregarAtividades() {
        $.ajax({
            url: 'backend/treinos.php',
            method: 'GET',
            data: {
                acao: 'listar',
                ficha_id: fichaId
            },
            dataType: 'json',

            success: function(response) {
                if (!response.sucesso) {
                    alert('Erro ao carregar atividades: ' + response.mensagem);
                    return;
                }

                container.find('.atividade-card').remove();

                response.atividades.forEach(function(atividade) {

                    const card = $(`
                        <div class="card atividade-card">
                            <div class="card-body">
                                <h5 class="card-title"></h5>
                                <p class="card-text"></p>
                                <p class="atividade-descricao"></p>

                                <div class="d-flex gap-2 mt-3">
                                    <button type="button" class="btn btn-primary btn-sm editar-atividade">
                                        Editar
                                    </button>

                                    <button type="button" class="btn btn-danger btn-sm excluir-atividade">
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    `);

                    card.attr('data-id', atividade.id);
                    card.find('.card-title').text(atividade.nome);

                    let config = '';

                    if (atividade.series !== null) {
                        config += `Séries: ${atividade.series} `;
                    }

                    if (atividade.repeticoes !== null) {
                        config += `Repetições: ${atividade.repeticoes} `;
                    }

                    if (atividade.tempoDescansoSegundos !== null) {
                        config += `Descanso: ${atividade.tempoDescansoSegundos} seg `;
                    }

                    if (atividade.tempo !== null) {
                        config += `Duração: ${atividade.tempo} seg `;
                    }

                    if (atividade.peso !== null) {
                        config += `Peso: ${atividade.peso} kg`;
                    }

                    card.find('.card-text').text(config);
                    card.find('.atividade-descricao').text(atividade.descricao || '');

                    card.data('atividade', atividade);
                    $('#criar-atividade-card').before(card);
                });
            },

            error: function() {
                alert('Erro ao carregar atividades.');
            }
        });
    }

    //ABRIR MODAL
    $('#criar-atividade-card').click(function(e) {
        e.preventDefault();
        limparFormulario();
        modal.show();
    });

    //EDITAR ATIVIDADE
    container.on('click', '.editar-atividade', function() {

        const card = $(this).closest('.atividade-card');
        const atividade = card.data('atividade');

        limparFormulario();
        atividadeEditando = atividade.id;

        $('#nome-atividade').val(atividade.nome);
        $('#descricao').val(atividade.descricao || '');
        $('#peso-atividade').val(atividade.peso ? atividade.peso : '');

        if (atividade.tempo !== null && atividade.tempo !== '') {
            $('#tempo').prop('checked', true).trigger('change');
            $('#tempo-atividade').val(atividade.tempo);
        } else {
            $('#series').prop('checked', true).trigger('change');
            $('#quantidade-series').val(atividade.series ? atividade.series : '');
            $('#quantidade-repeticoes').val(atividade.repeticoes ? atividade.repeticoes : '');
            $('#descanso-series').val(atividade.tempoDescansoSegundos ? atividade.tempoDescansoSegundos : '');
        }

        $('#salvar').text('Atualizar atividade');
        modal.show();
    });

    //EXCLUIR ATIVIDADE
    container.on('click', '.excluir-atividade', function() {

        const card = $(this).closest('.atividade-card');
        const atividade = card.data('atividade');

        if (!confirm(`Deseja excluir a atividade "${atividade.nome}"?`)) {
            return;
        }

        $.ajax({
            url: 'backend/treinos.php',
            method: 'POST',
            data: {
                acao: 'excluir',
                id: atividade.id,
                ficha_id: fichaId
            },
            dataType: 'json',

            success: function(response) {
                if (!response.sucesso) {
                    alert('Erro ao excluir atividade: ' + response.mensagem);
                    return;
                }
                carregarAtividades();
            },
            error: function() {
                alert('Erro ao excluir atividade.');
            }
        });
    });


    //SALVAR ATIVIDADE
    $('#salvar').click(function() {
        const tipo = $('input[name="tipo"]:checked').val();

        const dados = {
            acao: atividadeEditando ? 'editar' : 'criar',
            id: atividadeEditando,
            ficha_id: fichaId,
            tipo: tipo,

            nome: $('#nome-atividade').val().trim(),
            descricao: $('#descricao').val().trim(),

            series: tipo === 'series' ?
                $('#quantidade-series').val() : null,
            repeticoes: tipo === 'series' ?
                $('#quantidade-repeticoes').val() : null,
            tempoDescansoSegundos: tipo === 'series' ?
                $('#descanso-series').val() : null,
            tempo: tipo === 'tempo' ?
                $('#tempo-atividade').val() : null,
            peso: $('#peso').val() || null
        };

        if (!dados.nome) {
            alert('Informe o nome da atividade.');
            return;
        }

        if (!tipo) {
            alert('Selecione Séries ou Tempo.');
            return;
        }

        $.ajax({
            url: 'backend/treinos.php',
            method: 'POST',
            data: dados,
            dataType: 'json',

            success: function(response) {
                if (!response.sucesso) {
                    alert('Erro: ' + response.mensagem);
                    return;
                }
                modal.hide();
                limparFormulario();
                carregarAtividades();
            },

            error: function(xhr) {
                const resposta = xhr.responseJSON;

                alert(
                    resposta && resposta.mensagem ?
                    resposta.mensagem :
                    'Erro ao salvar atividade.'
                );
            }
        });
    });

    carregarAtividades();
});