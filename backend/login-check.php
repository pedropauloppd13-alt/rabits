<?php 
    session_start();
    if(!isset($_SESSION['usuario_id']) || $_SESSION['usuario_id'] === null) {
        header('Location: index.php');
        exit();
    }
?>