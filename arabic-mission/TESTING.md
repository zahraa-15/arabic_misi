# Arabic Mission Dynamic Edition — verification checklist

The original static learning experience and its existing progress tests are retained. The dynamic account/backend integration must also be tested after configuring a real Apps Script deployment and environment variables.

## Automated checks

Run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Manual integration checks

- [ ] `setupDatabase()` runs successfully from the bound Apps Script project.
- [ ] The Apps Script Web App deployment URL ends in `/exec`.
- [ ] `API_SECRET` in Apps Script matches `APPS_SCRIPT_SECRET` in `.env.local` / Vercel.
- [ ] `SESSION_SECRET` is a different random secret and is at least 32 characters.
- [ ] Registration creates exactly one row in `Users`.
- [ ] Registering the same email again is rejected.
- [ ] Login with the correct password succeeds; an incorrect password fails.
- [ ] The session cookie is HttpOnly and is cleared after logout.
- [ ] After completing an activity, `UserProgress` is updated.
- [ ] After completing a mission, `MissionResults` receives the result.
- [ ] Registration, login, and progress save events appear in `ActivityLogs`.
- [ ] Log in from a second browser/device and verify that progress is loaded from the same account.
- [ ] Anonymous local progress from the previous static version migrates when the account has no saved progress.
- [ ] No secret appears in browser DevTools, client bundles, GitHub, or frontend environment variables.
- [ ] Vercel production environment variables are configured and the deployment is redeployed after changes.

## Scope limitations

This package does not include admin dashboard screens, email verification, forgot-password flow, or strong server-side assessment integrity. Google Sheets / Apps Script quotas make it appropriate for prototype, classroom, or small-to-medium usage rather than high-volume production workloads.
