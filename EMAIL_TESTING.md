# DD TECH Email Diagnostics

This project uses Resend for contact form delivery.

## Required environment variables

```env
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=DD TECH <noreply@send.ddtech.in>
RESEND_TO_EMAIL=info@ddtech.in
ALLOWED_ORIGINS=https://ddtech.in,https://www.ddtech.in
ENABLE_EMAIL_TEST_ENDPOINTS=false
```

## Production defaults

- `/api/send-email` is the public contact endpoint on Vercel.
- Test endpoints stay disabled unless `ENABLE_EMAIL_TEST_ENDPOINTS=true`.
- Public diagnostic pages should remain unlinked and `noindex`.

## Local verification

1. Set the environment variables above in `.env`.
2. Run `node server.js` or your preferred local server.
3. Submit the contact form from `contact.html`.

## Optional test endpoint

If you explicitly want to test the email pipeline outside the contact form:

1. Set `ENABLE_EMAIL_TEST_ENDPOINTS=true`.
2. Call `POST /api/test-email`.
3. Disable the flag again before production deployment.
