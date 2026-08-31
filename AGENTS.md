# Barking Bear Pet Care — Base44 Dev Notes

## What this is
A static HTML website (no build system) with a PHP contact/booking form. Pages: `index.html`, `boarding.html`, `contact.html`, `daycare.html`, `hiking.html`, `training.html`. Assets in `assets/` (css, img, js, vendor, scss, templates). Forms in `forms/`. Originally deployed to GoDaddy via FTP from a GitHub Action.

## How it runs here
Two services in `docker-compose.base44.yml`, both bind-mounting the repo read-only at `/var/www/html`:

- `web` (`nginx:alpine`) — serves the static site on host port 3000, and proxies `*.php` requests to the `php` service via fastcgi.
- `php` (built from `php.Dockerfile`, i.e. `php:8.2-fpm-alpine` + the cURL extension) — executes `forms/contact.php` (the contact/booking form handler). cURL is required so the handler can POST submissions to the Google Sheets Apps Script web app.

`nginx.conf` root is `/var/www/html`; `location ~ \.php$` does `fastcgi_pass php:9000` with `SCRIPT_FILENAME /var/www/html$fastcgi_script_name`. The `location /` block uses `try_files $uri $uri/ $uri.html =404` to mirror the original `.htaccess` clean-URL behavior.

### IMPORTANT: /app permissions
The host repo root `/app` is `700` (root-only) by default. PHP-FPM workers run as `www-data` and CANNOT traverse a `700` dir — the form POST returns 404 "File not found." (nginx itself runs as `user root;` so static pages still serve). The `startCommand` therefore runs `chmod 755 /app` before `up -d`. If the form ever 404s with "File not found.", re-run `chmod 755 /app` and recreate the `php` service.

## The contact form
- Frontend: `contact.html` + `assets/js/contact-form.js` (dynamic dogs, boarding date pairs, "Other" follow-up fields, success message) + `assets/css/contact-form.css`.
- Backend: `forms/contact.php` builds a sectioned HTML email and sends it to `barkingbearpetcare@gmail.com` using the bundled `assets/vendor/php-email-form/php-email-form.php` (which vendors PHPMailer).
- Delivery: uses the host's PHP `mail()` by default with `From: hello@barkingbearpetcare.com` and the submitter's email as Reply-To — this is what works on GoDaddy's relay. SMTP is an optional override: if `SMTP_USERNAME`/`SMTP_PASSWORD` env vars are set, it sends via Gmail SMTP instead.
- Google Sheet log: after sending the email, the handler best-effort POSTs the submission as JSON to a Google Apps Script web app (`GOOGLE_SHEET_WEBAPP_URL` constant in `forms/contact.php`, or `GOOGLE_SHEET_WEBAPP_URL` env var), which appends a row. The Apps Script is in `google-apps-script/Code.gs` — user deploys it and pastes the Web app URL into the constant. Empty URL = skipped (email still sends). Uses cURL; failures are ignored so the sheet never breaks the form.
- In this preview there is no MTA, so `mail()` returns "Mailer Error: Could not instantiate mail function." — expected; the handler still executes (no 405). Real delivery happens on the GoDaddy host.

## Editing
- HTML/CSS/JS edits appear instantly via live reload — files are bind-mounted and served directly.
- Changes to `docker-compose.base44.yml` or `nginx.conf` require `docker compose -f docker-compose.base44.yml up -d --force-recreate` (or restart the affected service).

## Verify it works
- Static: `curl -sf -o /dev/null -w "%{http_code}" http://localhost:3000/` → `200`.
- Form executes PHP (no 405): `curl -s -o /dev/null -w "%{http_code}" -X POST -H "X-Requested-With: XMLHttpRequest" -F "first_name=Jane" -F "email=jane@example.com" -F "services[]=Private Dog Training" -F "dog_name[]=Rex" -F "contact_preference=Chat via phone" -F "referral=Google Search" http://localhost:3000/forms/contact.php` → `200` (body will be the no-MTA mailer error in preview).

## Secrets
None required — the form sends via the host `mail()` by default. `SMTP_USERNAME`/`SMTP_PASSWORD` are an optional override (Gmail SMTP) and are not needed for GoDaddy.
