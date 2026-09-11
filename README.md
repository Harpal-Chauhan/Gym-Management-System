# GymFlow — Gym Management System

GymFlow is a web-based Gym Management System designed to simplify daily gym operations such as member management, memberships, payments, check-ins, billing, calendar activities, and role-based access.

## 🌐 Live Demo

[Visit GymFlow](https://gym-management-system-hc.netlify.app/)

## 📂 GitHub Repository

[View Source Code](https://github.com/Harpal-Chauhan/Gym-Management-System)

---

## ✨ Features

- User Registration and Login
- Role-Based Access Control
- Admin User Invitations
- Member Management
- Membership/Product Management
- Payment Management
- Member Check-In / Check-Out
- Calendar Management
- Member Signup Form
- Member Billing
- Admin Analytics
- Responsive UI
- Supabase Authentication and Database
- Row Level Security (RLS)

---

## 👥 User Roles

| Role | Access |
|------|--------|
| **Admin** | Full system access, user invitations, members, products, payments, check-ins, calendar and analytics |
| **Manager** | Members, products, payments, check-ins and calendar |
| **Trainer** | Dashboard, calendar and settings |
| **Member** | Dashboard, signup form, calendar, settings and billing |

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- React Router DOM
- React Toastify
- Lucide React

### Backend & Database

- Supabase
- PostgreSQL
- Supabase Authentication
- Row Level Security (RLS)
- PostgreSQL Functions & Triggers

### Deployment

- GitHub
- Netlify

---

## 📁 Project Structure

```text
Gym-Management-System/
└── client/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRout.jsx
    │   │   └── RoleRoute.jsx
    │   │
    │   ├── lib/
    │   │   └── supabaseClient.js
    │   │
    │   ├── pages/
    │   │   ├── Landing.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── InviteUser.jsx
    │   │   ├── InviteList.jsx
    │   │   ├── SignupForm.jsx
    │   │   ├── Products.jsx
    │   │   ├── Payment.jsx
    │   │   ├── Billing.jsx
    │   │   ├── CheckIn.jsx
    │   │   ├── Calender.jsx
    │   │   ├── Analytics.jsx
    │   │   ├── Setting.jsx
    │   │   │
    │   │   └── members/
    │   │       ├── Members.jsx
    │   │       ├── AddMember.jsx
    │   │       └── EditMember.jsx
    │   │
    │   ├── App.jsx
    │   └── main.jsx
    │
    ├── .env.local
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    └── index.html
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Harpal-Chauhan/Gym-Management-System.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Do not commit `.env.local` or private credentials to GitHub.

### 4. Start the Development Server

```bash
npm run dev
```

### 5. Create Production Build

```bash
npm run build
```

---

## 🔐 Security

GymFlow uses Supabase Row Level Security (RLS) and role-based access control to protect application data.

Access to different features is controlled according to the user's role.

---

## 📌 Project Status

**Completed and Deployed 🚀**

GymFlow is deployed on Netlify and available online.

**Live Website:**  
https://gym-management-system-hc.netlify.app/

---

## 👨‍💻 Author

**Harpal Chauhan**

MSc IT
