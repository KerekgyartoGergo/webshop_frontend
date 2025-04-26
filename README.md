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
![Index](https://snipboard.io/tqmPST.jpg)


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

A látogatók számára elérhető főoldal, ahol megjelennek az elérhető termékek


## `Registration.html`/`Login.html` (Regisztráció/Bejelentkezés) 
- **Új felhasználók regisztrációja:**:
    - Név, email és jelszó
 
      
![Regisztráció](https://snipboard.io/IrgKVk.jpg)
![Bejelentkezés](https://snipboard.io/47dqKP.jpg)

## `Profile.html` (Profil) 
- **Regisztrált felhasználók számára**:
    - Név, és jelszó megváltoztatása
 
      ![Profil](https://snipboard.io/eXnjPp.jpg)

## `Kategoria.html` (Kategóriák) 
- **Három kategória között tudsz választani**:
![Kategóriák]()

## `Cart.html` (Kosár) 
- **A kiválasztott termékek összegzése**:
   - Itt ha akarod a terméket töbször is hozzá tudod adni
   - Törölni is tudod a termékeket
  ![Kosár]()

## `Checkout.html` (Pénztár)
    -Irányítószám
    -Város
    -Utca
    -Fizetési mód
    -Telefonszám
![Pénztár](https://snipboard.io/nBozeX.jpg)

## `Admin.html` (Admin)
- **Az admin felület**:
- Szerepkör változtatása (valakit admin jogokkal tudsz felruházni vagy elvenni)
- Stock (Raktár)
- Termék leírások és képek módosítása
- Új termék és Kategória hozzáadása

![Admin]()


## `AdminOrders.html` (Rendelések)
- **Az admin itt tudja kezelni a rendeléseket**:
- Az admin engedélyezni tudja a rendelést vagy pedig elutasítani
- Miután az admin sikeresen engedélyezte akkor a vásárló a megadott email címre kap egy üzenetet

![Rendelések]()
