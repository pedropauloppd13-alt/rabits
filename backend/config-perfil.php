<?php
session_start();
require_once __DIR__ . '/config/database.php';

if (!isset($_SESSION['usuario_id'])) {
    header('Location: ../index.php');
    exit();
}

$nome = trim($_POST['nome'] ?? '');
$email = trim($_POST['email'] ?? '');
$altura = trim($_POST['altura'] ?? '');
$pesoCorporal = trim($_POST['peso'] ?? '');

try {
$sql = "UPDATE usuario SET nome = :nome, email = :email, altura = :altura, pesoCorporal = :pesoCorporal WHERE id = :id";
$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':nome' => $nome,
    ':email' => $email,
    ':altura' => str_replace(',', '.', $altura),
    ':pesoCorporal' => str_replace(',', '.', $pesoCorporal),
    ':id' => $_SESSION['usuario_id']
]);} catch (PDOException $e) {
    error_log($e->getMessage());
    exit('Erro ao atualizar perfil.' . $e->getMessage());
}

$_SESSION['usuario_nome'] = $nome;
$_SESSION['usuario_email'] = $email;
$_SESSION['usuario_altura'] = $altura;
$_SESSION['usuario_peso'] = $pesoCorporal;

exit('sucesso');