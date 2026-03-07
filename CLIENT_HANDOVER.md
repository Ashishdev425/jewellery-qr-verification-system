# Client Handover - Jewellery QR Verification System

## 1. Delivered Scope

- Admin login/logout
- Add product certificate
- Edit certificate
- Delete certificate
- Public verification by certificate ID / QR
- Dashboard and search

## 2. Production URLs

- App URL: `<ADD_PRODUCTION_URL>`
- Admin URL: `<ADD_PRODUCTION_URL>/admin/login`
- Verification URL: `<ADD_PRODUCTION_URL>/verify`

## 3. Credentials Handover

Provide these securely (password manager / encrypted channel):

- Admin email: `<ADMIN_EMAIL>`
- Admin password: `<ADMIN_PASSWORD>`
- Session token value (env): `<ADMIN_SESSION_TOKEN>`
- Google account owning Apps Script + Sheet: `<OWNER_EMAIL>`

Action required immediately after handover:

1. Change admin password.
2. Rotate `ADMIN_SESSION_TOKEN`.
3. Confirm only authorized team members have access.

## 4. Operational Notes

- Product data is stored in Google Sheet via Apps Script Web App.
- Delete operation works with:
  - Hard delete when latest Apps Script is deployed.
  - Fallback soft delete if old Apps Script is still active.
- For strict hard delete behavior, deploy the latest `google-apps-script.js`.

## 5. Client Admin Guide

1. Login at `/admin/login`.
2. Add products from `Add Product`.
3. Manage products in `All Products`.
4. Use `Delete` for removal.
5. Verify from `/verify` or QR code.
6. Change password from `Settings`.

## 6. Backup and Recovery

- Backup Google Sheet regularly (daily recommended).
- Keep a copy of deployed Apps Script code version.
- Keep `.env` secrets in a secure vault.

## 7. Support Terms (Fill Before Delivery)

- Warranty period: `<e.g. 30 days>`
- Included support: `<bug fixes / deployment support>`
- Excluded scope: `<new features / redesign>`
- SLA: `<response time>`

## 8. Acceptance Sign-off

Client confirms:

1. App is accessible and functional.
2. Core flows tested: login, add, edit, delete, verify.
3. Credentials received and changed.
4. Handover documents received.

Client Name: ____________________

Client Signature: ____________________

Date: ____________________

