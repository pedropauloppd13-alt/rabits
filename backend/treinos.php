<?php
require_once __DIR__ . '/login-check.php';
require_once __DIR__ . '/config/database.php';

header('Content-Type: application/json; charset=utf-8');

//VERIFICAR AUTENTICAÇÃO
$usuario_id = $_SESSION['usuario_id'] ?? null;

if (!$usuario_id) {
    http_response_code(401);

    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Usuário não autenticado.'
    ]);

    exit;
}

//LISTAR TREINOS
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    if (($_GET['acao'] ?? '') === 'listar') {

        $ficha_id = filter_input(INPUT_GET, 'ficha_id', FILTER_VALIDATE_INT);

        if (!$ficha_id || $ficha_id < 1) {
            http_response_code(400);

            echo json_encode([
                'sucesso' => false,
                'mensagem' => 'ID da ficha inválido.'
            ]);

            exit;
        }
         try {

            //VERIFICAR SE A FICHA PERTENCE AO USUÁRIO
            $sql = "SELECT id
                    FROM fichaTreino
                    WHERE id = :ficha_id
                    AND usuario_id = :usuario_id";

            $stmt = $pdo->prepare($sql);

            $stmt->execute([
                ':ficha_id' => $ficha_id,
                ':usuario_id' => $usuario_id
            ]);

            if (!$stmt->fetch()) {
                http_response_code(404);

                echo json_encode([
                    'sucesso' => false,
                    'mensagem' => 'Ficha não encontrada.'
                ]);

                exit;
            }

        //BUSCAR ATIVIDADES ASSOCIADAS À FICHA
            $sql = "SELECT ativ.id, ativ.nome, ativ.series, ativ.repeticoes, ativ.tempoDescansoSegundos, ativ.peso
                    FROM atividade ativ
                    INNER JOIN atividade_has_fichaTreino ativft
                    ON ativ.id = ativft.atividade_id
                    WHERE ativft.fichaTreino_id = :ficha_id
                    ORDER BY ativ.nome ASC"; 

            $stmt = $pdo->prepare($sql);

            $stmt->execute([
                ':ficha_id' => $ficha_id
            ]);

            $atividades = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                'sucesso' => true,
                'atividades' => $atividades
            ]);

        } catch (PDOException $e) {

            error_log($e->getMessage());

            http_response_code(500);

            echo json_encode([
                'sucesso' => false,
                'mensagem' => 'Erro ao listar atividades.'
            ]);
        }

        exit;
    }
}

//IDENTIFICAR AÇÃO
$acao = $_POST['acao'] ?? '';

//CRIAR ATIVIDADE
if ($acao === 'criar') {

    //RECEBER E VALIDAR DADOS
    $ficha_id = filter_var(
        $_POST['ficha_id'] ?? null,
        FILTER_VALIDATE_INT
    );

    //RECEBER
    $nome = trim($_POST['nome'] ?? '');
    $series = trim($_POST['series'] ?? null);
    $repeticoes = trim($_POST['repeticoes'] ?? null);
    $tempoDescansoSegundos = trim($_POST['tempoDescansoSegundos'] ?? null);
    $peso = trim($_POST['peso'] ?? null);

    //FICHA
    if (!$ficha_id || $ficha_id < 1) {
        http_response_code(400);

        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'ID da ficha inválido.'
        ]);

        exit;
    }

    //NOME
    if ($nome === '') {
        http_response_code(400);

        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'O nome da atividade é obrigatório.'
        ]);

        exit;
    }

    if (mb_strlen($nome) > 100) {
        http_response_code(400);

        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'O nome deve ter no máximo 100 caracteres.'
        ]);

        exit;
    }

    //LÓGICA PARA SERIES, REPETIÇÕES, TEMPO DE DESCANSO E PESO
    $inteiros = [
        'series' => $series,
        'repeticoes' => $repeticoes,
        'tempoDescansoSegundos' => $tempoDescansoSegundos,
        'peso' => $peso
    ];

    foreach ($inteiros as $int => $valor){
        
        if ($valor === null || $valor === '') {
            $valor = null;
            continue;
        }
        
        if (filter_var($valor, FILTER_VALIDATE_INT) === false ||
            (int) $valor < 0 ||
            (in_array($int, ['series', 'repeticoes']) && (int) $valor < 1)) {
           
            http_response_code(400);

            echo json_encode([
                'sucesso' => false,
                'mensagem' => "O campo $int deve ser um número inteiro não negativo."
            ]);

            exit;

        } elseif ($peso === '') {
            $peso = null;
        } elseif (!is_numeric($peso) ||
                 !is_finite((float) $peso) ||
                 (float) $peso < 0) {

            http_response_code(400);

            echo json_encode([
                'sucesso' => false,
                'mensagem' => "O campo $int é inválido."
            ]);

            exit;
        } else {
        $peso = (float) $peso;
    }
        $valor =(int) $valor;
    }

    unset($valor);

    try {
        //USUÁRIO
        $sql = "SELECT id
                FROM fichaTreino
                WHERE id = :ficha_id
                AND usuario_id = :usuario_id";
        
        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ':ficha_id' => $ficha_id,
            ':usuario_id' => $usuario_id
        ]);

        if (!$stmt->fetch()) {
            http_response_code(404);

            echo json_encode([
                'sucesso' => false,
                'mensagem' => 'Ficha não encontrada.'
            ]);

            exit;
        }

        $pdo->beginTransaction();

        //ADD ATIVIDADE
        $sql = "INSERT INTO atividade (nome, series, repeticoes, tempoDescansoSegundos, peso)
                VALUES (:nome, :series, :repeticoes, :tempoDescansoSegundos, :peso)";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ':nome' => $nome,
            ':series' => $series,
            ':repeticoes' => $repeticoes,
            ':tempoDescansoSegundos' => $tempoDescansoSegundos,
            ':peso' => $peso
        ]);

        $atividade_id = (int) $pdo->lastInsertId();

        //VINCULAR ATIVIDADE À FICHA
        $sql = "INSERT INTO atividade_has_fichaTreino (atividade_id, fichaTreino_id)
                VALUES (:atividade_id, :ficha_id)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':atividade_id' => $atividade_id,
            ':ficha_id' => $ficha_id
        ]);

        $pdo->commit();

        //RETORNAR DADOS
        echo json_encode([
            'sucesso' => true,
            'id' => $atividade_id,
            'nome' => $nome,
            'series' => $series,
            'repeticoes' => $repeticoes,
            'tempoDescansoSegundos' => $tempoDescansoSegundos,
            'peso' => $peso
        ]);

    } catch (PDOException $e) {

       if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }

        error_log($e->getMessage());

        http_response_code(500);

        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'Erro ao criar atividade.'
        ]);
    }

        exit;
}

elseif ($_POST['acao'] === 'editar') {

    $id = $_POST['id'] ?? null;
    $nome = trim($_POST['nome'] ?? '');

    if (!$id || !ctype_digit((string) $id) || $nome === '' || mb_strlen($nome) > 100) {
        http_response_code(400);

        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'Dados inválidos.'
        ]);

        exit;
    }

    try {
        $sql = "UPDATE atividade
                SET nome = :nome
                WHERE id = :id
                AND usuario_id = :usuario_id";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ':nome' => $nome,
            ':id' => $id,
            ':usuario_id' => $usuario_id
        ]);

        if ($stmt->rowCount() === 0) {
            // Pode ser que a atividade não exista ou que o nome não tenha mudado.
            $sql = "SELECT id FROM atividade
                    WHERE id = :id AND usuario_id = :usuario_id";

            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':id' => $id,
                ':usuario_id' => $usuario_id
            ]);

            if (!$stmt->fetch()) {
                http_response_code(404);

                echo json_encode([
                    'sucesso' => false,
                    'mensagem' => 'Ficha não encontrada.'
                ]);

                exit;
            }
        }

        echo json_encode([
            'sucesso' => true,
            'nome' => $nome
        ]);

    } catch (PDOException $e) {
        error_log($e->getMessage());

        http_response_code(500);

        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'Erro ao editar ficha.'
        ]);
    }
}

elseif ($_POST['acao'] === 'excluir') {

    $id = $_POST['id'] ?? null;

    if (!$id || !ctype_digit((string) $id)) {
        http_response_code(400);

        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'ID inválido.'
        ]);

        exit;
    }

    try {
        $pdo->beginTransaction();

        // Verificar se a ficha pertence ao usuário
        $sql = "SELECT id FROM fichaTreino
                WHERE id = :id AND usuario_id = :usuario_id";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':usuario_id' => $usuario_id
        ]);

        if (!$stmt->fetch()) {
            $pdo->rollBack();

            http_response_code(404);

            echo json_encode([
                'sucesso' => false,
                'mensagem' => 'Ficha não encontrada.'
            ]);

            exit;
        }

        // Excluir vínculos com atividades
        $sql = "DELETE FROM atividade_has_fichaTreino
                WHERE fichaTreino_id = :id";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $id]);

        // Excluir ficha
        $sql = "DELETE FROM fichaTreino
                WHERE id = :id AND usuario_id = :usuario_id";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':usuario_id' => $usuario_id
        ]);

        $pdo->commit();

        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Ficha excluída com sucesso.'
        ]);

    } catch (PDOException $e) {

        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }

        error_log($e->getMessage());

        http_response_code(500);

        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'Erro ao excluir ficha.'
        ]);
    }
} else {
    http_response_code(400);

    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Ação inválida.'
    ]);
}