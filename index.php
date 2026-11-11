<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Entrar</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="styles/minhas-cores-claro.css">
    <link rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="styles/login.css">
</head>
<script src="scripts/jquery-4.0.0.min.js"></script>

<body class="d-flex flex-column">
        <?php include 'nav.php'?>

    <!--Main-->
    <main class="d-flex flex-column justify-content-center align-items-center">
        <form>
        <div class="form">
            <h1>Bem vindo!</h1>
            <div class="subtitle">Vamos voltar aos treinos!</div>

            <div class="input-container ic1">
                <input placeholder="" type="text" class="input" id="email" required>
                <div class="cut cut-short"></div>
                <label class="iLabel" for="email">Email</label>
            </div>
            <div class="input-container ic2">
                <input placeholder="" type="password" class="input" id="password" required>
                <div class="cut cut-short"></div>
                <label class="iLabel" for="password">Senha</label>
            </div>
            <button class="submit" type="submit">Entrar</button>
            <a href="cadastro.php">Ainda não tenho uma conta...</a>
        </div>
    </main>
</body>
<script src="scripts/login.js"></script>

</html>