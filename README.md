# eCooking

Aplikacija za deljenje recepata, kuvanje i interakciju između korisnika. Korisnici mogu da objavljuju recepte, pregledaju sadržaj drugih korisnika, ostavljaju lajkove, prate profile korisnika i upravljaju svojim receptima.

## Opis projekta

`eCooking` je web aplikacija koja omogućava korisnicima da:

- kreiraju i dele recepte,
- pregledaju recepte drugih korisnika,
- čuvaju omiljene recepte,
- prate profile korisnika,
- se prijavljuju i registruju sa JWT autentifikacijom,
- učitavaju slike recepata preko Cloudinary servisa.

## Tehnologije koje su korišćene

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Router
- TanStack React Query
- Zustand
- Axios
- Zod + React Hook Form

### Backend

- NestJS
- Node.js
- TypeScript
- JWT autentifikacija
- Mongoose
- Class Validator / Class Transformer
- Express
- bcrypt za hashovanje lozinki

### Baza podataka

- MongoDB
- Mongoose ODM
- Podaci o korisnicima, receptima i tokenima čuvaju se u MongoDB kolekcijama

### Dodatni alati i servisi

- Docker i Docker Compose
- Nginx za frontend servis
- Cloudinary za upload i skladištenje slika
- ESLint i Prettier
- Jest i Supertest za testiranje

## Struktura projekta

- `backend/` - NestJS API i poslovna logika
- `frontend/` - React aplikacija
- `docker-compose.yml` - konfiguracija Docker kontejnera

## Podešavanje environment varijabli

U backend projektu postoji primer konfiguracije u fajlu `backend/.env.example`. Potrebno je da napravite kopiju i da je popunite podacima za vašu lokalnu ili udaljenu instancu:

```bash
cp backend/.env.example backend/.env
```

Najvažniji parametri su:

- `MONGO_URI`
- `MONGO_DB_NAME`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## Pokretanje aplikacije pomoću Docker-a

1. Kopirajte `backend/.env.example` u `backend/.env` i popunite vrednosti za bazu, JWT i Cloudinary.
2. U root folderu projekta pokrenite:
   ```bash
   docker compose up --build -d
   ```
3. Ova komanda će izgraditi i pokrenuti frontend i backend kontejnere unutar zajedničke mreže `eCooking`.
4. Frontend aplikacija je dostupna na `http://localhost`, a backend na `http://localhost:3000`.

Da zaustavite aplikaciju i obrišete Docker mrežu:

```bash
docker compose down
```
