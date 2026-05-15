# EduConnect — Enterprise Academic & Campus Management System

EduConnect is an advanced full-stack web platform built for modern higher education institutions, faculties, and academic administration. It provides a highly secure, role-based ecosystem for managing academic cohorts, coursework deliverables, daily attendance analytics, and tuition fee billing.

---

## 🌟 Key System Architecture

- **Frontend**: React.js, Vite, Tailwind CSS, Zustand Persistent State Management, React Router.
- **Backend**: Node.js, Express.js REST API, Mongoose, MongoDB.
- **Security**: Helmet HTTP Headers, Express Rate Limiter, Zero Public Registration (Administrator Provisioned Accounts).
- **Orchestration**: Full-Stack Docker Compose with Multi-Stage Nginx static asset serving.

---

## 🔒 Enterprise Registration & Authentication Policy

To comply with high-level academic compliance standards, **public self-registration is strictly disabled**. All student, faculty, and administrator profiles are provisioned directly by the campus IT administration.

### Evaluation Access Credentials:

| Portal Role | Assigned Identifier | Secure Password |
| :--- | :--- | :--- |
| **Super Administrator** | `ADM-001` | `admin123` |
| **Academic Faculty** | `TRN-001` | `trainer123` |
| **Enrolled Student** | `IDH-001` | `student123` |

---

## 🚀 Running Locally via Docker Compose

You can instantly spin up the entire full-stack ecosystem (MongoDB, Express Server, and Vite Nginx Client) with a single command:

```powershell
docker-compose up --build -d
```

- **Frontend Application**: `http://localhost:80`
- **Backend Server API**: `http://localhost:5000`
- **MongoDB Instance**: Internal Docker Network (`educonnect_net:27017`)

---

## 🛠️ Vercel Deployment Guide

To deploy the frontend Single Page Application (SPA) to Vercel:
1. Connect your GitHub repository to Vercel.
2. In the Vercel Project Settings, set the **Root Directory** to `frontend`.
3. Set the build command to `npm run build` and output directory to `dist`.
4. Configure the environment variable: `VITE_API_URL=https://your-deployed-server-domain.com`.
5. The included `frontend/vercel.json` automatically handles React Router client-side rewrites.
