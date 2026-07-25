# Bloggly – Project Documentation

**Full-Stack Blogging & Content Publishing Platform**  
**Year:** 2026  
**Author:** Praveen Yadav

---

## 1. Overview

Bloggly is a full-stack blogging platform that lets users register, write and publish posts, upload cover images, like and comment on blogs, and view public author profiles. It separates concerns into two applications:

| App | Role |
|-----|------|
| `Blog_API` | REST API (Node.js, Express, MongoDB) |
| `Blog-Frontend` | Single-page app (React, Vite, Redux Toolkit) |

**Core workflow:** Draft → Publish → Like → Comment → Author Profiles

---

## 2. Technology Stack

### Backend
- **Runtime:** Node.js  
- **Framework:** Express.js  
- **Database:** MongoDB with Mongoose  
- **Auth:** JWT (access + refresh), bcryptjs  
- **Security:** Helmet, CORS allowlist, express-rate-limit  
- **Media:** Multer + Cloudinary  
- **Email:** Nodemailer / Brevo (password reset)

### Frontend
- **UI:** React 19, Vite, Tailwind CSS, shadcn/ui  
- **State:** Redux Toolkit  
- **Routing:** React Router  
- **Editor:** Quill (`react-quill-new`)  
- **HTTP:** Axios (with token refresh interceptor)

---

## 3. Features

1. **Authentication** – Register, login, logout, JWT access/refresh tokens, forgot/reset password, change password.  
2. **Blogging** – Create, edit, delete blogs; draft vs published status; slug-based public URLs; search, sort, and pagination.  
3. **Engagement** – Like/unlike posts; add, edit, and delete comments (owner-only).  
4. **Profiles** – Dashboard for own content; public author pages with published blogs and stats.  
5. **Media** – Cover image upload to Cloudinary on create/update; old images removed on replace/delete.  
6. **Security** – Password hashing, rate limiting, Helmet headers, ownership checks on mutations.

---

## 4. System Architecture

```
[ Browser (React SPA) ]
        |  HTTPS / REST (JWT)
        v
[ Express API  /api/v1/* ]
   |           |           |
 MongoDB    Cloudinary   Email (Brevo/SMTP)
```

- Frontend talks to `VITE_API_BASE_URL` (e.g. `http://localhost:1234/api/v1`).  
- Protected routes send `Authorization: Bearer <accessToken>`.  
- On 401, the client refreshes the access token using the stored refresh token, then retries.

---

## 5. Data Models

### User
`username`, `email`, `password` (hashed), `refreshToken`, `resetPasswordToken`, `resetPasswordExpires`, timestamps.

### Blog
`slug`, `user` (ref), `title`, `shortDescription`, `content`, `image`, `tags[]`, `status` (`draft` | `published`), `likes[]` (user refs), timestamps.

### Comment
`blog` (ref), `user` (ref), `content`, timestamps.

---

## 6. API Summary

Base path: `/api/v1`  
Health check: `GET /`

| Area | Endpoints (summary) |
|------|---------------------|
| **Auth** | `POST /auth/register`, `/login`, `/logout`, `/refresh-token`, `/forgot-password`, `/reset-password`, `/change-password`; `GET /auth/profile` |
| **Blogs** | `GET /blogs`, `GET /blogs/user`, `GET /blogs/:slug`, `GET /blogs/id/:id`; `POST /blogs`, `/publish`, `/unpublish`; `PUT /blogs/:id`; `DELETE /blogs/:id`; `PATCH /blogs/like/:id`, `/unlike/:id` |
| **Comments** | `GET|POST /comments/:blogId`; `PUT|DELETE /comments/:commentId` |
| **Users** | `GET /users/:username` (public profile + published blogs) |

**Auth notes**
- Access token: ~1 hour; refresh token: ~7 days (stored on the user document).  
- Password-reset token: ~10 minutes; email link uses `CLIENT_URL`.  
- Global rate limit: 100 requests / 15 min / IP; auth routes: 5 / 15 min / IP.

---

## 7. Frontend Routes

| Type | Paths |
|------|--------|
| Public | `/`, `/blogs`, `/blog/:slug`, `/user/:username`, `/about`, `/contact`, `/privacy`, `/terms`, `/faq`, `/auth/*` |
| Private | `/dashboard`, `/dashboard/account`, `/dashboard/account/change-password`, `/dashboard/blogs`, create/update blog routes |

Private areas are gated by `PrivateRoute` using authentication state (access token in `localStorage`).

---

## 8. Local Setup

### Prerequisites
- Node.js, MongoDB  
- Cloudinary account (image uploads)  
- Brevo API key or SMTP credentials (password-reset emails)

### Backend (`Blog_API`)
1. `npm install`  
2. Create `.env.development` (dev) or `.env` (production) with:

| Variable | Purpose |
|----------|---------|
| `MONGO_URL` | MongoDB connection string |
| `PORT` | API port (default `1234`) |
| `JWT_SECRET` | Signing secret for JWTs |
| `CLIENT_URL` | Frontend origin (CORS + reset links) |
| `CLOUDINARY_*` | Cloud name, API key/secret, folder |
| `BREVO_API_KEY` / SMTP vars | Email delivery |
| `MAIL_FROM` | Sender address |

3. Run: `npm run dev` (development) or `npm start` (production).

### Frontend (`Blog-Frontend`)
1. `npm install`  
2. Copy `.env.example` → `.env` and set:

```env
VITE_API_BASE_URL=http://localhost:1234/api/v1
```

3. Run: `npm run dev` (typically `http://localhost:5173`).  
4. Build: `npm run build` / preview: `npm run preview`.

**Important:** Keep API `PORT` and `VITE_API_BASE_URL` aligned. CORS allows `http://localhost:5173` and `CLIENT_URL`.

---

## 9. Deployment Notes

- Set production `CLIENT_URL` to the live frontend origin.  
- Configure `VITE_API_BASE_URL` at **build time** for the frontend.  
- API uses `trust proxy` for correct client IPs behind reverse proxies (rate limiting).  
- Prefer Brevo API where SMTP is blocked (e.g. some PaaS hosts).  
- Frontend `vercel.json` rewrites all routes to `index.html` for SPA routing.

---

## 10. Project Structure (High Level)

```
Bloggly/
├── Blog_API/
│   ├── server.js
│   ├── config/          # Database
│   ├── controllers/v1/  # Auth, blog, comment, user
│   ├── middleware/      # JWT auth, Multer/Cloudinary
│   ├── models/          # User, Blog, Comment
│   ├── routes/v1/       # API route mounts
│   └── utils/           # Tokens, mail, rate limit, slug
└── Blog-Frontend/
    ├── components/      # Layout, blog/comment UI, shadcn
    └── src/
        ├── pages/       # Auth, home, blogs, dashboard, static
        ├── features/    # Redux slices
        └── services/    # API clients
```

---

*End of documentation — approximately two pages when printed (standard formatting).*
