<?php

session_start();

$usuario = $_POST['email'];
$senha = $_POST['password'];

if (empty($usuario)||empty($senha)){
    echo 'credenciais inválidas!';
    die();
} else {
    $_SESSION['logon']=[
        'usuario' => $usuario,
        #'senha' => $senha
    ];

    echo 'login realizado';
    die();
}

var_dump($_SESSION['logon']['usuario']);