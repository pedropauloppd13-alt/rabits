<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edição de Treino</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="styles/minhas-cores-claro.css">
    <link rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="styles/edicao-treino.css">
    <script src="scripts/jquery-4.0.0.min.js"></script>
</head>

<body class="d-flex flex-column">
        <?php include 'nav.php'?>

    <!-- Main -->
    <main>
        <div class="modal" id="dialog-criar-atividade" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Insira os detalhes da atividade</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="form-floating mb-3">
                            <input type="text" id="nome-atividade" class="form-control" placeholder="Minha atividade">
                            <label for="nome-atividade">Nome da atividade</label>
                        </div>
                        <label for="descricao">Descrição</label>
                        <textarea class="form-control" id="descricao" rows="3"></textarea>
                        <div class="input-group mb-3">
                            <input type="file" accept="image/png, image/gif, image/jpeg" class="form-control mt-2" id="imagem-atividade" aria-describedby="inputGroupFileAddon03" aria-label="Upload">
                        </div>
                        <div class="container">
                            <div class="row col-2">
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="tipo" id="series" value="series">
                                    <label class="form-check-label" for="series">Séries</label>
                                </div>

                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="tipo" id="tempo" value="tempo">
                                    <label class="form-check-label" for="tempo">Tempo</label>
                                </div>

                            </div>
                            <div class="row col-10">
                                <div class="config-atividade">
                                    <div class="form-floating mb-3">
                                        <input type="number" class="form-control" id="quantidade-series" name="series" min="1" placeholder="3">
                                        <label for="quantidade-series">Quantidade de séries</label>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <input type="number" class="form-control" id="quantidade-repeticoes" name="repeticoes" min="1" placeholder="10">
                                        <label for="quantidade-repeticoes">Repetições por série</label>
                                    </div>
                                    <div class="form-floating mb-3">
                                        <input type="number" class="form-control" id="descanso-series" name="descanso" min="0" placeholder="60">
                                        <label for="descanso-series">Descanso (segundos)</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" id="salvar">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="container atividades-container">
            <!-- Cards -->




            <!-- Add more cards as needed -->
            <a class="card order-last" id="criar-atividade-card">
                <div class="card-img-overlay">
                    <h5 class="card-title">Adicionar Atividade</h5>
                </div>
                <img src="images/icones/plus-lg2.svg" class="card-img-top" alt="+">
            </a>
        </div>
    </main>


</body>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
<script src="scripts/edicao-treino.js"></script>

</html>