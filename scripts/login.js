$('.submit').on('click', function(e) {
    e.preventDefault();
    const email = $('#email').val().trim().toLowerCase();
    const senha = $('#password').val();
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(function(item) {
        return item.email === email && item.senha === senha;
    });

    if (!usuario) {
        alert('E-mail ou senha incorretos.');
        return;
    }

    localStorage.setItem('usuarioAtual', usuario.id);
    window.location.href = 'inicio.php';
})