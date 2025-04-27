# SoundWave Frontend/Weboldal Dokumentáció
A SoundWavet közösen Kerékgyártó Gergőval csináltuk, a cél az volt hogy minden fajta hangal kapcsolatos eszközt megtalálj 1 helyen, pl.: Fejhallgató, Mikrofon, Hangszóró.

A Soundwave egy lendületes és megbízható webshop, amely a minőségi hangzás szerelmeseit szolgálja ki. Legyen szó otthoni zenehallgatásról, stúdiófelvételekről vagy élő előadásokról, nálunk megtalálod a legjobb mikrofonokat, hangfalakat, fejhallgatókat és egyéb profi hangeszközöket. Válogatott kínálat, szakértői tanácsadás és szenvedély a hang iránt – a Soundwave-nél minden arról szól, hogy a hang élménnyé váljon. Fedezd fel a hullámokat, és találd meg a saját ritmusod!
Az oldalt itt tudod elérni --> https://soundwave2.netlify.app/index.html

## Készítette
- Kerékgyártó Gergő (Backend, SQL adatbázis, Frontend)
- Kovács Ákos (Frontend, SQL adatbázis)
- [GitHub repo (backend)](https://github.com/KerekgyartoGergo/webshop_backend.git)
- [GitHub repo (frontend)](https://github.com/KerekgyartoGergo/webshop_frontend.git)



# Tartalomjegyzék

## `Index.html` 
- **Itt betudsz lépni és regisztrálni:**:
![Index](https://snipboard.io/yJcEtL.jpg)


### Home az az a fő oldal amiről több különböző oldalra tudunk navigálni:
    -Kategóriák
    -Keresés
    -Kosár
    -Profil
    -Kijelentkezés
    -Footerek

## `Home.html` (Főoldal)


![Asztali nézet](https://snipboard.io/zCYJoe.jpg)
![Telefonos Nézet](https://snipboard.io/rWJfjQ.jpg)

![Kategóriák](https://snipboard.io/f2Ajcp.jpg)

![KategóriákMikofon](https://snipboard.io/49vQcw.jpg)

A látogatók számára elérhető főoldal, ahol megjelennek az elérhető termékek


## `Registration.html`/`Login.html` (Regisztráció/Bejelentkezés) 
- **Új felhasználók regisztrációja:**:
    - Név, email és jelszó
 
      
![Regisztráció](https://snipboard.io/olzKeH.jpg)
![Bejelentkezés](https://snipboard.io/cKqOMn.jpg)

## `Profile.html` (Profil) 
- **Regisztrált felhasználók számára**:
    - Név, és jelszó megváltoztatása
    - Láthatod az eddigi rendeléseidet
 
      ![Profil](https://snipboard.io/C3cQfB.jpg)


## `Cart.html` (Kosár) 
- **A kiválasztott termékek összegzése**:
   - Itt ha akarod a terméket töbször is hozzá tudod adni
   - Törölni is tudod a termékeket
  ![Kosár](https://snipboard.io/mxTN94.jpg)

## `Checkout.html` (Pénztár)
    -Irányítószám
    -Város
    -Utca
    -Fizetési mód
    -Telefonszám
![Pénztár](https://snipboard.io/y7R4q9.jpg)

## `Admin.html` (Admin)
- **Az admin felület**:
- Szerepkör változtatása (valakit admin jogokkal tudsz felruházni vagy elvenni)
- Stock (Raktár)
- Termék leírások és képek módosítása
- Új termék és Kategória hozzáadása

![Admin](https://snipboard.io/EcdPV6.jpg)


## `AdminOrders.html` (Rendelések)
- **Az admin itt tudja kezelni a rendeléseket**:
- Az admin engedélyezni tudja a rendelést vagy pedig elutasítani
- Miután az admin sikeresen engedélyezte akkor a vásárló a megadott email címre kap egy üzenetet

![Rendelések](https://snipboard.io/kDSw9N.jpg)


## `Teszt.html` (Átnevezni valamire a teszt helyett)
- **Itt tudod megnézni a termék leírását és információit**:

![Teszt](https://snipboard.io/5LiMHo.jpg)
