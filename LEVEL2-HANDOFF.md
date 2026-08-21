# Collin Forde — Level 2 handoff

## Live targets
- Site: https://collin-forde-intl.vercel.app
- Repo: https://github.com/wallstreetbranchmanager-tech/collin-forde-intl
- CRM Drive: https://drive.google.com/drive/folders/1HI03ZzxMXpvwfvQnp4aI8nsAkJ7vmq4R
- Leads Sheet: https://docs.google.com/spreadsheets/d/1VKwZG0IrQfTlfbs_3iaTDd4wW2XkhYhiDqGKMBsDI-M/edit

## Forms deliver to BOTH
1. CollinsellsFlorida@gmail.com
2. collin.forde.international@gmail.com

## Collin must do (requires HIS Google login — never share password)

### A. FormSubmit confirm (one time)
1. Submit a test inquiry on the live site
2. Open CollinsellsFlorida@gmail.com
3. Click FormSubmit Confirm if asked
4. Submit again — both inboxes should receive it

### B. Google Calendar Appointment Schedule
1. Sign in as collin.forde.international@gmail.com
2. calendar.google.com → Create → Appointment schedule
3. Name: Property Viewing / Consultation — Collin Forde
4. 30–45 min slots
5. Copy public booking link → Paul sets NEXT_PUBLIC_CALENDAR_URL on Vercel

### C. Sheets auto-log
1. Open Leads Log sheet
2. Apps Script from Drive file → Deploy web app
3. URL → GOOGLE_SHEETS_WEBHOOK on Vercel

### D. Security
- Change password if shared in chat
- Enable 2-Step Verification

## Paul remaining
- Final exact AES HTML on production
- Env vars when Collin sends calendar/webhook
- Share CRM folder to his Gmail (Editor)
- Smoke test forms
