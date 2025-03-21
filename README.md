# Project Initialization Guide 🚀

## 📥 Cloning the Repository

First, clone the repository to your local machine:

```sh
git clone <repo-url>
cd <repo-folder>
```

---

## 🐳 Docker Setup

> **Note:** Before running this project, you need to stop any other Docker projects using the same ports.  
> I haven't added support for dynamic port selection yet (maybe in the future).

### 1️⃣ Initialize `.env`

Copy `.env.example` to `.env` and configure it:

```sh
cp .env.example .env
```

### 2️⃣ Bring Up the Docker Containers

```sh
docker-compose up -d
```

---

## 📦 NPM & Composer Setup

### 3️⃣ Install Node Modules

```sh
npm install
```

> If you encounter dependency issues, try:

```sh
npm install --legacy-peer-deps
```

### 4️⃣ Install PHP Dependencies

```sh
composer install
```

### 5️⃣ Run Database Migrations with Seeding

```sh
php artisan migrate:fresh --seed
```

---

## 🚀 Start the Development Server

Finally, run:

```sh
composer run dev
```

You're all set! 🎉 Happy coding!
