$('.submit').on('click', function(e) {
    e.preventDefault();
    var firstname = $('#firstname').val();
    var lastname = $('#lastname').val();

    localStorage.setItem('nome', firstname + ' ' + lastname);
    localStorage.setItem('email', $('#email').val());
})