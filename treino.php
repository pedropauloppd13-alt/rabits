<?php
include 'backend/login-check.php';
?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Treino</title>
    <link rel="stylesheet" href="styles/treino.css">
</head>

<body>

    <header class="treino-header">
        <button class="fechar" id="fechar-treino">
            ×
        </button>
        <div class="titulo-treino">
            <h1 id="nome-treino">
                TREINO
            </h1>
            <span id="nome-ficha">
                Ficha
            </span>
        </div>
        <span class="contador-grupo" id="contador-grupo">
            1/1
        </span>
        <div class="progresso-container">
            <div class="progresso-info">
                <span id="series-concluidas">
                    0 de 0 séries
                </span>
                <span id="porcentagem">
                    0%
                </span>
            </div>
            <div class="barra-progresso">
                <div class="progresso" id="barra-progresso"></div>
            </div>
        </div>
    </header>

    <main class="conteudo">
        <div class="grupo-titulo">
            Grupo 1
            <span id="grupo-progresso">
                0/0
            </span>
        </div>
        <div id="lista-exercicios"></div>
    </main>
    <div class="descanso-overlay" id="descanso-overlay" hidden>
        <div class="descanso-dialog" role="dialog" aria-modal="true" aria-labelledby="titulo-descanso">
            <h2 id="titulo-descanso">Descansando...</h2>
            <div class="cronometro-circulo">
                <span id="cronometro-descanso">00</span>
            </div>
            <button class="pular-descanso" id="pular-descanso" type="button">
                Pular Descanso
            </button>
        </div>
    </div>

    <footer class="rodape">
        <button class="finalizar" id="finalizar-treino">
            <span>✓</span>
            Finalizar Treino
        </button>
    </footer>

    <script src="scripts/jquery-4.0.0.min.js"></script>
    <script src="scripts/treino.js"></script>

</body>

</html>