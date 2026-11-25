<?php
session_start();

require_once __DIR__ . '/config/database.php';

header('Content-Type: application/json; charset=utf-8');

// VERIFICAR AUTENTICAÇÃO
$usuario_id = $_SESSION['usuario_id'] ?? null;

if (!$usuario_id) {
    http_response_code(401);

    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Usuário não autenticado.'
    ]);

    exit;
}

// LISTAR FICHAS (GET)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    if (($_GET['acao'] ?? '') === 'listar') {

        try {

            $sql = "SELECT id, nome
                    FROM fichaTreino
                    WHERE usuario_id = :usuario_id
                    ORDER BY id DESC";

            $stmt = $pdo->prepare($sql);

            $stmt->execute([
                ':usuario_id' => $usuario_id
            ]);

            $fichas = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Adicionar lista de atividades a cada ficha
            foreach ($fichas as &$ficha) {
                $ficha['atividades'] = [];
            }

            unset($ficha);

            echo json_encode([
                'sucesso' => true,
                'fichas' => $fichas
            ]);

        } catch (PDOException $e) {

            error_log($e->getMessage());

            http_response_code(500);

            echo json_encode([
                'sucesso' => false,
                'mensagem' => 'Erro ao listar fichas.'
            ]);
        }

        exit;
    }
}

// IDENTIFICAR AÇÃO
$acao = $_POST['acao'] ?? '';

// CRIAR FICHA
if ($acao === 'criar') {

    // RECEBER E VALIDAR DADOS
    $nome = trim($_POST['nome'] ?? '');

    if ($nome === '') {
        http_response_code(400);

        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'O nome da ficha é obrigatório.'
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

    try {

        // INSERIR FICHA NO BANCO
        $sql = "INSERT INTO fichaTreino (usuario_id, nome)
                VALUES (:usuario_id, :nome)";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ':usuario_id' => $usuario_id,
            ':nome' => $nome
        ]);

        // RETORNAR DADOS DA FICHA CRIADA
        echo json_encode([
            'sucesso' => true,
            'id' => (int) $pdo->lastInsertId(),
            'nome' => $nome,
            'atividades' => []
        ]);

    } catch (PDOException $e) {

        error_log($e->getMessage());

        http_response_code(500);

        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'Erro ao criar ficha.'
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
        $sql = "UPDATE fichaTreino
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
            // Pode ser que a ficha não exista ou que o nome não tenha mudado.
            $sql = "SELECT id FROM fichaTreino
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