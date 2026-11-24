<?php
session_start();

require_once __DIR__ . '/config/database.php';

$senha = trim($_POST['senha'] ?? '');
$email = trim($_POST['email'] ?? '');

if(empty($email) || empty($senha)) {
    exit('Preencha todos os campos!');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    exit('E-mail inválido!');
}


try {
    $sql = "SELECT * FROM usuario WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':email' => $email]);
    $usuario = $stmt->fetch();

    if (!$usuario || !password_verify($senha, $usuario['senha'])) {
        exit('E-mail ou senha incorretos!');
    }

    $_SESSION['usuario_id'] = $usuario['id'];
    $_SESSION['usuario_nome'] = $usuario['nome'];
    $_SESSION['usuario_email'] = $usuario['email'];
    $_SESSION['data_nascimento'] = $usuario['dataNascimento'];
    $_SESSION['usuario_peso'] = $usuario['pesoCorporal'];
    $_SESSION['usuario_altura'] = $usuario['altura'];
        
    echo 'sucesso';

} catch (PDOException $e) {
    error_log($e->getMessage());
    exit('Erro ao processar login.');
}
exit();