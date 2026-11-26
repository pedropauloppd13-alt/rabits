$(document).ready(function() {

    const container = $('#atividades-container');
    const modalEl = document.getElementById('dialog-criar-atividade');
    const modal = new bootstrap.Modal(modalEl);

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

                //REMOVE
                container.find('.atividade-card').remove();

                //ADD
                response.atividades.forEach(function(atividade) {
                    const card = $(`
                        <div class="card atividade-card">
                            <div class="card-body">
                                <h5 class="card-title"></h5>
                                <p class="card-text"></p>
                            </div>
                        </div>
                    `);

                    card.attr('data-id', atividade.id);
                    card.find('.card-title').text(atividade.nome);

                    let config = '';
                    if (atividade.series !== null)
                        config += `Séries: ${atividade.series} `;
                    if (atividade.repeticoes !== null)
                        config += `Repetições: ${atividade.repeticoes} `;
                    if (atividade.tempoDescansoSegundos !== null)
                        config += `Descanso: ${atividade.tempoDescansoSegundos} seg `;
                    if (atividade.peso !== null)
                        config += `Peso: ${atividade.peso} kg`;

                    card.find('.card-text').text(config);

                    $('#criar-atividade-card').before(card);
                });
            },
            error: function() {
                alert('Erro ao carregar atividades.');
            }
        });
    }
    //ABRIR MODAL
    $('#criar-atividade-card').click(function(m) {
        m.preventDefault();

        $('#nome-atividade').val('');
        $('#quantidade-series').val('');
        $('#quantidade-repeticoes').val('');
        $('#descanso-series').val('');
        $('#peso-atividade').val('');

        modal.show();
    });
    //SALVAR ATIVIDADE
    $('#salvar').click(function() {
        const dados = {
            acao: 'criar',
            ficha_id: fichaId,
            nome: $('#nome-atividade').val().trim(),
            series: $('#series').is(':checked') ?
                $('#quantidade-series').val().trim() : null,
            repeticoes: $('#series').is(':checked') ?
                $('#quantidade-repeticoes').val().trim() : null,
            tempoDescansoSegundos: $('#descanso-series').val() || null,
            peso: null
        };
        $.ajax({
            url: 'backend/treinos.php',
            method: 'POST',
            data: dados,
            dataType: 'json',
            success: function(response) {
                if (!response.sucesso) {
                    alert('Erro ao criar atividade: ' + response.mensagem);
                    return;
                }
                modal.hide();

                carregarAtividades();
            },
            error: function() {
                alert('Erro ao criar atividade.');
            }
        });
    });
    carregarAtividades();
});