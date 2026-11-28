<?php

session_start();

require_once __DIR__ . '/config/database.php';

header('Content-Type: application/json; charset=utf-8');

function atualiza_ofensiva($usuario_id, $ficha_id){
    
}

// FUNÇÃO DE RESPOSTA
function responder($sucesso, $mensagem, $dados = []) {
    echo json_encode(array_merge([
        'sucesso' => $sucesso,
        'mensagem' => $mensagem
    ], $dados));

    exit;
}

// VERIFICAR LOGIN
$usuario_id = $_SESSION['usuario_id'] ?? null;

if (!$usuario_id) {
    http_response_code(401);
    responder(false, 'Usuário não autenticado.');
}

// RECEBER ID DA FICHA
$ficha_id = filter_input(INPUT_GET, 'ficha_id', FILTER_VALIDATE_INT);

if (!$ficha_id || $ficha_id <= 0) {
    http_response_code(400);
    responder(false, 'Ficha inválida.');
}

try {

    // BUSCAR FICHA DO USUÁRIO
    $sql = "SELECT id, nome
            FROM fichaTreino
            WHERE id = :id
            AND usuario_id = :usuario_id";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':id' => $ficha_id,
        ':usuario_id' => $usuario_id
    ]);

    $ficha = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$ficha) {
        http_response_code(404);
        responder(false, 'Ficha não encontrada.');
    }


    // BUSCAR ATIVIDADES DA FICHA
    $sql = "SELECT
                a.id,
                a.nome,
                a.descricao,
                a.series,
                a.repeticoes,
                a.tempoDescansoSegundos,
                a.tempo,
                a.peso
            FROM atividade a
            INNER JOIN atividade_has_fichaTreino af
                ON a.id = af.atividade_id
            WHERE af.fichaTreino_id = :ficha_id
            ORDER BY a.id ASC";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':ficha_id' => $ficha_id
    ]);

    $atividades = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // RETORNAR RESULTADO
    responder(true, 'Atividades carregadas.', [
        'ficha' => $ficha,
        'atividades' => $atividades
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    responder(false, 'Erro ao carregar as atividades.');
}

?>
