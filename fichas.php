<?php
include 'backend/login-check.php';
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fichas de Treino</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="styles/minhas-cores-claro.css">
    <link rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="styles/fichas.css">
</head>

<body class="d-flex flex-column">
        <?php include 'nav.php'?>

    <!-- Main -->
    <main class="container">
        <!-- Caixas de Conteúdo -->
        <!--CRIAR FICHA (Always last in order)-->
        <div class="card order-last" id="criar-ficha-card">
            <div class="card-img-overlay">
                <h5 class="card-title text-white">Criar Ficha</h5>
            </div>
            <img src="images/icones/plus-lg.svg" class="card-img-top" alt="+">
        </div>

        <!--MODELO DE FICHA-->
        <div class="card ficha-card" style="display: none;">
            <h5 class="card-title text-white">NOME</h5>

            <img src="images/icones/plus-lg.svg" class="card-img-top" alt="...">

            <button class="btn btn-primary editar-ficha">
                <img src="images/icones/gear-fill.svg" alt="Edit">
            </button>

            <div class="menu-ficha">
                <button class="opcao-editar">Editar</button>
                <button class="opcao-excluir">Excluir</button>
            </div>
        </div>
    </main>

    <script src="scripts/jquery-4.0.0.min.js"></script>
    <script src="scripts/fichas.js"></script>
</body>

</html>