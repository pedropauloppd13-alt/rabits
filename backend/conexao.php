
<?php
$servidor = "localhost";
    $usuario = "root";
    $senha = "root";
    $nome_bd = "rabits";
    $conexao = mysqli_connect($servidor, $usuario, $senha, $nome_bd);

    if (!$conexao) {
        echo "Falha na conexão com o banco de dados!";
        die("Conexão falhou: " . mysqli_connect_error());
    }
    //debug
    //echo "Conexão bem-sucedida!";
?>