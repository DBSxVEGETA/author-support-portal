# Author Support Portal — Frontend

React + Vite frontend for the Author Support Portal.

## Setup

1. Install Node.js (LTS) and MongoDB/backend prerequisites separately.
2. Copy `.env.example` to `.env` and set `API_URL` to the backend URL (default local API: `http://localhost:5000`).
3. Run `npm install`.
4. Run `npm run dev`.
5. Run `npm run build` to verify the production bundle.

## Project structure

```text
src/
├── api/axios.js              # Axios instance and auth header
├── components/
│   ├── common/UI.jsx         # Reusable headings, pills, cards, tables, empty/loading states
│   └── layout/AppShell.jsx   # Shared author/admin app shell and navigation
├── context/AuthContext.jsx  # Authentication state and session restoration
├── pages/                    # Route-level screens
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Books.jsx
│   ├── NewTicket.jsx
│   ├── Tickets.jsx
│   ├── TicketDetail.jsx
│   ├── AdminInbox.jsx
│   └── NotFound.jsx
├── routes/                   # Route configuration and access guards
│   ├── AppRoutes.jsx
│   └── Protected.jsx
├── utils/                    # Shared constants and formatters
├── App.jsx                   # Router/auth provider composition
├── main.jsx                 # Small application entry point only
└── styles.css               # Global design tokens, layout and responsive styles
```

The screens and shared UI components are now separated into dedicated modules. `styles.css` intentionally remains the global stylesheet so the current visual design is preserved; CSS can be split into component-level stylesheets later without changing the React structure.

## Available scripts

- `npm run dev` — local development server
- `npm run build` — production build
- `npm run preview` — preview production build

## Notes

- The app expects the backend routes used by the assignment under `/api`.
- Ticket attachment UI currently stores/displays a filename only unless the backend implements actual file uploads.
