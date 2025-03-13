const btnReg =document.getElementsByClassName ('reg')[0];

btnReg.addEventListener('click', register);


document.addEventListener('keydown', function(event){
    if (event.key === 'Enter'){
        register();
    }
})


async function register(){
    const email = document.getElementById('email').value;
    const user_name = document.getElementById('name').value;
    const psw = document.getElementById('psw').value;
    const psw2 = document.getElementById('psw2').value;

    console.log(email, user_name, psw, psw2);

    if (psw !== psw2) {
        // alert('A két jelszó nem eggyezik!!')
        return Swal.fire({
            title: "A két jelszó nem eggyezik!",
            icon: "error",
            theme: 'dark'
        });
    }

    const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({ user_name, email, psw })
    });

    const data = await res.json();
    console.log(data);

    if (res.ok) {
        // alert(data.message);
        Swal.fire({
            title: data.message,
            icon: "success",
            theme: 'dark'
        });
        window.location.href = '../login.html';
    } else if (data.errors) {
        let errorMessage = '';
        for (let i = 0; i < data.errors.length; i++) {
            errorMessage += `${data.errors[i].error}\n`
        }
        // alert(errorMessage);
        Swal.fire({
            title: errorMessage,
            icon: "error",
            theme: 'dark'
        });
    } else if (data.error) {
        // alert(data.error);
        Swal.fire({
            title: data.error,
            icon: "error",
            theme: 'dark'
        });
    } else {
        // alert('ismeretlen hiba');
        Swal.fire({
            title: 'Ismeretlen hiba',
            icon: "error",
            theme: 'dark'
        });
    }
}