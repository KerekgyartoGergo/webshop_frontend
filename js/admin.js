window.addEventListener('DOMContentLoaded',getUsers);
window.addEventListener('DOMContentLoaded', getProducts);
window.addEventListener('DOMContentLoaded', getCategories);



const btnLogout =document.getElementsByClassName ('icon-logout')[0];

btnLogout.addEventListener('click', logout);

async function logout(){
    const res =await fetch('/api/logout',{
        method:'POST',
        credentials: 'include'
    });

    const data =await res.json();

    if(res.ok){
        //alert(data.message);
        Swal.fire({
            text: data.message,
            theme: 'dark'

          });        window.location.href='../index.html';
    }else{
        //alert('Hiba a kijelentkezéskor!')
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Hiba a kijelentkezéskor!",
            theme: 'dark'

          });
    }
}






async function getUsers () {
    const res = await fetch('/api/users', {
        method: 'GET',
        credentials: 'include'
    })


    const users= await res.json();
    console.log(users);
    renderUsers(users);
}






function renderUsers(users) {
    const tbody = document.querySelector('.usersList');
    tbody.innerHTML = '';

    users.forEach((user, index) => {
        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.textContent = user.user_id;

        const tdName = document.createElement('td');
        tdName.textContent = user.user_name;

        const tdEmail = document.createElement('td');
        tdEmail.textContent = user.email;

        const tdRole = document.createElement('td');
        tdRole.textContent = user.role;
        tdRole.id='role';

        const tdActions = document.createElement('td');
        const gombokDiv = document.createElement('div');
        gombokDiv.classList.add('gombok');

        
        const editButton = document.createElement('button');
        editButton.classList.add('edit');
        editButton.textContent = 'User <==> Admin';
        editButton.id='editbtn';
        editButton.addEventListener('click', () => editUser(user.user_id)); // Event listener a szerkeztéshez
        

        // Feltételes ellenőrzés a role és az editButton szövegének beállításához
        if (tdRole.textContent === 'user') {
            editButton.textContent = 'User <==> Admin';
        } else if (tdRole.textContent === 'admin') {
            editButton.textContent = 'Admin <==> User';
        }



        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete');
        deleteButton.textContent = 'Törlés';
        deleteButton.addEventListener('click', () => deleteUser(user.user_id)); // Event listener a törléshez

        tdActions.append(editButton, deleteButton);

        tdActions.appendChild(gombokDiv);
        gombokDiv.appendChild(editButton);
        gombokDiv.appendChild(deleteButton);

        
        tr.append(tdIndex, tdName, tdEmail, tdRole, tdActions);
        tbody.appendChild(tr);
    });
}


//felhasználó törlése
async function deleteUser(userId) {
    const result = await Swal.fire({
        title: "Biztosan törölni akarod a felhasználót?",
        text: "Ez a művelet nem vonható vissza!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Igen, törlöm!",
        cancelButtonText: "Mégse",
        theme: 'dark'
        });

    if (result.isConfirmed) {
        try {
            const res = await fetch('/api/deleteUser', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: userId }),
                credentials: 'include' // Hitelesítési adatok automatikus küldése
            });

            console.log('HTTP status:', res.status);
            
            let data;
            try {
                data = await res.json();
            } catch (err) {
                console.error('JSON parsing error:', err);
                data = { error: 'Nem lehetett beolvasni a választ JSON formátumban' };
            }
            
            console.log(data);

            if (res.ok) {
                Swal.fire({
                    title: "Felhasználó sikeresen törölve",
                    icon: "success",
                    theme: 'dark'
                });
                getUsers();
            } else if (data.error) {
                Swal.fire({
                    title: data.error,
                    icon: "error",
                    theme: 'dark'
                });
            } else {
                Swal.fire({
                    title: "Ismeretlen hiba",
                    icon: "error",
                    theme: 'dark'
                });
            }
        } catch (error) {
            console.error('Hálózati hiba történt:', error);
            Swal.fire({
                title: "Hálózati hiba történt",
                icon: "error",
                theme: 'dark'
            });
        }
    } else {
        Swal.fire({
            title: "A törlési művelet megszakítva",
            icon: "info",
            theme: 'dark'
        });
    }
}

//felhasználó szerkeztése


async function editUser(userId) {
    try {
        const res = await fetch('/api/updateUserRole', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: userId }),
            credentials: 'include' // Hitelesítési adatok automatikus küldése
        });

        // Naplózás a válasz előtt
        console.log('HTTP status:', res.status);
        
        // Megpróbáljuk beolvasni a válasz adatokat JSON formátumban
        let data;
        try {
            data = await res.json();
        } catch (err) {
            // Ha a JSON parsing hibát okoz, naplózunk és feltételezhetjük, hogy a válasz nem JSON formátumú
            console.error('JSON parsing error:', err);
            data = { error: 'Nem lehetett beolvasni a választ JSON formátumban' };
        }
        
        console.log(data);

        if (res.ok) {
            //alert('Szerepkör sikeresen frissítve');
            Swal.fire({
                title: "Szerepkör sikeresen frissítve",
                icon: "success",
                theme: 'dark'
            });
            getUsers();
            // További műveletek, például a felhasználó szerepkörének frissítése a felületen
        } else if (data.error) {
            //alert(data.error);
            Swal.fire({
                title: data.error,
                icon: "error",
                theme: 'dark'
            });
        } else {
            //alert('Ismeretlen hiba');
            Swal.fire({
                title: "Ismeretlen hiba",
                icon: "error",
                theme: 'dark'
            });
        }
    } catch (error) {
        console.error('Hálózati hiba történt:', error);
        //alert('Hálózati hiba történt');
        Swal.fire({
            title: "Hálózati hiba történt!",
            icon: "error",
            theme: 'dark'
        });
    }
}





//termékek lekérése
async function getProducts () {
    const res = await fetch('/api/products', {
        method: 'GET',
        credentials: 'include'
    })


    const products= await res.json();
    console.log(products);
    renderProducts(products);
}


function renderProducts(products) {
    const tbody = document.querySelector('.productsList');
    tbody.innerHTML = ''; // Töröljük a tartalmat, hogy ne duplikálódjanak az elemek

    products.forEach((product) => {
        // Létrehozunk egy új sort a táblázatban
        const row = document.createElement('tr');

        // Termék azonosítója
        const idCell = document.createElement('td');
        idCell.textContent = product.product_id;
        row.appendChild(idCell);

        // Termék neve
        const nameCell = document.createElement('td');
        nameCell.textContent = product.name;
        row.appendChild(nameCell);

        // Termék ára
        const priceCell = document.createElement('td');
        priceCell.textContent = `${product.price} HUF`;
        row.appendChild(priceCell);

        // Termék leírása
        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = product.description || 'Nincs leírás';
        row.appendChild(descriptionCell);

        // Készlet (Stock)
        const stockCell = document.createElement('td');
        stockCell.textContent = product.stock;
        row.appendChild(stockCell);

        // Kategória azonosító (Category ID)
        const categoryCell = document.createElement('td');
        categoryCell.textContent = product.category_id;
        row.appendChild(categoryCell);

        // Termék képe
        const imageCell = document.createElement('td');
        const image = document.createElement('img');
        image.src = `/uploads/${product.pic}`;
        image.alt = product.name;
        imageCell.appendChild(image);
        row.appendChild(imageCell);

// Szerkesztés és törlés gombok
const actionsCell = document.createElement('td');
const gombokDiv = document.createElement('div');
gombokDiv.classList.add('gombok');

// Szerkesztés gomb
const editButton = document.createElement('button');
editButton.textContent = 'Szerkesztés';
editButton.classList.add('edit');
editButton.addEventListener('click', () => {
    openEditModal(product);
});

// Törlés gomb
const deleteButton = document.createElement('button');
deleteButton.textContent = 'Törlés';
deleteButton.classList.add('delete');
deleteButton.addEventListener('click', () => deleteItem(product.product_id));

// Részletek gomb - új gomb hozzáadása
const detailsButton = document.createElement('button');
detailsButton.textContent = 'Részletek';
detailsButton.classList.add('details');
detailsButton.addEventListener('click', () => {
    openEditModal2(product); // A megfelelő modalt nyitja meg
});

actionsCell.appendChild(gombokDiv);
gombokDiv.appendChild(editButton);
gombokDiv.appendChild(deleteButton);
gombokDiv.appendChild(detailsButton);  // Hozzáadjuk az új gombot
row.appendChild(actionsCell);

// Hozzáadjuk a sort a táblázathoz
tbody.appendChild(row);
    });
}




//termék törlése
async function deleteItem(productId) {
    const confirmResult = await Swal.fire({
        title: "Biztosan törölni akarod a terméket?",
        text: "Ez a művelet nem visszavonható!",
        icon: "warning",
        theme: "dark",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Igen, törlöm!",
        cancelButtonText: "Mégse"
    });

    if (confirmResult.isConfirmed) {
        try {
            const res = await fetch("/api/deleteProduct/" + productId, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            let data;
            try {
                data = await res.json();
            } catch (err) {
                console.error("JSON parsing error:", err);
                data = { error: "Nem lehetett beolvasni a választ JSON formátumban" };
            }

            console.log(data);

            if (res.ok) {
                Swal.fire({
                    title: "Termék sikeresen törölve",
                    icon: "success",
                    theme: "dark"
                });
                // alert("Termék sikeresen törölve");
                getProducts();
            } else if (data.error) {
                Swal.fire({
                    title: "Hiba!",
                    text: data.error,
                    icon: "error",
                    theme: "dark"
                });
                // alert(data.error);
            } else {
                Swal.fire({
                    title: "Hiba!",
                    text: "Ismeretlen hiba történt.",
                    icon: "error",
                    theme: "dark"
                });
                // alert("Ismeretlen hiba");
            }
        } catch (error) {
            console.error("Hálózati hiba történt:", error);
            Swal.fire({
                title: "Hálózati hiba!",
                text: "Nem sikerült csatlakozni a szerverhez.",
                icon: "error",
                theme: "dark"
            });
            // alert("Hálózati hiba történt");
        }
    } else {
        Swal.fire({
            title: "Művelet megszakítva",
            text: "A termék törlése nem történt meg.",
            icon: "info",
            theme: "dark"
        });
        // alert("A törlési művelet megszakítva");
    }
}




// Termék szerkesztése
const modal = document.getElementById("editModal");
const span = document.getElementsByClassName("close")[0];
let currentProductId = null;

span.addEventListener('click', () => {
    modal.style.display = "none";
});

async function fetchCategories() {
    try {
        const res = await fetch('/api/categories', { method: 'GET' });
        const categories = await res.json();

        const categorySelect = document.getElementById('category_id');
        categorySelect.innerHTML = '';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.category_id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Kategóriák betöltése sikertelen:', error);
    }
}

function openEditModal(product) {
    document.getElementById('name').value = product.name;
    document.getElementById('price').value = product.price;
    document.getElementById('description').value = product.description || '';
    document.getElementById('stock').value = product.stock || '';
    document.getElementById('category_id').value = product.category_id || '';
    document.getElementById('pic').src = `/uploads/${product.pic}`;
    
    currentProductId = product.product_id;
    fetchCategories();
    modal.style.display = "block";
}

document.getElementById("editForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    formData.append('id', currentProductId);

    try {
        const res = await fetch('/api/updateItem', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });
        
        const data = await res.json();

        if (res.ok) {
            Swal.fire({
                title: "Termék sikeresen frissítve",
                icon: "success",
                theme: "dark"
            });
            // alert('Termék sikeresen frissítve');
            getProducts();
            modal.style.display = "none";
        } else {
            Swal.fire({
                title: data.error || "Ismeretlen hiba",
                icon: "error",
                theme: "dark"
            });
            // alert(data.error || 'Ismeretlen hiba');
        }
    } catch (error) {
        console.error('Hálózati hiba történt:', error);
        Swal.fire({
            title: "Hálózati hiba!",
            icon: "error",
            theme: "dark"
        });
        // alert('Hálózati hiba történt');
    }
});

// Termék szerkesztés 2
const modal5 = document.getElementById("editModal5");
const closeBtn = document.querySelector(".close5");
let currentProductId4 = null;

closeBtn.addEventListener("click", () => {
    modal5.style.display = "none";
});

function openEditModal2(product) {
    ["Jelátvitel", "Max_működési_idő", "Hordhatósági_változatok", "Termék_típusa", "Kivitel", "Bluetooth_verzió", "Hangszóró_meghajtók", "Szín", "Csatlakozók", "Bluetooth", "Frekvenciaátvitel", "Érzékenység"].forEach(field => {
        document.getElementById(field).value = product[field] || '';
    });
    
    currentProductId4 = product.product_id;
    modal5.style.display = "block";
}

document.getElementById("editForm2").addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = {};
    ["Jelátvitel", "Max_működési_idő", "Hordhatósági_változatok", "Termék_típusa", "Kivitel", "Bluetooth_verzió", "Hangszóró_meghajtók", "Szín", "Csatlakozók", "Bluetooth", "Frekvenciaátvitel", "Érzékenység"].forEach(field => {
        formData[field] = document.getElementById(field).value;
    });
    formData.id = currentProductId4;

    try {
        const res = await fetch('/api/updateItemInfo', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
            credentials: 'include'
        });

        const data = await res.json();

        if (res.ok) {
            Swal.fire({
                title: "Termék sikeresen frissítve",
                icon: "success",
                theme: "dark"
            });
            // alert('Termék sikeresen frissítve');
            modal5.style.display = "none";
        } else {
            Swal.fire({
                title: data.error || "Ismeretlen hiba",
                icon: "error",
                theme: "dark"
            });
            // alert(data.error || 'Ismeretlen hiba');
        }
    } catch (error) {
        console.error('Hálózati hiba:', error);
        Swal.fire({
            title: "Hálózati hiba!",
            icon: "error",
            theme: "dark"
        });
        // alert('Hálózati hiba történt');
    }
});











//termék hozzáadása

const modal2 = document.getElementById("addModal");
const addProduct = document.getElementsByClassName('add')[0];
addProduct.addEventListener('click', () => {
    openAddModal();
});
const span2 = document.getElementsByClassName("close2")[0];

span2.addEventListener('click', () => {
    modal2.style.display="none";
});

// Kategóriák lekérése és betöltése a legördülő listába
async function fetchCategoriesForAdd() {
    try {
        const res = await fetch('/api/categories', { method: 'GET' });
        const categories = await res.json();

        const categorySelect = document.getElementById('add_category_id');
        categorySelect.innerHTML = ''; // Korábbi kategóriák törlése

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.category_id; // category_id érték
            option.textContent = category.name;  // category neve
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Kategóriák betöltése sikertelen:', error);
    }
}

function openAddModal() {
    // Alapértelmezett értékek beállítása az űrlap mezőiben
    document.getElementById('add_name').value = '';
    document.getElementById('add_price').value = '';
    document.getElementById('add_description').value = '';
    document.getElementById('add_stock').value = '';
    document.getElementById('add_category_id').value = '';
    document.getElementById('add_pic').value = '';  

    // Kategóriák betöltése
    fetchCategoriesForAdd();

    // Megjelenítjük a modalt
    modal2.style.display = "block";
}

// Hozzáadás form elküldése
document.getElementById("addForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    try {
        const res = await fetch('/api/addItem', {
            method: 'POST',
            body: formData,
            credentials: 'include' // Hitelesítési adatok automatikus küldése
        });

        console.log('HTTP status:', res.status);

        let data;
        try {
            data = await res.json();
        } catch (err) {
            console.error('JSON parsing error:', err);
            data = { error: 'Nem lehetett beolvasni a választ JSON formátumban' };
        }

        console.log(data);

        if (res.ok) {
            // alert('Termék sikeresen hozzáadva');
            Swal.fire({
                title: "Termék sikeresen hozzáadva",
                icon: "success",
                theme: 'dark'
            });
            getProducts(); // Frissítjük a termék listát
            modal2.style.display = "none";
        } else if (data.error) {
            // alert(data.error);
            Swal.fire({
                title: data.error,
                icon: "error",
                theme: 'dark'
            });
        } else {
            // alert('Ismeretlen hiba');
            Swal.fire({
                title: "Ismeretlen hiba",
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
});


const modal3 = document.getElementById("addCategorieModal");
const add_category = document.getElementsByClassName('add2')[0];
add_category.addEventListener('click', () => {
    openAddCategoryModal();
});
const span3 = document.getElementsByClassName("close3")[0];

span3.addEventListener('click', () => {
    modal3.style.display = "none";
});

function openAddCategoryModal() {
    document.getElementById('add_categorie_name').value = '';
    document.getElementById('add_categorie_description').value = '';

    // Megjelenítjük a modalt
    const modal = document.getElementById('addCategorieModal');
    modal.style.display = "block";
}

// Form submit esemény kezelése
document.getElementById("addCategorrieForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    // FormData létrehozása a form adatok küldéséhez
    const formData = {
        name: document.getElementById('add_categorie_name').value,
        description: document.getElementById('add_categorie_description').value
    };

    try {
        const res = await fetch('/api/addCategory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
            credentials: 'include'  // Hitelesítési adatok automatikus küldése
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
            // alert('Kategória sikeresen hozzáadva');
            Swal.fire({
                title: "Kategória sikeresen hozzáadva",
                icon: "success",
                theme: 'dark'
            });
            
            // getCategories();  // Frissítjük a kategórialistát
            const modal = document.getElementById('addCategorieModal');
            modal.style.display = "none";  // Bezárjuk a modalt
        } else if (data.error) {
            // alert(data.error);
            Swal.fire({
                title: "Hiba",
                text: data.error,
                icon: "error",
                theme: 'dark'
            });
        } else {
            // alert('Ismeretlen hiba');
            Swal.fire({
                title: "Ismeretlen hiba",
                icon: "warning",
                theme: 'dark'
            });
        }
    } catch (error) {
        console.error('Hálózati hiba történt:', error);
        // alert('Hálózati hiba történt');
        Swal.fire({
            title: "Hálózati hiba",
            text: "Nem sikerült csatlakozni a szerverhez.",
            icon: "error",
            theme: 'dark'
        });
    }
});







// Form submit esemény kezelése
document.getElementById("addForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    // FormData létrehozása a form adatok küldéséhez
    const formData = new FormData();
    formData.append('name', document.getElementById('add_name').value);
    formData.append('description', document.getElementById('add_description').value);
    formData.append('price', document.getElementById('add_price').value);
    formData.append('stock', document.getElementById('add_stock').value);
    formData.append('category_id', document.getElementById('add_category_id').value);
    formData.append('pic', document.getElementById('add_pic').files[0]); // Kép hozzáadása

    try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
            credentials: 'include'  // Hitelesítési adatok automatikus küldése
        });

        console.log('HTTP status:', res.status);
        
        let data;
        try {
            data = await res.json();
        } catch (err) {
            console.error('JSON parsing error:', err);
            data = { error: 'Nem lehetett beolvasni a választ JSON formátumban' };
        }

        console.log(data);

        if (res.ok) {
            // Kommentelt alert
            // alert('Termék sikeresen hozzáadva');
            
            Swal.fire({
                title: "Termék sikeresen hozzáadva",
                icon: "success",
                theme: 'dark'
            });

            getProducts();  // Frissítjük a terméklistát
            const modal = document.getElementById('addModal');
            modal.style.display = "none";  // Bezárjuk a modalt
            // További műveletek, például a termék hozzáadása a felülethez
        } else if (data.error) {
            // Kommentelt alert
            // alert(data.error);
            
            Swal.fire({
                title: "Hiba történt",
                text: data.error,
                icon: "error",
                theme: 'dark'
            });
        } else {
            // Kommentelt alert
            // alert('Ismeretlen hiba');
            
            Swal.fire({
                title: "Ismeretlen hiba",
                icon: "error",
                theme: 'dark'
            });
        }
    } catch (error) {
        console.error('Hálózati hiba történt:', error);
        
        // Kommentelt alert
        // alert('Hálózati hiba történt');
        
        Swal.fire({
            title: "Hálózati hiba történt",
            icon: "error",
            theme: 'dark'
        });
    }
});



async function getCategories() {
    const res = await fetch('/api/categories', {
        method: 'GET',
        credentials: 'include'
    });

    const categories = await res.json();
    console.log(categories);
    renderCategories(categories);
}

function renderCategories(categories) {
    const tbody = document.querySelector('.categoriesList');
    tbody.innerHTML = '';

    categories.forEach((category) => {
        const tr = document.createElement('tr');

        const tdIndex = document.createElement('td');
        tdIndex.textContent = category.category_id;

        const tdName = document.createElement('td');
        tdName.textContent = category.name;

        const tdDescription = document.createElement('td');
        tdDescription.textContent = category.description;

        const tdActions = document.createElement('td');
        const gombokDiv = document.createElement('div');
        gombokDiv.classList.add('gombok');

        const editButton = document.createElement('button');
        editButton.classList.add('edit');
        editButton.textContent = 'Szerkesztés';
        editButton.addEventListener('click', () => openEditCategoryModal(category));

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete');
        deleteButton.textContent = 'Törlés';
        deleteButton.addEventListener('click', async () => {
            // Kommentált figyelmeztetés:
            // if (confirm('Biztosan törölni szeretnéd ezt a kategóriát?')) {
            //     await deleteCategory(category.category_id);
            // }

            // SweetAlert figyelmeztetés:
            const result = await Swal.fire({
                title: 'Biztosan törölni szeretnéd ezt a kategóriát?',
                text: "Ez a művelet visszafordíthatatlan!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Igen',
                cancelButtonText: 'Mégse',
                reverseButtons: true,
                theme: 'dark'
            });

            if (result.isConfirmed) {
                await deleteCategory(category.category_id);
                Swal.fire({
                    title: "Kategória sikeresen törölve",
                    icon: "success",
                    theme: 'dark'
                });
            }
        });

        tdActions.append(editButton, deleteButton);
        tdActions.appendChild(gombokDiv);
        gombokDiv.appendChild(editButton);
        gombokDiv.appendChild(deleteButton);

        tr.append(tdIndex, tdName, tdDescription, tdActions);
        tbody.appendChild(tr);
    });
}


async function deleteCategory(categoryId) {
    try {
        const res = await fetch(`/api/deleteCategory/${categoryId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const data = await res.json();
        console.log(data);

        if (res.ok) {
            // SweetAlert használata a sikeres törléshez
            Swal.fire({
                title: "Kategória sikeresen törölve",
                icon: "success",
                theme: 'dark'
            });

            // A meglévő alert kommentált változata
            // alert('Kategória sikeresen törölve');
            
            getCategories(); // Frissítjük a listát
        } else {
            // SweetAlert használata a hibás törléshez
            Swal.fire({
                title: data.error || 'Hiba történt a törlés során',
                icon: "error",
                theme: 'dark'
            });

            // A meglévő alert kommentált változata
            // alert(data.error || 'Hiba történt a törlés során');
        }
    } catch (error) {
        console.error('Hálózati hiba:', error);
        // SweetAlert használata a hálózati hiba kezelésére
        Swal.fire({
            title: "Hálózati hiba történt",
            icon: "error",
            theme: 'dark'
        });

        // A meglévő alert kommentált változata
        // alert('Hálózati hiba történt');
    }
}

const modal4 = document.getElementById("editCategorieModal");
const span4 = document.getElementsByClassName("close4")[0];
let currentCategoryId = null;

span4.addEventListener('click', () => {
    modal4.style.display = "none";
});

function openEditCategoryModal(category) {
    console.log('Megnyitásra küldött kategória:', category, typeof category);

    if (typeof category !== "object" || category === null) {
        console.error("Hibás vagy hiányzó kategória adatok:", category);
        Swal.fire({
            title: "Hiba: A kategória adatai nem érhetők el.",
            icon: "error",
            theme: 'dark'
        });
        return;
    }
    console.log(category.name, category.description);

    document.getElementById('edit_categorie_name').value = category.name || '';
    document.getElementById('edit_categorie_description').value = category.description || '';

    currentCategoryId = category.category_id;

    console.log("Mentett category_id:", currentCategoryId);
    document.getElementById('cat_id').textContent = currentCategoryId;

    modal4.style.display = "block";
}

document.getElementById("editCategorrieForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    console.log('Elküldés előtt currentCategoryId:', currentCategoryId);
    const edit_categorie_name = document.getElementById('edit_categorie_name').value;
    const edit_categorie_description = document.getElementById('edit_categorie_description').value;
    const cat_id = Number(document.getElementById('cat_id').textContent);
    console.log(`asd: ${cat_id}`);

    try {
        const res = await fetch('/api/updateCategory', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ cat_id, edit_categorie_name, edit_categorie_description }),
            credentials: 'include' // Hitelesítési adatok automatikus küldése
        });

        console.log('HTTP status:', res.status);

        let data;
        try {
            data = await res.json();
        } catch (err) {
            console.error('JSON parsing error:', err);
            data = { error: 'Nem lehetett beolvasni a választ JSON formátumban' };
        }

        console.log(data);

        if (res.ok) {
            // SweetAlert használata a sikeres frissítéshez
            Swal.fire({
                title: "Kategória sikeresen frissítve",
                icon: "success",
                theme: 'dark'
            });

            // A meglévő alert kommentált változata
            // alert('Kategória sikeresen frissítve');
            
            getCategories(); // Frissítjük a kategóriák listáját
            modal4.style.display = "none";
            // További műveletek, például a kategória frissítése a felületen
        } else if (data.error) {
            // SweetAlert használata a hibaüzenethez
            Swal.fire({
                title: data.error,
                icon: "error",
                theme: 'dark'
            });

            // A meglévő alert kommentált változata
            // alert(data.error);
        } else {
            // SweetAlert használata az ismeretlen hiba kezelésére
            Swal.fire({
                title: "Ismeretlen hiba történt",
                icon: "error",
                theme: 'dark'
            });

            // A meglévő alert kommentált változata
            // alert('Ismeretlen hiba');
        }
    } catch (error) {
        console.error('Hálózati hiba történt:', error);
        // SweetAlert használata a hálózati hiba kezelésére
        Swal.fire({
            title: "Hálózati hiba történt",
            icon: "error",
            theme: 'dark'
        });

        // A meglévő alert kommentált változata
        // alert('Hálózati hiba történt');
    }
});
