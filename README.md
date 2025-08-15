# 🔗 LinkHive

**LinkHive** is a sleek and modern platform for managing your personal links, tracking performance, and sharing your online presence with style. Designed with a focus on simplicity and usability, it offers a clean dashboard for authenticated users to manage their public profile and link collection.

## 🚀 Live Demo

👉 [Live App](https://link-hive-plum.vercel.app)

---

## ✨ Features

- ✅ User registration & login with secure access tokens (JWT + Refresh Token )
- ✅ Fully responsive and animated interface (mobile-first)
- ✅ Create, edit, delete, and reorder links (drag & drop support)
- ✅ Public profile with customizable bio, avatar, and username
- ✅ Avatar upload via Cloudinary integration
- ✅ Analytics dashboard powered by Recharts
- ✅ Profile settings: update username, password, bio, and profile image
- ✅ Clean separation of concerns with modular architecture

---

## 🧰 Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Zustand
- React Query
- Framer Motion
- Recharts
- DnD Kit

### Backend

- Node.js + Express
- TypeScript
- Prisma ORM with PostgreSQL
- Cloudinary
- Zod
- Winston

---

## 🛠️ Setup Instructions

### Backend

    ```bash
    cd backend
    npm install
    npm run prisma:migrate
    npm run dev

### Frontend

    ```bash
    cd frontend
    npm install
    npm run dev

Make sure to add your .env files for both frontend and backend, including:

Database URL

JWT secrets

Cloudinary API keys
