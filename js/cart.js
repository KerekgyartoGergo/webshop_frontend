const btnLogout =document.getElementsByClassName('icon-logout')[0];
const btnProfile =document.getElementsByClassName('icon-user')[0];
const btnMenuLogo = document.getElementsByClassName('menu-logo')[0];
const btnFolytatas = document.getElementsByClassName('continue-btn')[0];

window.addEventListener('DOMContentLoaded', getCartItems);
window.addEventListener('DOMContentLoaded', getCartTotal);

btnLogout.addEventListener('click', logout);



btnMenuLogo.addEventListener('click', ()=>{
    window.location.href='../home.html';
});

btnFolytatas.addEventListener('click', ()=>{
    window.location.href='../checkout.html';
});

btnProfile.addEventListener('click', ()=>{
    window.location.href='../profile.html';
});






async function getCartItems() {
    const res = await fetch('/api/getCartItems', {
        method: 'GET',
        credentials: 'include'
    });

    const cartItems = await res.json();
    console.log(cartItems);
    renderCartItems(cartItems);
}

function renderCartItems(cartItems) {
    const row = document.getElementsByClassName('row')[0];
    row.innerHTML = ''; // Töröljük a korábbi elemeket

    for (const item of cartItems) {
        // Fő kártya div létrehozása
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');

        // Termékkép
        const cardImg = document.createElement('img');
        cardImg.src = `/uploads/${item.product_image}`;
        cardImg.alt = 'Termék Képe';
        cardImg.classList.add('card-image');

        // Tartalom div
        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');

        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = item.product_name;

        cardContent.appendChild(cardText);

        // Akciók div
        const cardActions = document.createElement('div');
        cardActions.classList.add('card-actions');

        const cardPrice = document.createElement('span');
        cardPrice.classList.add('card-price');
        cardPrice.textContent = `${item.price} Ft`;

        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.classList.add('card-quantity');
        quantityInput.value = item.quantity;
        quantityInput.min = 1;
        quantityInput.dataset.cartItemId = item.cart_item_id; // Adunk egy adatattribútumot az elemhez

        // Eseménykezelő a mennyiség változására
        quantityInput.addEventListener('change', (e) => {
            const newQuantity = e.target.value;
            updateCartItemQuantity(item.cart_item_id, newQuantity); // Frissítjük a kosár mennyiségét
        });

        quantityInput.addEventListener('change', () => updateCartItem(item.product_id, quantityInput.value));

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('card-delete');
        deleteButton.textContent = 'Törlés';
        deleteButton.addEventListener('click', () => deleteItemFromCart(item.product_id));

        cardActions.append(cardPrice, quantityInput, deleteButton);

        // Kártya div összeállítása
        cardDiv.append(cardImg, cardContent, cardActions);
        row.appendChild(cardDiv);
    }
}




function updateCartItem(productId, newQuantity) {
    fetch('/api/updateCart/', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ product_id: productId, quantity: parseInt(newQuantity, 10) })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            // alert(data.error);
            Swal.fire({
                title: "Hiba",
                text: data.error,
                icon: "error",
                theme: 'dark'
            });
        } else {
            console.log('Mennyiség frissítve:', data);

            getCartTotal(); // Új végösszeg lekérése
            getCartItems();
        }
    })
    .catch(error => {
        console.error('Hiba a frissítés közben:', error);
        Swal.fire({
            title: "Hálózati hiba",
            text: "Hiba történt a frissítés közben.",
            icon: "error",
            theme: 'dark'
        });
    });
}

async function deleteItemFromCart(productId) {
    const confirmDelete = await Swal.fire({
        title: "Biztosan törölni akarod?",
        text: "Ez a művelet nem vonható vissza!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Igen, törlöm",
        cancelButtonText: "Mégse",
        theme: 'dark'
    });

    if (confirmDelete.isConfirmed) {
        try {
            const res = await fetch('/api/deleteCart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ product_id: productId }),
                credentials: 'include'
            });

            const data = await res.json();

            if (res.ok) {
                // alert('Termék sikeresen törölve a kosárból');
                Swal.fire({
                    title: "Termék törölve",
                    text: "A termék sikeresen törölve lett a kosárból.",
                    icon: "success",
                    theme: 'dark'
                });
                renderCartItems(data.cartItems);  // Közvetlenül újrarendereljük a kosarat
                getCartTotal(); // Új végösszeg lekérése
            } else if (data.error) {
                // alert(data.error);
                Swal.fire({
                    title: "Hiba",
                    text: data.error,
                    icon: "error",
                    theme: 'dark'
                });
            } else {
                // alert('Ismeretlen hiba történt');
                Swal.fire({
                    title: "Ismeretlen hiba",
                    text: "Valami hiba történt, próbáld újra.",
                    icon: "error",
                    theme: 'dark'
                });
            }
        } catch (error) {
            console.error('Hálózati hiba történt:', error);
            Swal.fire({
                title: "Hálózati hiba",
                text: "Nem sikerült kapcsolódni a szerverhez.",
                icon: "error",
                theme: 'dark'
            });
        }
    } else {
        // alert('A törlési művelet megszakítva');
        Swal.fire({
            title: "Művelet megszakítva",
            text: "A törlési művelet nem lett végrehajtva.",
            icon: "info",
            theme: 'dark'
        });
    }
}















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

async function deleteItemFromCart(productId) {
    if (await Swal.fire({
        title: "Biztosan törölni akarod a terméket a kosárból?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Igen, törlöm",
        cancelButtonText: "Mégse",
        theme: 'dark'
    }).then(result => result.isConfirmed)) {
        try {
            const res = await fetch('/api/deleteCart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ product_id: productId, quantity: 1 }),
                credentials: 'include'
            });

            let data;
            try {
                data = await res.json();
            } catch (err) {
                console.error('JSON parsing error:', err);
                data = { error: 'Nem lehetett beolvasni a választ JSON formátumban' };
            }

            console.log(data);

            if (res.ok) {
                // alert('Termék sikeresen törölve a kosárból');
                Swal.fire({
                    title: "Termék sikeresen törölve a kosárból",
                    icon: "success",
                    theme: 'dark'
                }).then(() => {
                    window.location.reload();
                    getProducts();
                });
            } else if (data.error) {
                // alert(data.error);
                Swal.fire({
                    title: data.error,
                    icon: "error",
                    theme: 'dark'
                });
            } else {
                // alert('Ismeretlen hiba történt');
                Swal.fire({
                    title: "Ismeretlen hiba történt",
                    icon: "error",
                    theme: 'dark'
                });
            }
        } catch (error) {
            console.error('Hálózati hiba történt:', error);
            // alert('Hálózati hiba történt');
            Swal.fire({
                title: "Hálózati hiba történt",
                icon: "error",
                theme: 'dark'
            });
        }
    } else {
        // alert('A törlési művelet megszakítva');
        Swal.fire({
            title: "A törlési művelet megszakítva",
            icon: "info",
            theme: 'dark'
        });
    }
}



//végösszeg

async function getCartTotal() {
    try {
        const res = await fetch('/api/getCartTotal', {
            method: 'GET',
            credentials: 'include'  // Az autentikációhoz szükséges sütik (cookies) átadása
        });

        // Ha a válasz nem OK, hibát dobunk
        if (!res.ok) {
            throw new Error('Hiba történt a válasz során');
        }

        const data = await res.json(); // JSON válasz beolvasása
        console.log(data);

        // Ha van 'total_price' az API válaszban, akkor frissítjük az összes szekciót
        if (data.total_price !== undefined) {
            updateOrderSummary(data.total_price); // Rendeljük hozzá az összeghez
        } else {
            console.error(data.error); // Hibák megjelenítése konzolon
            updateOrderSummary(0); // Ha hiba történik, nulla összeggel folytatjuk
        }
    } catch (error) {
        console.error(error); // Hálózati hibák vagy bármilyen más hiba kezelése
        updateOrderSummary(0); // Ha hiba történt, nulla összeggel folytatjuk
    }
}

// Funkció a rendelési összeg frissítésére
function updateOrderSummary(cartTotal) {
    const deliveryCost = 1200; // Szállítási költség

    // Győződjünk meg róla, hogy mindkét érték szám típusú
    const cartTotalAmount = parseFloat(cartTotal) || 0;  // Kosár összegének biztosítása számként
    const deliveryCostAmount = parseFloat(deliveryCost) || 0; // Szállítási költség biztosítása számként

    // Kiszámítjuk a végösszeget (kosár összeg + szállítási költség)
    const totalAmount = cartTotalAmount + deliveryCostAmount;

    // Frissítjük az összeg szövegeit
    document.getElementById('vegosszeg').textContent = `Összeg: ${cartTotalAmount} Ft`;  // Kosár összegének frissítése
    document.querySelector('.summary p:nth-child(2)').textContent = `Szállítási költség: ${deliveryCostAmount} Ft`;  // Szállítási költség frissítése

    // A végösszeg most a kosár összeg és a szállítási költség összeadva
    document.querySelector('.total p').textContent = `Végösszeg: ${totalAmount} Ft`;  // Végösszeg frissítése
}