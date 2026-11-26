<?php
session_start();
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
            $sql = "SELECT ativ.id, ativ.nome, ativ.descricao, ativ.series, ativ.repeticoes, ativ.tempoDescansoSegundos, ativ.tempo, ativ.peso
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
    $descricao = trim($_POST['descricao'] ?? '');
    $series = trim((string)($_POST['series'] ?? null));
    $repeticoes = trim((string)($_POST['repeticoes'] ?? null));
    $tempoDescansoSegundos = trim((string)($_POST['tempoDescansoSegundos'] ?? null));
    $tempo = trim((string)($_POST['tempo'] ?? ''));
    $peso = trim((string)($_POST['peso'] ?? null));

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

    //VALIDAR INTEIROS
    $campos = [
        'series' => [$series, 1],
        'repeticoes' => [$repeticoes, 1],
        'tempoDescansoSegundos' => [$tempoDescansoSegundos, 0],
        'tempo' => [$tempo, 1]
    ];

    foreach ($campos as $campo => [$valor, $minimo]) {

        if ($valor === '') {
            $$campo = null;
            continue;
        }

        if (
            filter_var($valor, FILTER_VALIDATE_INT) === false ||
            (int) $valor < $minimo
        ) {
            http_response_code(400);
            echo json_encode([
                'sucesso' => false,
                'mensagem' => "O campo $campo possui um valor inválido."
            ]);

            exit;
        }
        $$campo = (int) $valor;
    }

    //VALIDAR PESO
    if ($peso === '') {
        $peso = null;
    } elseif (
        !is_numeric($peso) ||
        !is_finite((float) $peso) ||
        (float) $peso < 0
    ) {
        http_response_code(400);
        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'O peso informado é inválido.'
        ]);
        exit;
    } else {
        $peso = (float) $peso;
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
        $sql = "INSERT INTO atividade (nome, descricao, series, repeticoes, tempoDescansoSegundos, tempo, peso)
                VALUES (:nome, :descricao, :series, :repeticoes, :tempoDescansoSegundos, :tempo, :peso)";
        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ':nome' => $nome,
            ':descricao' => $descricao,
            ':series' => $series,
            ':repeticoes' => $repeticoes,
            ':tempoDescansoSegundos' => $tempoDescansoSegundos,
            ':tempo' => $tempo,
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
            'descricao' => $descricao,
            'series' => $series,
            'repeticoes' => $repeticoes,
            'tempoDescansoSegundos' => $tempoDescansoSegundos,
            'tempo' => $tempo,
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

elseif ($acao === 'editar') {

    $id = filter_var($_POST['id'] ?? null, FILTER_VALIDATE_INT);
    $ficha_id = filter_var($_POST['ficha_id'] ?? null, FILTER_VALIDATE_INT);

    $nome = trim($_POST['nome'] ?? '');
    $descricao = trim($_POST['descricao'] ?? '');
    $tipo = $_POST['tipo'] ?? '';

    $series = $_POST['series'] ?? '';
    $repeticoes = $_POST['repeticoes'] ?? '';
    $tempoDescansoSegundos = $_POST['tempoDescansoSegundos'] ?? '';
    $tempo = $_POST['tempo'] ?? '';
    $peso = trim((string) ($_POST['peso'] ?? ''));

    // VALIDAR IDENTIFICADORES E NOME
    if (
        !$id || $id < 1 ||
        !$ficha_id || $ficha_id < 1 ||
        $nome === '' ||
        mb_strlen($nome) > 100 ||
        !in_array($tipo, ['series', 'tempo'])
    ) {
        http_response_code(400);
        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'Dados inválidos.'
        ]);
        exit;
    }

    //VALIDAR INTEIROS
    $validarInteiro = function ($valor, $minimo, $campo) {

        if ($valor === null || $valor === '') {
            return null;
        }
        $valorValidado = filter_var($valor, FILTER_VALIDATE_INT);

        if ($valorValidado === false || $valorValidado < $minimo) {
            throw new InvalidArgumentException(
                "O campo $campo possui um valor inválido."
            );
        }
        return $valorValidado;
    };

    try {
        $series = $tipo === 'series'
            ? $validarInteiro($series, 1, 'Séries')
            : null;
        $repeticoes = $tipo === 'series'
            ? $validarInteiro($repeticoes, 1, 'Repetições')
            : null;
        $tempoDescansoSegundos = $tipo === 'series'
            ? $validarInteiro($tempoDescansoSegundos, 0, 'Descanso')
            : null;
        $tempo = $tipo === 'tempo'
            ? $validarInteiro($tempo, 1, 'Tempo')
            : null;
        if (
            ($tipo === 'series' && ($series === null || $repeticoes === null)) ||
            ($tipo === 'tempo' && $tempo === null)
        ) {
            throw new InvalidArgumentException(
                'Preencha os campos obrigatórios da configuração.'
            );
        }

        //VALIDAR PESO
        if ($peso === '') {
            $peso = null;
        } elseif (
            !is_numeric($peso) ||
            !is_finite((float) $peso) ||
            (float) $peso < 0
        ) {
            throw new InvalidArgumentException('Peso inválido.');
        } else {
            $peso = (float) $peso;
        }

        //VERIFICAR SE ATIVIDADE = FICHA DO USUÁRIO
        $sql = "SELECT ativ.id
                FROM atividade ativ
                INNER JOIN atividade_has_fichaTreino ativft
                    ON ativ.id = ativft.atividade_id
                INNER JOIN fichaTreino ficha
                    ON ficha.id = ativft.fichaTreino_id
                WHERE ativ.id = :id
                AND ficha.id = :ficha_id
                AND ficha.usuario_id = :usuario_id";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ':id' => $id,
            ':ficha_id' => $ficha_id,
            ':usuario_id' => $usuario_id
        ]);

        if (!$stmt->fetch()) {
            http_response_code(404);

            echo json_encode([
                'sucesso' => false,
                'mensagem' => 'Atividade não encontrada.'
            ]);

            exit;
        }

        //ATUALIZAR ATIV
        $sql = "UPDATE atividade
                SET nome = :nome,
                    descricao = :descricao,
                    series = :series,
                    repeticoes = :repeticoes,
                    tempoDescansoSegundos = :descanso,
                    tempo = :tempo,
                    peso = :peso
                WHERE id = :id";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ':nome' => $nome,
            ':descricao' => $descricao,
            ':series' => $series,
            ':repeticoes' => $repeticoes,
            ':descanso' => $tempoDescansoSegundos,
            ':tempo' => $tempo,
            ':peso' => $peso,
            ':id' => $id
        ]);

        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Atividade atualizada com sucesso.'
        ]);

    } catch (InvalidArgumentException $e) {

        http_response_code(400);

        echo json_encode([
            'sucesso' => false,
            'mensagem' => $e->getMessage()
        ]);

    } catch (PDOException $e) {

        error_log($e->getMessage());

        http_response_code(500);

        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'Erro ao editar atividade.'
        ]);
    }

    exit;
}

elseif ($acao === 'excluir') {

    $id = filter_var($_POST['id'] ?? null, FILTER_VALIDATE_INT);
    $ficha_id = filter_var($_POST['ficha_id'] ?? null, FILTER_VALIDATE_INT);

    if (!$id || $id < 1 || !$ficha_id || $ficha_id < 1) {
        http_response_code(400);
        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'Identificadores inválidos.'
        ]);
        exit;
    }

    try {
        $pdo->beginTransaction();
        //VERIFICAR SE ATIVIDADE = FICHA DO USUÁRIO
        $sql = "SELECT ativ.id
                FROM atividade ativ
                INNER JOIN atividade_has_fichaTreino ativft
                    ON ativ.id = ativft.atividade_id
                INNER JOIN fichaTreino ficha
                    ON ficha.id = ativft.fichaTreino_id
                WHERE ativ.id = :id
                AND ficha.id = :ficha_id
                AND ficha.usuario_id = :usuario_id";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ':id' => $id,
            ':ficha_id' => $ficha_id,
            ':usuario_id' => $usuario_id
        ]);

        if (!$stmt->fetch()) {
            $pdo->rollBack();
            http_response_code(404);

            echo json_encode([
                'sucesso' => false,
                'mensagem' => 'Atividade não encontrada.'
            ]);
            exit;
        }

        //EXCLUIR VÍNCULO
        $sql = "DELETE FROM atividade_has_fichaTreino
                WHERE atividade_id = :id
                AND fichaTreino_id = :ficha_id";

        $stmt = $pdo->prepare($sql);

        $stmt->execute([
            ':id' => $id,
            ':ficha_id' => $ficha_id
        ]);

        //EXCLUIR ATIV
        $sql = "DELETE FROM atividade
                WHERE id = :id";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $id]);

        $pdo->commit();

        echo json_encode([
            'sucesso' => true,
            'mensagem' => 'Atividade excluída com sucesso.'
        ]);
    } catch (PDOException $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }

        error_log($e->getMessage());
        http_response_code(500);
        echo json_encode([
            'sucesso' => false,
            'mensagem' => 'Erro ao excluir atividade.'
        ]);
    }
    exit;
}