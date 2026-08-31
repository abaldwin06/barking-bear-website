FROM php:8.2-fpm-alpine
# cURL extension — needed so the contact form handler can POST submissions
# to the Google Sheets Apps Script web app (matches GoDaddy's PHP, which
# also ships the cURL extension).
RUN apk add --no-cache curl-dev \
 && docker-php-ext-install curl \
 && apk del curl-dev
