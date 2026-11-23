$("#entrar").click(function(event) {
    event.preventDefault();
    
    const email = $("#email").val().trim().toLowerCase();
    const senha = $("#senha").val();

    $("#erro").addClass("d-none");

    if (!email || !senha) {
        $("#erro").removeClass("d-none");
        $("#erro span").text("Preencha todos os campos.");
        return;
    }

    $("#carregando").removeClass("d-none");

    $.ajax({
            url: "backend/processa-login.php",
            method: "POST",
            data: {
                email: email,
                senha: senha
            }
        })
        .done(function(response) {
            console.log("Resposta do PHP:", response);

            if (response.trim() === "sucesso") {
                $("#carregando").addClass("d-none");
                console.log("sucesso");
                window.location.href = "inicio.php";
            } else {
                $("#erro").removeClass("d-none");
                $("#erro span").text(response);
                console.log("erro");
            }
        });
});