$("#cadastrar").click(function(event) {
    
    event.preventDefault();
    $("carregando").show();

    let nome = $("#nome").val();
    let senha =  $("#senha").value;
    let senhaConf = $("#confirmar-senha").value;
    let email = $("#email").val();

    if(senha != senhaConf){
        return;
    }


    $.ajax({
        method: "POST",
        url: "processalogin.php",
        data: {nome: nome, senha: senha, email: email}
    });
});