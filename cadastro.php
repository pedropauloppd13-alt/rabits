<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="styles/minhas-cores-claro.css">
    <link rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="styles/cadastro.css">
</head>

<body class="d-flex flex-column">
    <!--Main-->
    <main>
        <div class="form">

            <h1>Criar conta</h1>
            <div class="subtitle">Vamos criar sua conta!</div>

            <input type="text" id="nome" placeholder="Nome">

            <input type="email" id="email" placeholder="E-mail">

            <input type="password" id="senha" placeholder="Senha">

            <input type="password" id="confirmar-senha" placeholder="Confirmar senha">

            <button id="cadastrar">
            Cadastrar
            </button>

            <a href="index.php">Já tenho uma conta</a>

        </div>
    </main>
    <script src="scripts/jquery-4.0.0.min.js"></script>
    <script src="scripts/cadastro.js"></script>

</body>

</html>