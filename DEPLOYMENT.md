# Deployment Runbook - Jewellery QR Verification System

## 1. Prerequisites

- Node.js 20+
- NPM installed
- Hosting account (recommended: Vercel)
- Google account with:
  - Google Sheet
  - Apps Script access
  - Drive access

## 2. Environment Variables

Set these in hosting environment:

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-me-strong-password
ADMIN_SESSION_TOKEN=change-me-long-random-token
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

Rules:

- Use a strong random `ADMIN_SESSION_TOKEN`.
- `NEXT_PUBLIC_APP_URL` must match final domain.
- Do not commit real `.env` to git.

## 3. Build Validation (Local)

Run before production deploy:

```bash
npm install
npm run lint
npx tsc --noEmit
npm run build
```

If memory issue appears:

```bash
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

## 4. Deploy Next.js App

### Option A: Vercel (recommended)

1. Import project repository.
2. Add all environment variables.
3. Deploy.
4. Attach custom domain.
5. Re-deploy after domain is connected.

### Option B: Self-host

```bash
npm install
npm run build
npm run start
```

Put behind HTTPS reverse proxy (Nginx/Caddy).

## 5. Deploy Google Apps Script

1. Open Apps Script project linked to your Google Sheet.
2. Replace script code with `google-apps-script.js` from this project.
3. Deploy as Web App:
   - Execute as: `Me`
   - Who has access: `Anyone`
4. Copy deployment URL.
5. Set that URL as `NEXT_PUBLIC_GOOGLE_SCRIPT_URL`.
6. Re-deploy Next.js app.

Important:

- Latest script includes `deleteProduct` action (hard delete support).

## 6. Post-Deploy Smoke Test

Run in production:

1. Admin login works.
2. Add product works.
3. Edit product works.
4. Delete works.
5. Verify page returns product by ID.
6. Logout and auth checks work.

## 7. Security Checklist

1. Change default admin password.
2. Rotate `ADMIN_SESSION_TOKEN`.
3. Restrict Google Sheet sharing to required people only.
4. Enable backup for sheet data.
5. Remove all test/demo data before client go-live.

## 8. Rollback Plan

If deployment fails:

1. Roll back to previous hosting deployment.
2. Restore previous `NEXT_PUBLIC_GOOGLE_SCRIPT_URL` if changed.
3. Re-run smoke test.

## 9. Maintenance

- Monitor:
  - Login failures
  - API errors
  - Google Apps Script availability
- Backup:
  - Weekly Apps Script export
  - Daily Google Sheet backup

