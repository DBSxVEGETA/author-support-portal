# BookLeaf Author Support Portal

A full-stack support portal for BookLeaf authors and the internal operations team. Authors can access their book information, submit support queries, and follow ticket replies. Admins can manage incoming tickets and use Gemini-powered assistance to classify tickets, suggest priority, and draft responses.

## Contents

- [Overview and features](#overview-and-features)
- [Technology stack](#technology-stack)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Seed the sample data](#seed-the-sample-data)
- [Demo Login Credentials](#demo-login-credentials)
- [Authentication and real-time updates](#authentication-and-real-time-updates)
- [AI integration](#ai-integration)
- [Cost awareness](#cost-awareness)
- [API documentation](#api-documentation)
- [Security](#security)
- [Final verification checklist](#final-verification-checklist)

## Overview and features

### Author portal

- Email/password authentication.
- Author-specific access to books and tickets.
- Book information display.
- Submit support tickets with a subject, description, and book/general query selection.
- View tickets, status, original query, and replies.
- Receive ticket updates in real time without manually refreshing.

### Admin portal

- Review and manage incoming support tickets.
- Update supported ticket fields, including status, classification, and priority where enabled.
- Generate an AI-assisted response draft and edit it before sending.
- Send replies visible in the author's ticket view.
- Use a fallback draft or write a response manually if AI assistance is unavailable.

### Backend

- REST API using Node.js and Express.
- MongoDB persistence through Mongoose.
- JWT authentication and role-based access control.
- Socket.IO authentication and role-specific rooms.
- Gemini integration for classification, priority suggestion, and response drafting.

## Technology stack

| Area                    | Technology              |
| ----------------------- | ----------------------- |
| Frontend                | React, Vite, JavaScript |
| Backend                 | Node.js, Express        |
| Database                | MongoDB, Mongoose       |
| Authentication          | JWT                     |
| Real-time communication | Socket.IO               |
| AI provider             | Google Gemini API       |
| HTTP client             | Axios                   |
| Configuration           | Environment variables   |

Confirm package names against the `package.json` files before changing this table.

## Getting started

### Prerequisites

- Node.js and npm.
- MongoDB running locally or a MongoDB connection string.
- A Google Gemini API key for AI features.
- Git.

### Install dependencies

```bash
git clone <repository-url>
cd author-support-portal

cd server
npm install

cd ../client
npm install
```

### Configure environment variables

- **Server:** Copy the variables from `server/.env.example` into `server/.env` and fill in the values required for your local setup.
- **Client:** Copy the variables from `client/.env.example` into `client/.env` and set the frontend configuration, including the backend API URL.
- **Admin account:** You can set your own `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the server environment. If you leave them unset, the seed process uses the default values defined in the seed code.

### Seed the sample data

Make sure the server environment is configured and the database is reachable. From the `server` directory, run:

```bash
npm run seed
```

This seeds the database with the sample data from `sample.json`. Run the seed command against the intended database; if the script resets existing records, do not run it against data you need to preserve.

### Run locally

Run the backend and frontend in separate terminals, using the scripts defined in each `package.json`. Common commands are:

```bash
cd server
npm run dev
```

```bash
cd client
npm run dev
```

If a `dev` script is not defined, use the actual command shown by `npm run` in that directory. Open the local URL printed by Vite.

## Demo Login Credentials

Use these accounts to test both sides of the deployed application. Replace the placeholders below with the actual demo account credentials before sharing this README with the reviewer. Do not publish personal accounts or production administrator credentials.

| Role   | Email                    | Password     |
| ------ | ------------------------ | ------------ |
| Author | `priya.sharma@email.com` | `Author123@` |
| Admin  | `admin@bookleaf.com`     | `Admin123@`  |

**Reviewer notes**

- Open the deployed application and sign in with the account for the portal you want to test.
- The author account should have seeded book data and should only show that author's books and tickets.
- The admin account should be able to review tickets, manage ticket status/metadata, and draft or send replies.
- Confirm both accounts work on the deployed environment before submitting. If the application does not automatically seed/create these users, create the demo accounts in the database or through the supported admin setup flow first.

## Authentication and real-time updates

- Users sign in with email and password.
- The backend validates credentials and issues a JWT.
- The frontend stores the token under `bl_token` in local storage and sends it with authenticated REST requests as a Bearer token.
- Socket.IO sends the token through the connection's `auth` payload. The backend verifies it before accepting the connection.
- Authors should only access their own books and tickets; admins can access the shared ticket queue.
- Admin sockets join the `admins` room. Author sockets join `user:<author-id>`.
- Ticket changes are emitted to the relevant author room and the admin room.
- The client listens for `ticket:updated`; if the event ticket ID matches the open ticket, it reloads ticket details from the API.

The REST API/database remains the source of truth. Socket.IO is a notification mechanism, not a replacement for persistence or authorization.

## AI integration

### AI-supported tasks

The backend uses Gemini for these workflows as implemented in the application:

- **Auto-classification:** suggest one of the supported categories: Royalty & Payments; ISBN & Metadata Issues; Printing & Quality; Distribution & Availability; Book Status & Production Updates; General Inquiry.
- **Priority suggestion:** suggest Critical, High, Medium, or Low based on ticket content and urgency.
- **Draft response:** generate a proposed reply using ticket details and the BookLeaf Knowledge Base context supplied to the prompt.

AI results are suggestions. Admins should review and correct classifications, priorities, and drafts before sending them to authors.

### Prompt engineering

Prompts should define the model's role, include relevant ticket content and Knowledge Base context, and specify the expected output. Classification and priority prompts should constrain output to supported values that the backend can validate. Draft-response prompts should request a concise, professional BookLeaf support tone and discourage unsupported promises or invented facts.

The model should not invent account-specific royalty, payment, production, or distribution facts. Those facts should come from trusted application data or the Knowledge Base.

### Failure handling

If Gemini is unavailable, rate-limited, or returns unusable output:

- Ticket creation and normal ticket management should continue.
- The application can use its fallback response.
- An admin can edit the fallback or write a response manually.
- AI failure should not prevent sending a manually written response.

Do not expose provider error details or API keys to the browser.

### Why Gemini was chosen

Gemini provides a straightforward API integration for the application's text-based tasks: ticket classification, priority suggestion, and support-response drafting. Using one provider keeps the implementation simpler than maintaining separate integrations for different AI features. It also gives the project a practical way to evaluate output quality, latency, and usage during development.

Actual cost depends on the selected model, input/output token volume, quotas, and the provider's current pricing. This README does not assume a fixed price or guaranteed free-tier availability. The backend AI service can be adapted to another provider later without exposing provider credentials to the frontend.

## Cost awareness

AI usage should be limited to tasks that benefit from a model call:

1. **Call AI at meaningful workflow points.** Run classification/priority when a ticket is created or when an admin explicitly requests re-evaluation—not whenever a ticket is displayed or a component renders.
2. **Keep prompts focused.** Send the ticket subject and description plus only relevant Knowledge Base information. Avoid sending the entire ticket history or full Knowledge Base when unnecessary.
3. **Bound response length.** Ask for short classification/priority outputs and concise drafts.
4. **Avoid repeat generation.** Reuse saved AI results until the relevant ticket content changes or an admin requests a new draft.
5. **Limit retries.** Do not retry provider or rate-limit errors indefinitely; use the fallback/manual workflow.
6. **Measure usage where possible.** Track task type, model, latency, outcome, and token usage if the provider exposes it. Never log secrets.
7. **Review pricing periodically.** Pricing and quotas can change.

**Implementation check:** confirm in the AI service/controller that model calls are not triggered on every page load, and check whether the current prompt includes the full Knowledge Base or ticket history. Document only what the code actually does. Do not claim caching or token tracking unless implemented.

## Security

- Keep `.env` files out of version control.
- Store `GEMINI_API_KEY` and `JWT_SECRET` only on the backend.
- Never prefix secrets with `VITE_`; Vite variables are exposed to browser code.
- Validate request data on the server.
- Enforce role and resource ownership checks on every protected route.
- Do not log passwords, JWTs, API keys, or sensitive request payloads.
- Use HTTPS and production-appropriate CORS and authentication settings when deployed.
