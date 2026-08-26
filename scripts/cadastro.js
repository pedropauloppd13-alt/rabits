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

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const emailExiste = usuarios.some(function(usuario) {
        return usuario.email === email;
    });

    if (emailExiste) {
        alert("Este e-mail já está cadastrado.");
        return;
    }

    const novoUsuario = {
        id: crypto.randomUUID(),
        nome: nome,
        email: email,
        senha: senha,
        fichas: []
    };

    usuarios.push(novoUsuario);

    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuarios)
    );

    localStorage.setItem(
        "usuarioAtual",
        novoUsuario.id
    );

    console.log(usuarios);
    window.location.href = "index.html";
});