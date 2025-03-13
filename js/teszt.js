const btnLogout = document.getElementsByClassName('icon-logout')[0];
const btnProfile = document.getElementsByClassName('icon-user')[0];
const btnCart = document.getElementsByClassName('icon-cart')[0];
const btnAddToCart = document.getElementsByClassName('add-to-cart-btn')[0];
const btnMenuLogo = document.getElementsByClassName('menu-logo')[0];

btnLogout.addEventListener('click', () => {
    window.location.href = '../index.html';
});

btnProfile.addEventListener('click', () => {
    window.location.href = '../profile.html';
});

btnCart.addEventListener('click', () => {
    window.location.href = '../cart.html';
});

btnMenuLogo.addEventListener('click', () => {
    window.location.href = '../home.html';
});

window.addEventListener('DOMContentLoaded', getProduct)

// Termék azonosító kinyerése az URL-ből
const urlParams2 = new URLSearchParams(window.location.search);
const product_id2 = urlParams2.get('product_id');

// Gomb kiválasztása és eseményfigyelő hozzáadása
document.addEventListener('DOMContentLoaded', () => {
    const addToCartButton = document.querySelector('.add-to-cart-btn');

    if (addToCartButton) {
        addToCartButton.addEventListener('click', () => {
            if (product_id2) {
                addToCart(product_id2); // A termék azonosító átadása a függvénynek
            } else {
                alert('Hiba: A termék azonosítója nem található.');
                Swal.fire({
                    title: "Hiba",
                    text:"A termék azonosítója nem található.",
                    icon: "error",
                    theme: 'dark'
                });
            }
        });
    }
});

async function getProduct() {
    // Az URL-ből lekérjük a product_id értékét
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('product_id');

    if (!id) {
        console.error("Nincs megadva product_id az URL-ben.");
        return;
    }
    console.log("Lekért termék ID:", id);

    try {
        // Módosított végpont és helyes GET kérés használata query paraméterrel
        const res = await fetch(`/api/getItem?id=${id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!res.ok) {
            throw new Error(`Hiba a lekérés során: ${res.status}`);
        }

        const product = await res.json();
        console.log("Kapott termék adatok:", product);

        renderProduct(product); // A termék megjelenítésére szolgáló függvény
    } catch (error) {
        console.error("Hiba történt:", error);
    }
}

function renderProduct(product) {
    // Fő container kiválasztása
    const container = document.querySelector('.container');
    container.innerHTML = '';

    // Fő div létrehozása
    const productDetail = document.createElement('div');
    productDetail.classList.add('product-detail');

    // Kép rész
    const productImage = document.createElement('div');
    productImage.classList.add('product-image');
    
    const picDiv = document.createElement('div');
    picDiv.classList.add('pic-div');
    
    const img = document.createElement('img');
    img.src = `/uploads/${product.pic || 'default.jpg'}`;
    img.alt = 'Product Image';
    img.classList.add('large-product-img');
    img.id = 'iemg';
    
    picDiv.appendChild(img);
    productImage.appendChild(picDiv);

    // Termék információk
    const productInfo = document.createElement('div');
    productInfo.classList.add('product-info');

    const probaDiv = document.createElement('div');
    probaDiv.classList.add('proba');
    
    const title = document.createElement('h2');
    title.textContent = product.name || '-';
    
    const description = document.createElement('p');
    description.classList.add('product-description');
    description.textContent = product.description || '-';
    
    probaDiv.appendChild(title);
    probaDiv.appendChild(description);

    // Specifikációk létrehozása
    const productSpecs = document.createElement('div');
    productSpecs.classList.add('product-specs');

    const columns = [document.createElement('div'), document.createElement('div'), document.createElement('div')];
    columns.forEach((col, index) => {
        col.classList.add('specs-column');
        if (index === 2) {
            col.id = 'specs-column2';
        }
    });

    const specsData = [
        ['Jelátvitel', product.Jelátvitel],
        ['Max. működési idő', product.Max_működési_idő],
        ['Hordhatósági változatok', product.Hordhatósági_változatok],
        ['Termék típusa', product.Termék_típusa],
        ['Kivitel', product.Kivitel],
        ['Bluetooth verzió', product.Bluetooth_verzió],
        ['Hangszóró-meghajtók', product.Hangszóró_meghajtók],
        ['Szín', product.Szín],
        ['Csatlakozók', product.Csatlakozók],
        ['Bluetooth', product.Bluetooth],
        ['Frekvenciaátvitel', product.Frekvenciaátvitel],
        ['Érzékenység', product.Érzékenység]
    ];

    specsData.forEach((spec, index) => {
        const [title, value] = spec;
        const h3 = document.createElement('h3');
        h3.textContent = title;
        const p = document.createElement('p');
        p.textContent = value || '-';
        columns[index % 3].appendChild(h3);
        columns[index % 3].appendChild(p);
    });

    columns.forEach(col => productSpecs.appendChild(col));

    // Kosárba rakom gomb és ár egymás mellett
    const priceAndBtnContainer = document.createElement('div');
    priceAndBtnContainer.classList.add('price-and-btn-container');
    priceAndBtnContainer.style.display = 'flex';
    priceAndBtnContainer.style.alignItems = 'center';
    priceAndBtnContainer.style.gap = '20px'; // Különbözet a gomb és az ár között

    // Ár
    const priceDisplay = document.createElement('p');
    priceDisplay.classList.add('product-price');
    priceDisplay.textContent = `Ár: ${product.price ? `${product.price} Ft` : 'N/A'}`;
    
    // Kosárba rakom gomb
    const addToCartBtn = document.createElement('button');
    addToCartBtn.classList.add('add-to-cart-btn');
    addToCartBtn.textContent = 'Kosárba rakom';
    addToCartBtn.addEventListener('click', () => addToCart(product.product_id, 1));

    priceAndBtnContainer.appendChild(priceDisplay);
    priceAndBtnContainer.appendChild(addToCartBtn);

    // Összeállítás
    productInfo.appendChild(probaDiv);
    productInfo.appendChild(productSpecs);
    productInfo.appendChild(priceAndBtnContainer); // Ár és gomb egy sorban

    productDetail.appendChild(productImage);
    productDetail.appendChild(productInfo);
    container.appendChild(productDetail);

    // Cursor követés a képen
    let imgcursor = document.getElementById("iemg");

    imgcursor.onmousemove = function(e) {
        e.target.style.setProperty('--x', (100 * e.offsetX / e.target.offsetWidth) + '%');
        e.target.style.setProperty('--y', (100 * e.offsetY / e.target.offsetHeight) + '%');
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

// termék kosárhoz adása
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

        // Displaying success message with product price
        const message = `${data.message} - Ár: ${data.price} Ft`;

        Swal.fire({
            position: "center",
            icon: "success",
            title: message,
            showConfirmButton: false,
            timer: 1500,
            theme: 'dark'
        });
    } catch (error) {
        console.error('Hiba a kosárhoz adás során:', error);
        //alert(error.message);
        Swal.fire({
            title: error.message,
            icon: "error",
            theme: 'dark'
        });
    }
}
