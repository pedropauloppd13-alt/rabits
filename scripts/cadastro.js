$("#cadastrar").click(function(event) {
    
    event.preventDefault();
    $("carregando").removeClass("d-none");

    let nome = $("#nome").val();
    let senha =  $("#senha").val();
    let senhaConf = $("#confirmar-senha").val();
    let email = $("#email").val();

    if(senha != senhaConf){
        $("#erro").removeClass("d-none");
        $("carregando").hide();
        $("#erro span").text("As senhas são diferentes.");
        return;
    }


    //antes de enviar

    $.ajax(
        {url: "backend/processa-cadastro.php", 
            method: "post",
            data: {nome: nome, email: email, senha:senha}
        }
    ).done(function(response){
        if(response.trim() === "sucesso"){
        //quando terminar
        $("#erro").hide();
        $("carregando").hide();}

        else{
            $("#erro").removeClass("d-none");
            $("#erro span").text(response);
            $("carregando").hide();
        }
        console.log(response);
    })

}) 
