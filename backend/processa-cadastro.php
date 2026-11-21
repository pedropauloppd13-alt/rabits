<?php

require_once __DIR__ . '/config/database.php';

$nome = trim($_POST['nome'] ?? '');
$email = trim($_POST['email'] ?? '');
$senha = trim($_POST['senha'] ?? '');

if (empty($nome) || empty($email) || empty($senha)) {
    exit('Preencha todos os campos!');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    exit('E-mail inválido!');
}

$senha = password_hash($senha, PASSWORD_DEFAULT);

try {
    $sql = "INSERT INTO usuario
            (nome, dataNascimento, senha, pesoCorporal, altura, email)
            VALUES
            (:nome, NULL, :senha, NULL, NULL, :email)";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':nome' => $nome,
        ':senha' => $senha,
        ':email' => $email
    ]);

    echo 'sucesso';

} catch (PDOException $e) {
    if ($e->getCode() === '23000') {
        exit('E-mail já cadastrado!');
    }

    error_log($e->getMessage());
    exit('Erro ao cadastrar.');
}
