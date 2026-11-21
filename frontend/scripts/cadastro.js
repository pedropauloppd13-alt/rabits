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

    $.ajax({
            url: "../backend/processa-cadastro.php",
            method: "POST",
            data: {
                nome: nome,
                email: email,
                senha: senha
            }
        })
        .done(function(response) {
            console.log("Resposta do PHP:", response);

            if (response.trim() === "sucesso") {
                window.location.href = "index.php";
            } else {
                $("#erro").removeClass("d-none");
                $("#erro span").text(response);
            }
        });
});