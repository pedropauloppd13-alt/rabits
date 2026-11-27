    $nome_org = $('#nome-perfil').val();
    $email_org = $('#email-perfil').val();
    $altura_org = $('#altura-perfil').val();
    $peso_org = $('#peso-perfil').val();


$('#edit-perfil').click(function() {
    $nome = $('#nome-perfil').val();
    $email = $('#email-perfil').val();
    $altura = $('#altura-perfil').val();
    $peso = $('#peso-perfil').val();

    if (!$('.edit-perfil').prop('disabled')) {
        $('.edit-perfil').prop('disabled', true);
        $('.edit-perfil').css('border', 'none');
        $('#edit-perfil  img').attr('src', 'images/icones/pencil-square.svg');

        $.ajax({
            url: "backend/config-perfil.php",
            method: "POST",
            data: {
                nome: $nome,
                email: $email,
                altura: $altura,
                peso: $peso
            }
        }).done(function(response) {
            console.log("Resposta do PHP:", response);
            if (response.trim() === "sucesso") {
                console.log("sucesso");
                window.location.href = "perfil.php";
                $nome_org = $('#nome-perfil').val();
                $email_org = $('#email-perfil').val();
                $altura_org = $('#altura-perfil').val();
                $peso_org = $('#peso-perfil').val();
            }
            else{
                alert("Erro ao atualizar perfil: " + response);
                $('#nome-perfil').val($nome_org);
                $('#email-perfil').val($email_org);
                $('#altura-perfil').val($altura_org);
                $('#peso-perfil').val($peso_org);
            }
        });

        return;
    }
    $('.edit-perfil').prop('disabled', false);
    $('.edit-perfil').css('border', '1px solid #ccc');
    $('#edit-perfil  img').attr('src', 'images/icones/check-lg.svg');
});

