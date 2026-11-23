$("#cadastrar").click(function(event) {
    event.preventDefault();

    const nome = $("#nome").val().trim();
    const email = $("#email").val().trim().toLowerCase();
    const senha = $("#senha").val();
    const senhaConf = $("#confirmar-senha").val();

    $("#erro").addClass("d-none");

    if (!nome || !email || !senha || !senhaConf) {
        $("#erro").removeClass("d-none");
        $("#erro span").text("Preencha todos os campos.");
        return;
    }

    if (senha !== senhaConf) {
        $("#erro").removeClass("d-none");
        $("#erro span").text("As senhas são diferentes.");
        return;
    }

    $("#carregando").removeClass("d-none");
    $("#cadastrar").prop("disabled", true);

    $.ajax({
            url: "backend/processa-cadastro.php",
            method: "POST",
            dataType: "text",
            timeout: 15000,
            data: {
                nome: nome,
                email: email,
                senha: senha
            }
        })
        .done(function(response) {
            if (response.trim() === "sucesso") {
                window.location.href = "index.php";
            } else {
                $("#erro").removeClass("d-none");
                $("#erro span").text(response);
            }
        })
        .fail(function(xhr, textStatus) {
            $("#erro").removeClass("d-none");

            if (textStatus === "timeout") {
                $("#erro span").text("A conexão demorou demais. Tente novamente.");
            } else if (xhr.responseText) {
                $("#erro span").text(xhr.responseText);
            } else {
                $("#erro span").text("Não foi possível concluir o cadastro.");
            }
        })
        .always(function() {
            $("#carregando").addClass("d-none");
            $("#cadastrar").prop("disabled", false);
        });
});