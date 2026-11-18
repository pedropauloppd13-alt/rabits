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


<<<<<<< HEAD
    $.ajax({
        method: "POST",
        url: "processalogin.php",
        data: {nome: nome, senha: senha, email: email}
    });
});
=======
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
>>>>>>> 3e8956ec71f70ace91761b0b9fbdf7eb186a5bb6
