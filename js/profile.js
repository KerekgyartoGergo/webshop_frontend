const btnLogout =document.getElementsByClassName ('icon-logout')[0];
const btnMenuLogo = document.getElementsByClassName('menu-logo')[0];
const btnCart =document.getElementsByClassName ('icon-cart')[0];

window.addEventListener('DOMContentLoaded', getUserOrders);


btnLogout.addEventListener('click', logout);
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


//név módosítása
document.getElementById("saveName").addEventListener("click", function() {
    const name = document.getElementById("nameInput").value;

    // Ellenőrzés, hogy van-e név a bemenetben
    if (!name) {
        // alert("Kérlek, add meg az új nevet!");
        Swal.fire({
            title: "Kérlek, add meg az új nevet!",
            icon: "warning",
            theme: 'dark'
        });
        return;
    }

    // POST kérés a backend felé a név módosításához
    fetch('/api/editProfileName', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            // Ha szükséges, itt adj hozzá egy Authorization fejlécet
            //'Authorization': 'Bearer ' + token
        },
        credentials: 'include',  // Az autentikációhoz szükséges sütik (cookies) átadása

        body: JSON.stringify({ name: name })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            // alert(data.message); // Sikeres üzenet
            Swal.fire({
                title: data.message,
                icon: "success",
                theme: 'dark'
            });
        } else if (data.error) {
            // alert(data.error); // Hibás üzenet
            Swal.fire({
                title: data.error,
                icon: "error",
                theme: 'dark'
            });
        }
    })
    .catch(error => {
        console.error('Hiba történt:', error);
        // alert('Hiba történt a név módosítása közben.');
        Swal.fire({
            title: "Hiba történt a név módosítása közben.",
            icon: "error",
            theme: 'dark'
        });
    });
});





document.getElementById('savePassword').addEventListener('click', function() {
    // Jelszavak validálása
    const password = document.getElementById('passwordInput').value;
    const confirmPassword = document.getElementById('confirmPasswordInput').value;

    if (password === '' || confirmPassword === '') {
        // alert('Kérjük, töltsd ki mindkét jelszó mezőt!');
        Swal.fire({
            title: "Kérjük, töltsd ki mindkét jelszó mezőt!",
            icon: "warning",
            theme: 'dark'
        });
        return;
    }

    if (password !== confirmPassword) {
        // alert('A jelszavak nem egyeznek!');
        Swal.fire({
            title: "A jelszavak nem egyeznek!",
            icon: "error",
            theme: 'dark'
        });
        return;
    }

    // API hívás
    const token = localStorage.getItem('authToken'); // vagy sessionStorage, ahol tárolod az auth tokent

    const data = { psw: password };

    fetch('/api/editProfilePsw', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            // alert(data.error);
            Swal.fire({
                title: data.error,
                icon: "error",
                theme: 'dark'
            });
        } else {
            // alert(data.message);
            Swal.fire({
                title: data.message,
                icon: "success",
                theme: 'dark'
            });
            logout();
        }
    })
    .catch(error => {
        console.error('Hiba történt:', error);
        // alert('Hiba történt a jelszó módosítása során.');
        Swal.fire({
            title: "Hiba történt a jelszó módosítása során.",
            icon: "error",
            theme: 'dark'
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






async function getUserOrders() {
    try {
        const res = await fetch('/api/my-orders', {
            method: 'GET',
            credentials: 'include'
        });

        if (!res.ok) {
            throw new Error('Nem sikerült lekérni a rendeléseket');
        }

        const orders = await res.json();
        console.log(orders);
        renderOrders(orders);
    } catch (error) {
        console.error('Hiba történt a rendelés lekérdezésekor:', error);
    }
}

function renderOrders(orders) {
    const tbody = document.querySelector('.ordersList');
    tbody.innerHTML = ''; // Töröljük a tartalmat, hogy ne duplikálódjanak az elemek

    const groupedOrders = {};

    // Csoportosítjuk a rendeléseket rendelés ID alapján
    orders.forEach(order => {
        if (!groupedOrders[order.order_id]) {
            groupedOrders[order.order_id] = {
                user_id: order.user_id,
                user_name: order.user_name,
                email: order.email,
                status: order.status, // Csak az első termék státuszát vesszük
                products: []
            };
        }
        groupedOrders[order.order_id].products.push(order);
    });

    // Rendelésenként új kártyák létrehozása
    Object.entries(groupedOrders).forEach(([orderId, orderData]) => {
        // Kártya létrehozása
        const card = document.createElement('div');
        card.classList.add('order-card');

        // Fejléc a rendelés adataival (Rendelés ID és Státusz)
        const orderHeader = document.createElement('div');
        orderHeader.classList.add('order-header');
        orderHeader.innerHTML = `
            <span>Rendelés azonosító: ${orderId}</span>
            <span>
              Státusz: ${
                orderData.status === "pending"
                  ? "Függőben"
                  : orderData.status === "cancelled"
                  ? "Megszakítva"
                  : orderData.status === "completed"
                  ? "Kész"
                  : orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)
              }
            </span>        
        `;
        card.appendChild(orderHeader);

        // Termékek táblázata
        const productTable = document.createElement('table');
        productTable.innerHTML = `
            <thead>
                <tr>
                    <th>Termék Név</th>
                    <th>Kép</th>
                    <th>Mennyiség</th>
                    <th>Ár</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;
        const productTableBody = productTable.querySelector('tbody');

        // Termékek hozzáadása a táblázathoz
        orderData.products.forEach(product => {
            const productRow = document.createElement('tr');
            productRow.innerHTML = `
                <td>${product.name}</td>
                <td><img src="/uploads/${product.pic}" alt="${product.name}" width="50"></td>
                <td>${product.quantity}</td>
                <td>${product.price} Ft</td>
            `;
            productTableBody.appendChild(productRow);
        });

        card.appendChild(productTable);

        // Kérjük le a rendelés végösszegét az API-ból

fetch(`/api/getOrderTotal?order_id=${orderId}`, {
    method: 'GET',
    credentials: 'include'
})
    .then(response => response.json())
    .then(data => {
        if (data.total_price) {
            const totalCell = document.createElement('div');
            totalCell.classList.add('order-total');
            totalCell.innerHTML = `
                <span>Végösszeg: ${data.total_price} Ft</span>
            `;
            card.appendChild(totalCell);
        }
    })
    .catch(error => {
        console.error("Hiba a végösszeg lekérésekor:", error);
        const totalCell = document.createElement('div');
        totalCell.classList.add('order-total');
        totalCell.innerHTML = `
            <span>Végösszeg: Hiba történt</span>
        `;
        card.appendChild(totalCell);
    });

        // A kártya hozzáadása a fő listához
        tbody.appendChild(card);
    });
}
