const btnLogout = document.getElementsByClassName('icon-logout')[0];
const btnProfile = document.getElementsByClassName('icon-user')[0];
const btnCart = document.getElementsByClassName('icon-cart')[0];

const katElements = Array.from(document.getElementsByClassName('kat'));





window.addEventListener('DOMContentLoaded', getCategories)
window.addEventListener('DOMContentLoaded', getProducts)
window.addEventListener('DOMContentLoaded', fetchCartTotalQuantity)

katElements.forEach(kat => {
    kat.addEventListener('click', () => {
        window.location.href = '../kategoria.html';
    });
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



function toggleCartDisplay() {
    if (window.matchMedia("(max-width: 768px)").matches) { // Csak mobil nézetben
        document.querySelector(".input").addEventListener("mouseover", function() {
            document.querySelector(".icon-cart").style.display = "none";
            document.querySelector(".icon-user").style.display = "none";
            document.querySelector(".icon-logout").style.display = "none";
        });

        document.querySelector(".input").addEventListener("mouseout", function() {
            document.querySelector(".icon-cart").style.display = "";
            document.querySelector(".icon-user").style.display = "";
            document.querySelector(".icon-logout").style.display = "";
        });
    }
}

// Betöltéskor ellenőrizzük
toggleCartDisplay();

// Ha a képernyőméret változik, frissítjük
window.addEventListener("resize", toggleCartDisplay);




btnProfile.addEventListener('click', () => {
    window.location.href = '../profile.html';
})

btnLogout.addEventListener('click', logout);


btnCart.addEventListener('click', () => {
    window.location.href = '../cart.html';
});





async function getProducts() {
    const res = await fetch('/api/products', {
        method: 'GET',
        credentials: 'include'
    })


    const products = await res.json();
    console.log(products);
    renderProducts(products);
}


function renderProducts(products) {
    const row = document.getElementsByClassName('row')[0];
    row.innerHTML = '';

    for (const product of products) {
        // card div létrehozása
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');

        // fejléc
        const cardHeaderDiv = document.createElement('div');
        cardHeaderDiv.classList.add('card-header');
        //cardHeaderDiv.textContent = product.name;

        // Kattintás esemény hozzáadása a kártya fejlécéhez
        

        // card body
        const cardBodyDiv = document.createElement('div');
        cardBodyDiv.classList.add('card-body');
        cardBodyDiv.addEventListener('click', () => {
            // Navigálás a teszt.html oldalra a termék id-jával
            window.location.href = `../teszt.html?product_id=${product.product_id}`;
        });

        const cardPic = document.createElement('div');
        cardPic.classList.add('pic-div');

        const cardBodyImg = document.createElement('img');
        cardBodyImg.src = `/uploads/${product.pic}`;

        cardPic.append(cardBodyImg);
        cardBodyDiv.append(cardPic);

        // card footer
        const cardFooterDiv = document.createElement('div');
        cardFooterDiv.classList.add('card-footer');

        const markaDiv = document.createElement('div');
        markaDiv.classList.add('marka');

        const termek_nev = document.createElement('div');
        termek_nev.classList.add('termek-nev');
        termek_nev.textContent = `${product.name}`;

        const price = document.createElement('div');
        price.classList.add('price');
        price.textContent = `${product.price} HUF`;

        const cart = document.createElement('div');
        cart.classList.add('cart');
        cart.textContent = `kosárhoz ad`;
        cart.addEventListener('click', () => addToCart(product.product_id, 1));

        cardFooterDiv.append(markaDiv);
        cardFooterDiv.append(termek_nev);
        cardFooterDiv.append(price);
        cardFooterDiv.append(cart);

        cardDiv.append(cardHeaderDiv, cardBodyDiv, cardFooterDiv);
        row.append(cardDiv);
    }
}



//kategoriak
async function getCategories() {
    try {
        const res = await fetch('/api/categories', {
            method: 'GET',
            credentials: 'include'
        });

        if (!res.ok) {
            throw new Error('Hiba a kategóriák lekérésekor');
        }

        const categories = await res.json();
        console.log(categories);
        renderCategories(categories);
    } catch (error) {
        console.error('Hiba:', error);
    }
}

function renderCategories(categories) {
    const container = document.getElementsByClassName('kategoria')[0];
    container.innerHTML = '';

    for (const category of categories) {
        // Kategória név (linkként megjelenítve)
        const categoryLink = document.createElement('a');
        categoryLink.classList.add('kat');
        categoryLink.textContent = category.name;
        categoryLink.href = '#'; // Megakadályozza az oldal újratöltését

        // Kattintás esemény hozzáadása
        categoryLink.addEventListener('click', (event) => {
            event.preventDefault(); // Alapértelmezett link működésének megakadályozása
            getProductsByCategory(category.name);
        });

        container.appendChild(categoryLink);
    }
}

async function getProductsByCategory(categoryName) {
    try {
        const res = await fetch(`/api/getProductsByCategory?category=${encodeURIComponent(categoryName)}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!res.ok) {
            throw new Error(`Hiba a termékek lekérésekor (${categoryName})`);
        }

        const products = await res.json();
        console.log(`Termékek (${categoryName}):`, products);
        renderProducts(products); // Ha szeretnéd megjeleníteni a termékeket
    } catch (error) {
        console.error('Hiba:', error);
    }
}







//termék kosárhoz adása
async function addToCart(product_id, quantity = 1) {
    try {
        const response = await fetch('/api/addCart/', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ product_id, quantity })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Hiba történt a termék kosárba helyezésekor.');
        }

        Swal.fire({
            position: "center",
            icon: "success",
            title: data.message,
            showConfirmButton: false,
            timer: 1500,
            theme: 'dark'
        });
        
        fetchCartTotalQuantity();
    } catch (error) {
        console.error('Hiba a kosárhoz adás során:', error);
        // alert(error.message);
        Swal.fire({
            title: "Hiba",
            text: error.message,
            icon: "error",
            theme: 'dark'
        });
    }
}





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



//keresés

const txttxt = document.getElementById('search1');
const search_form = document.getElementById('search_form');

search_form.addEventListener('submit', (event) => {
    event.preventDefault();
});

txttxt.addEventListener('input', () => {
    searchingProduct(txttxt.value);
});


async function searchingProduct(searchQuery) {
    console.log(searchQuery);

    const res = await fetch(`/api/search/${searchQuery}`, {
        method: 'GET',
        headers: {
            'content-type': 'application/json'
        },
        credentials: 'include'
    });

    const data = await res.json();
    console.log(data);

    renderProducts(data);
    if (txttxt.value=== 0){
        getProducts();
    }

}

async function fetchCartTotalQuantity() {
    try {
        const response = await fetch('/api/getCartTotalQuantity', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'

        });
        
        if (!response.ok) {
            throw new Error('Hiba a kosár mennyiségének lekérdezésekor');
        }

        const data = await response.json();
        console.log(data);
        const cartindex = document.getElementsByClassName('cart_index')[0];
        cartindex.textContent= data.total_quantity;
    } catch (error) {
        console.error(error);
    }
}
