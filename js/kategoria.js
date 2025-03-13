const btnLogout =document.getElementsByClassName ('icon-logout')[0];
const btnProfile =document.getElementsByClassName ('icon-user')[0];
const btnMenuLogo = document.getElementsByClassName('menu-logo')[0];
const btnCart =document.getElementsByClassName ('icon-cart')[0];




btnLogout.addEventListener('click', logout);

btnProfile.addEventListener('click', ()=>{
    window.location.href='../profile.html';
});

btnMenuLogo.addEventListener('click', ()=>{
    window.location.href='../home.html';
});

btnCart.addEventListener('click', ()=>{
    window.location.href='../cart.html';
});





document.addEventListener('DOMContentLoaded', function() {
    const footerColumns = document.querySelectorAll('.footer-column');

    footerColumns.forEach(column => {
        const title = column.querySelector('.footer-column-title');
        title.addEventListener('click', () => {
            column.classList.toggle('active');
        });
    });
});

async function logout() {
    const res = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
    });

    const data = await res.json();

    if (res.ok) {
        // alert(data.message);
        Swal.fire({
            title: data.message,
            icon: "success",
            theme: 'dark'
        }).then(() => {
            window.location.href = '../index.html';
        });
    } else {
        // alert('Hiba a kijelentkezéskor!');
        Swal.fire({
            title: "Hiba a kijelentkezéskor!",
            icon: "error",
            theme: 'dark'
        });
    }
}