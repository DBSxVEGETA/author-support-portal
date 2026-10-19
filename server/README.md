# Author Support Portal — backend

## Setup

1. Copy `.env.example` to `.env` and ensure MongoDB is running.
2. Copy the provided `FULLSTACK-SAMPLEDATA (1).json` to `src/data/sampledata.json`.
3. Run `npm install`, then `npm run seed`, then `npm run dev`.
4. Open `http://localhost:5000/health` and `http://localhost:5000/api-docs`.

## Demo logins (development only)

- Author: use the first author's email shown by `npm run seed`; password `Author123@`
- Admin: `admin@bookleaf.com`; password `Admin123@` unless changed in `.env`

Use `Authorization: Bearer <token>` for protected API routes. Swagger has a bearer-token Authorize control. Never commit `.env` or expose an AI key in the frontend.

## Routes

- `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/books`, `GET /api/books/:id`
- `GET/POST /api/tickets`, `GET /api/tickets/:id`, `POST /api/tickets/:id/replies`
- `GET /api/admin/tickets`, `PATCH /api/admin/tickets/:id`
- `POST /api/admin/tickets/:id/draft-response`, `POST /api/admin/tickets/:id/send-response`

AI classification and drafts fall back to rules/templates when `GEMINI_API_KEY` is blank or the service fails. Attachments currently store filename metadata only; actual upload/storage is not implemented yet. Socket.IO sends authenticated `ticket:created` and `ticket:updated` events; frontend must connect with `io(API_URL, { auth: { token } })`.
