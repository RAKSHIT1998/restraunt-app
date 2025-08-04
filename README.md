# Crypto Exchange Backend (Scaffold)

This project is the beginning of a Node.js/Express backend for an Indian cryptocurrency exchange platform. It currently implements basic user authentication with JWT and uses an in-memory user store.

## Setup

1. Copy `.env.example` to `.env` and set a strong value for `JWT_SECRET`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

The server runs on the port specified in `PORT` (defaults to `3000`).

## API Routes

- `POST /api/auth/register` – create a new user account.
- `POST /api/auth/login` – authenticate and receive a JWT.
- `GET /api/user/me` – fetch the current user's profile (requires `Authorization: Bearer <token>`).

More modules such as KYC handling, INR and crypto wallets, trading engine, and admin features will be added in subsequent iterations.
