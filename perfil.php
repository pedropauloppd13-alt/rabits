<?php
include 'backend/login-check.php';
?> 
<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rabits</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="styles/minhas-cores-claro.css">
    <link rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="styles/style-perfil.css">
    <script src="scripts/jquery-4.0.0.min.js"></script>

</head>

<body class="d-flex flex-column">
    <!--Navbar-->
    <?php include 'nav.php'?>
    <?php include 'backend/config/database.php';?>
    <!--Main-->
    <main>
        <div id="loggout">
            <a href="backend/logout.php" class="btn btn-primary">Sair</a>
        </div>
        <div class="container d-flex justify-content-center align-items-center text-center flex-wrap">
            <div class="row">
                <div>
                    <img src="images/Profile_avatar_placeholder_large.png" id="ft-perfil">
                </div>
            </div>
            <div class="row">
                <div>
                    <div class="dados m-4">
                        <div class="texto">
                            <h6 class="tag-text info" id="tag-nome">Nome:</h6><br>
                            <input class="edit-perfil info info-text" id="nome-perfil" data-campo="nome" value="<?php echo $_SESSION['usuario_nome']; ?>" disabled>
                        </div>
                        <div class="texto">
                            <h6 class="tag-text info" id="tag-email">E-mail:</h6><br>
                            <input class="edit-perfil info info-text" id="email-perfil" data-campo="email" type="email" value="<?php echo $_SESSION['usuario_email']; ?>" disabled>
                        </div>
                        <div class="texto">
                            <h6 class="tag-text info" id="tag-altura">Altura:</h6><br>
                            <input class="edit-perfil info info-text" id="altura-perfil" data-campo="altura" value="<?php echo str_replace('.', ',', $_SESSION['usuario_altura']); ?>" disabled>
                        </div>
                        <div class="texto">
                            <h6 class="tag-text info" id="tag-peso">Peso:</h6><br>
                            <input class="edit-perfil info info-text" id="peso-perfil" data-campo="peso" value="<?php echo str_replace('.', ',', $_SESSION['usuario_peso']); ?>" disabled>
                        </div>
                        <div class="edit nav-bnt" id="edit-perfil"><img class="edit" src="images/icones/pencil-square.svg"></div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>

</body>
<script src="scripts/perfil.js"></script>

</html>