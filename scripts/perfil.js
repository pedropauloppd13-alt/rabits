$('#edit-perfil').click(function() {
    if (!$('.edit-perfil').prop('disabled')) {
        $('.edit-perfil').prop('disabled', true);
        $('.edit-perfil').css('border', 'none');
        $('#edit-perfil  img').attr('src', 'images/icones/pencil-square.svg');
        $.ajax({
            url: "backend/config-perfil.php",
            method: "POST",
            data: {
                nome: $('#nome-perfil').val(),
                email: $('#email-perfil').val(),
                altura: $('#altura-perfil').val(),
                peso: $('#peso-perfil').val()
            }
        }).done(function(response) {
            console.log("Resposta do PHP:", response);
            if (response.trim() === "sucesso") {
                console.log("sucesso");
                window.location.href = "perfil.php";
            }
            else{
                alert("Erro ao atualizar perfil: " + response);
            }
        });

        return;
    }
    $('.edit-perfil').prop('disabled', false);
    $('.edit-perfil').css('border', '1px solid #ccc');
    $('#edit-perfil  img').attr('src', 'images/icones/check-lg.svg');
});

