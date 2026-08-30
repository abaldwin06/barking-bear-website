# Barking Bear Pet Care — Base44 Dev Notes

## What this is
A static HTML website (no build system, no backend, no database). Pages: `index.html`, `boarding.html`, `contact.html`, `daycare.html`, `hiking.html`, `training.html`. Assets in `assets/` (css, img, js, vendor, scss, templates). Forms in `forms/`. Originally deployed to GoDaddy via FTP from a GitHub Action.

## How it runs here
Served by `nginx:alpine` via `docker-compose.base44.yml`, bind-mounted read-only at `/usr/share/nginx/html`, exposed on host port 3000.

- A custom `nginx.conf` runs nginx as `user root;` because the bind-mounted directories have `700` permissions on the host, which the default non-root nginx worker cannot read (causes 403).
- `try_files $uri $uri/ $uri.html =404` mirrors the original `.htaccess` behavior of serving clean URLs without the `.html` suffix.

## Editing
- HTML/CSS/JS edits appear instantly in the preview — files are bind-mounted and served directly, no rebuild needed.
- Changes to `docker-compose.base44.yml` or `nginx.conf` require `docker compose -f docker-compose.base44.yml up -d --force-recreate`.

## Verify it works
`curl -sf -o /dev/null -w "%{http_code}" http://localhost:3000/` → `200`. Subpages and `assets/` paths should also return 200.

## Secrets
None required — fully static site.
