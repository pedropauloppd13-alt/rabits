<?php
include 'backend/login-check.php';
?>
<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rabits</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="styles/minhas-cores-claro.css">
    <link rel="stylesheet" href="styles/style.css">
    <link rel="stylesheet" href="styles/ofensiva.css">
</head>

<body class="d-flex flex-column">
   <!--Navbar-->
    <?php include 'nav.php'?>
     <!--Main-->
    <main>

        <!--Ofensiva-->
        <div class="container">
            <div class="ofensiva-header">
                <h1><img src="images/icones/fire2.svg" alt="fire" id="fire">Ofensiva</h1>
                <h3>Bem-vindo à seção de ofensiva!</h3>
            </div>
            <div class="calendar-layout">
                <!-- Calendar -->
                <div class="calendar">

                    <div class="header">
                        <select class="date-selector" id="month-selector" type="button" value="September">
                            <option value="0">January</option>
                            <option value="1">February</option>
                            <option value="2">March</option>
                            <option value="3">April</option>
                            <option value="4">May</option>
                            <option value="5">June</option>
                            <option value="6">July</option>
                            <option value="7" selected>August</option>
                            <option value="8">September</option>
                            <option value="9">October</option>
                            <option value="10">November</option>
                            <option value="11">December</option>
                            </select>
                    </div>
                    <!-- Importar biblioteca do calendário -->
                    <div class="date-nav-and-indicators">
                        <div class="indicator-container">
                            <div class="indicator-line"></div>
                            <div class="indicator-dot">
                                <p>D</p>
                            </div>
                            <div class="indicator-dot">
                                <p>S</p>
                            </div>
                            <div class="indicator-dot">
                                <p>T</p>
                            </div>
                            <div class="indicator-dot">
                                <p>Q</p>
                            </div>
                            <div class="indicator-dot">
                                <p>Q</p>
                            </div>
                            <div class="indicator-dot">
                                <p>S</p>
                            </div>
                            <div class="indicator-dot">
                                <p>S</p>
                            </div>
                        </div>
                        <div class="date-nav-container">

                        </div>

                    </div>

                </div>

                <!-- Ficha Calendar -->
                <div class="fichas-container">
                    <div class="meeting-card" style="display: none;">
                        <div class="header">
                            <div class="title ficha-nome">Ficha Nome</div>
                        </div>
                        <!-- Últimos seis dias -->
                        <div class="date-nav-and-indicators ficha-dias">
                            <div class="date-nav-container"></div>
                            <!-- Dia atual da semana -->
                            <div class="indicator-container">
                                <div class="indicator-line"></div>
                                <div class="indicator-dot"></div>
                                <div class="indicator-dot"></div>
                                <div class="indicator-dot"></div>
                                <div class="indicator-dot"></div>
                                <div class="indicator-dot"></div>
                                <div class="indicator-dot"></div>
                                <div class="indicator-dot indicator-active"></div>
                            </div>
                        </div>
                    </div>
                    <!--Adicionar novas fichas de ofensiva aqui-->
                </div>

            </div>
        </div>
    </main>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
    <script src="scripts/ofensiva.js"></script>
</body>

</html>