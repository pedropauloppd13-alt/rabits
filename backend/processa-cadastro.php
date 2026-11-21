<?php
    include "conexao.php";

    $nome = htmlspecialchars($_POST['nome']);
    $email = htmlspecialchars($_POST['email']);
    $senha = trim($_POST['senha']);

    if(empty($nome) || empty($email) || empty($senha)){
        echo "Preencha todos os campos!";
        exit;
    }
    else if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
        echo "E-mail inválido!";

        exit;
    }
    
    $senha = password_hash($senha, PASSWORD_DEFAULT);

    
    try{   
    $sql = "INSERT INTO `rabits`.`usuario` (`nome`, `dataNascimento`, `senha`, `pesoCorporal`, `altura`, `email`) VALUES ('$nome', NULL, '$senha', NULL, NULL, '$email');";
    if (mysqli_query($conexao, $sql)) {
        echo "sucesso";
        mysqli_close($conexao);
        exit;
    } else {
        echo "Erro ao cadastrar: " . mysqli_error($conexao);
    }
    }
    catch (mysqli_sql_exception $e){
        //erro de duplicidade de e-mail (de acordo com o copilot)
        if ((int) $e->getCode() === 1062) {
            echo "E-mail já cadastrado!";
        } else {
            error_log($e->getMessage());
            echo "Erro ao cadastrar.";
        }
        mysqli_close($conexao);
        exit;
    }