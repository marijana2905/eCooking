# eCooking

Aplikacija za deljenje recepata i kuvanje.

## Pokretanje aplikacije pomoću Docker-a

1. Kopirajte `.env.example` fajl i imenujte kopiju kao `.env` fajl. Možete koristiti komandu:
   ```bash
   cp .env.example .env
   ```
2. Otvorite `.env` fajl i unesite prave podatke za `MONGODB_URI`, `JWT_SECRET`, kao i Cloudinary kredencijale u skladu sa Vašim parametrima.
3. Za pokretanje frontenda i backenda sa docker mrežom, izvršite sledeću komandu u root folderu:
   ```bash
   docker compose up --build -d
   ```
   Ova komanda će izgraditi _production-ready_ slike (preko Node.js i Nginx-a) i podići ih unutar zajedničke `eCooking` mreže.
   Kada se kontejneri podignu, frontend aplikaciji možete pristupiti na `http://localhost`, a backend-u na `http://localhost:3000`.

Da zaustavite rad aplikacije i ugasite generisanu docker mrežu, dovoljno je da pokrenete:

```bash
docker compose down
```
