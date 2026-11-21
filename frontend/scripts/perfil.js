const editPerfil = document.getElementById('edit-perfil');
const camposPerfil = document.querySelectorAll('.edit-perfil');
let editando = false;

function obterUsuarioAtual() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioAtual = localStorage.getItem('usuarioAtual');
    return usuarios.find(function(usuario) {
        return usuario.id === usuarioAtual;
    });
}

const usuario = obterUsuarioAtual();

if (!usuario) {
    window.location.href = 'index.html';
} else {
    camposPerfil.forEach(function(campo) {
        campo.value = usuario[campo.dataset.campo] || '';
    });
}

editPerfil.addEventListener('click', function() {
    if (editando) {
        finalizarEdicao();
    } else {
        iniciarEdicao();
    }
});

function iniciarEdicao() {
    editPerfil.querySelector('img').src = 'images/icones/check-lg.svg';
    camposPerfil.forEach(function(campo) {
        campo.disabled = false;
    });
    editando = true;
}

function finalizarEdicao() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioAtual = localStorage.getItem('usuarioAtual');
    const indiceUsuario = usuarios.findIndex(function(item) {
        return item.id === usuarioAtual;
    });

    if (indiceUsuario === -1) {
        return;
    }

    const emailCampo = document.querySelector('[data-campo="email"]');
    const novoEmail = emailCampo.value.trim().toLowerCase();
    const emailEmUso = usuarios.some(function(item, indice) {
        return indice !== indiceUsuario && item.email === novoEmail;
    });

    if (!novoEmail || emailEmUso) {
        alert(emailEmUso ? 'Este e-mail já está cadastrado.' : 'Informe um e-mail válido.');
        return;
    }

    camposPerfil.forEach(function(campo) {
        const valor = campo.dataset.campo === 'email' ?
            novoEmail :
            campo.value.trim();
        usuarios[indiceUsuario][campo.dataset.campo] = valor;
        campo.value = valor;
        campo.disabled = true;
    });

    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    editPerfil.querySelector('img').src = 'images/icones/pencil-square.svg';
    editando = false;
}