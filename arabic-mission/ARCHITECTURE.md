# Arabic Mission architecture

## Application layers

- Next.js App Router renders the learning interface and provides Node.js API route handlers.
- AuthProvider maintains the client-side view of the signed-in account.
- ProgressProvider loads anonymous progress from localStorage or authenticated progress from `/api/progress`.
- Vercel API routes validate requests, manage signed HttpOnly sessions, hash passwords with Node `scrypt`, and call the Apps Script Web App.
- Apps Script checks a server-to-server API secret and reads/writes the bound Google Sheets database.

## Data flow

```text
Browser
  |  /api/auth/* and /api/progress
  v
Vercel Next.js API Routes
  |  APPS_SCRIPT_URL + APPS_SCRIPT_SECRET (server-side only)
  v
Google Apps Script Web App
  |  DATABASE_ID (Script Properties)
  v
Google Sheets: Users / UserProgress / MissionResults / ActivityLogs
```

## Security boundaries

- Browser never receives the Apps Script API secret or the session signing secret.
- Password plaintext is sent over HTTPS to Vercel, hashed with `scrypt` on the server, and only the salt/hash are stored in Sheets.
- The session token is HMAC-signed and stored in an HttpOnly cookie.
- Apps Script Web App is publicly reachable at the transport layer but rejects requests without the secret.
- Google Sheets must remain private to the database owner and trusted maintainers.

## Database model

See `database/schema.json` and `database/ArabicMission_Database_Template.xlsx`.

## Deployment requirement

Do not use `output: "export"`. API route handlers require a Next.js server deployment, such as Vercel. The existing static export setting has been removed from `next.config.ts`.
