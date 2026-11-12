$("#cadastrar").click(function() {

    const nome = $("#nome").val().trim();
    const email = $("#email").val().trim().toLowerCase();
    const senha = $("#senha").val();
    const confirmarSenha = $("#confirmar-senha").val();

    if (nome === "" || email === "" || senha === "" || confirmarSenha === "") {
        alert("Preencha todos os campos.");
        return;
    }

    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem.");
        return;
    }

    //antes de enviar

    $.ajax(
        {url: "processa-cadastro.php", 
            method: "post",
            data: {nome: nome, email: email, senha:senha}
        }
    ).done( function(){
        //quando terminar
    })
}) 