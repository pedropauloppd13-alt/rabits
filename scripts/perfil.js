var editPerfil = document.getElementById("edit-perfil");
var editando = false;
var atributos = document.getElementsByClassName("edit-perfil")

for (let i = 0; i < atributos.length; i++) {
    info = localStorage.getItem(atributos[i].getAttribute("infor"));
    if (info == null) {
        continue
    } else {
        atributos[i].innerHTML = info;
    }
}


editPerfil.addEventListener("click", (e) => {
    if (editando) {
        finEdit(editPerfil);
    } else {
        iniEdit(editPerfil);
    }
});

function iniEdit(_alvo) {
    _alvo.firstChild.src = "images/icones/check-lg.svg";
    let aux = document.getElementsByClassName(_alvo.id);
    for (let i = 0; i < aux.length; i++) {
        aux[i].contentEditable = "true";
    };
    editando = true;
};

function finEdit(_alvo) {
    _alvo.firstChild.src = "images/icones/pencil-square.svg";
    let aux = document.getElementsByClassName(_alvo.id);
    for (let i = 0; i < aux.length; i++) {
        aux[i].contentEditable = "false";
        localStorage.setItem(aux[i].getAttribute("infor"), aux[i].innerHTML)
        console.log(aux[i].getAttribute("infor"))
    };
    editando = false;
};