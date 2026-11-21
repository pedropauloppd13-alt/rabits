<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edição de Ficha de Treino</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="styles/minhas-cores-claro.css">
    <link rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="styles/edicao-fichatreino.css">
</head>

<body class="d-flex flex-column">
    <?php include 'nav.php'?>
    <!-- Main -->
    <main>
        <div class="container" id="ficha-container">
            <!-- Cards -->
            <div class="card treino-card" style="display: none;">
                <div class="card-body">
                    <h5 class="card-title">Treino 1</h5>
                    <div class="card_btns">
                        <a href="#" class="btn btn-primary abrir">Editar</a>
                        <a href="#" class="btn btn-success iniciar">Iniciar</a>
                        <button href="#" class="btn btn-primary editar-ficha">
                            <img src="images/icones/gear-fill.svg" alt="Edit">
                        </button>
                        <div class="menu-ficha">
                            <button class="opcao-editar">Renomear</button>
                            <button class="opcao-excluir">Excluir</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Add more cards as needed -->
            <div class="card order-last" id="criar-treino-card">
                <div class="card-img-overlay">
                    <h5 class="card-title">Criar Treino</h5>
                </div>
                <img src="images/icones/plus-lg2.svg" class="card-img-top" alt="+">
            </div>
    </main>

    <script src="scripts/jquery-4.0.0.min.js"></script>
    <script src="scripts/edicao-fichatreino.js"></script>
</body>

</html>