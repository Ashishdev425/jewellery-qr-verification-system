# Jewellery QR Verification System

Next.js admin + public verification app for jewellery certificates stored via Google Sheets / Apps Script.

## Environment

Create `.env` with:

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-strong-password
ADMIN_SESSION_TOKEN=change-this-long-random-token
NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Notes:
- `ADMIN_SESSION_TOKEN` should be a long random string in production.
- If using hard delete, redeploy `google-apps-script.js` with the `deleteProduct` action.

## Run

```bash
npm install
npm run dev
```

If you hit memory errors while compiling, run with:

```bash
NODE_OPTIONS=--max-old-space-size=4096 npm run dev
```

## Quality Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

