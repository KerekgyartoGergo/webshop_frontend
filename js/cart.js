const btnLogout = document.getElementsByClassName('icon-logout')[0];
const btnProfile = document.getElementsByClassName('icon-user')[0];
const btnMenuLogo = document.getElementsByClassName('menu-logo')[0];
const btnFolytatas = document.getElementsByClassName('continue-btn')[0];

window.addEventListener('DOMContentLoaded', getCartItems);
window.addEventListener('DOMContentLoaded', getCartTotal);

btnLogout.addEventListener('click', logout);

btnMenuLogo.addEventListener('click', () => {
    window.location.href = '../home.html';
});

btnFolytatas.addEventListener('click', () => {
    window.location.href = '../checkout.html';
});

btnProfile.addEventListener('click', () => {
    window.location.href = '../profile.html';
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
        deleteButton.addEventListener('click', async () => {
            // SweetAlert törlés előtti megerősítés
            const result = await Swal.fire({
                title: 'Biztosan törölni szeretnéd a terméket?',
                text: "Ez a művelet nem visszavonható!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Igen, törlés!',
                cancelButtonText: 'Mégse',
                reverseButtons: true
            });

            if (result.isConfirmed) {
                // Ha megerősítette a törlést, folytatjuk a törlés logikáját
                deleteItemFromCart(item.product_id);

                // SweetAlert sikeres törlés értesítés
                Swal.fire({
                    title: 'A termék sikeresen törölve!',
                    icon: 'success',
                    theme: 'dark'
                });
            }
        });

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
            // alert(data.error); // Kommentelve, hogy ne zavarja a SweetAlert
            Swal.fire({
                title: data.error,
                icon: 'error',
                theme: 'dark'
            });
        } else {
            console.log('Mennyiség frissítve:', data);

            getCartTotal(); // Új végösszeg lekérése

            getCartItems();
        }
    })
    .catch(error => {
        // console.error('Hiba a frissítés közben:', error); // Kommentelve, hogy ne zavarja a SweetAlert
        Swal.fire({
            title: 'Hiba a frissítés közben',
            text: error.message,
            icon: 'error',
            theme: 'dark'
        });
    });
}

async function deleteItemFromCart(productId) {
    if (confirm('Biztosan törölni akarod a terméket a kosárból?')) {
        try {
            const res = await fetch('/api/deleteCart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ product_id: productId }), // A törlendő termék
                credentials: 'include'
            });

            const data = await res.json();

            if (res.ok) {
                // alert('Termék sikeresen törölve a kosárból'); // Kommentelve, hogy ne zavarja a SweetAlert
                Swal.fire({
                    title: 'Termék sikeresen törölve a kosárból',
                    icon: 'success',
                    theme: 'dark'
                });

                // Frissítjük a kosár tartalmát közvetlenül a DOM-ban
                renderCartItems(data.cartItems);  // Közvetlenül újrarendereljük a kosarat
                getCartTotal(); // Új végösszeg lekérése
            } else if (data.error) {
                // alert(data.error); // Kommentelve, hogy ne zavarja a SweetAlert
                Swal.fire({
                    title: data.error,
                    icon: 'error',
                    theme: 'dark'
                });
            } else {
                // alert('Ismeretlen hiba történt'); // Kommentelve, hogy ne zavarja a SweetAlert
                Swal.fire({
                    title: 'Ismeretlen hiba történt',
                    icon: 'error',
                    theme: 'dark'
                });
            }
        } catch (error) {
            // console.error('Hálózati hiba történt:', error); // Kommentelve, hogy ne zavarja a SweetAlert
            Swal.fire({
                title: 'Hálózati hiba történt',
                text: error.message,
                icon: 'error',
                theme: 'dark'
            });
        }
    } else {
        // alert('A törlési művelet megszakítva'); // Kommentelve, hogy ne zavarja a SweetAlert
        Swal.fire({
            title: 'A törlési művelet megszakítva',
            icon: 'info',
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

async function logout(){
    const res =await fetch('/api/logout',{
        method:'POST',
        credentials: 'include'
    });

    const data =await res.json();

    if(res.ok){
        // Commented out original alert
        // alert(data.message);

        // SweetAlert version
        Swal.fire({
            title: data.message,  // Use the message from the response
            icon: "success",
            theme: 'dark'
        });

        window.location.href='../index.html';
    }else{
        // Commented out original alert
        // alert('Hiba a kijelentkezéskor!');

        // SweetAlert version for error
        Swal.fire({
            title: 'Hiba a kijelentkezéskor!',
            icon: 'error',
            theme: 'dark'
        });
    }
}





// termék törlését a kosárból
async function deleteItemFromCart(productId) {
    // Kommentáltuk a régi alertet és confirmot, hogy helyette SweetAlert-tel dolgozzunk.
    // if (confirm('Biztosan törölni akarod a terméket a kosárból?')) {
    Swal.fire({
        title: 'Biztosan törölni akarod a terméket a kosárból?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Igen, törlöm',
        cancelButtonText: 'Mégse',
        reverseButtons: true,
        theme: 'dark'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await fetch('/api/deleteCart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ product_id: productId, quantity: 1 }), // A törlendő termék és mennyiség
                    credentials: 'include' // Hitelesítési adatok automatikus küldése (ha szükséges)
                });

                // Válasz adatainak beolvasása JSON formátumban
                let data;
                try {
                    data = await res.json();
                } catch (err) {
                    // Ha a JSON parsing hiba, naplózunk
                    console.error('JSON parsing error:', err);
                    data = { error: 'Nem lehetett beolvasni a választ JSON formátumban' };
                }

                console.log(data);

                if (res.ok) {
                    Swal.fire({
                        title: "Termék sikeresen törölve a kosárból",
                        icon: "success",
                        theme: 'dark'
                    });
                    // Itt hívhatod a kosár frissítésére szolgáló funkciót, ha szükséges
                    window.location.reload();
                    getProducts(); // Feltételezem, hogy van egy getProducts függvény a kosár frissítésére
                } else if (data.error) {
                    Swal.fire({
                        title: data.error,
                        icon: "error",
                        theme: 'dark'
                    });
                } else {
                    Swal.fire({
                        title: 'Ismeretlen hiba történt',
                        icon: 'error',
                        theme: 'dark'
                    });
                }
            } catch (error) {
                console.error('Hálózati hiba történt:', error);
                Swal.fire({
                    title: 'Hálózati hiba történt',
                    icon: 'error',
                    theme: 'dark'
                });
            }
        } else {
            Swal.fire({
                title: 'A törlési művelet megszakítva',
                icon: 'info',
                theme: 'dark'
            });
        }
    });
    // } else {
    //     alert('A törlési művelet megszakítva');
    // }
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
