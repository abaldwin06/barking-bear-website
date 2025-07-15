# barking-bear-website
Barking Bear Pet Care Website

## Deployment to GoDaddy
1. Commit & Push local changes to remote GitHub repo, `main` branch
2. This triggers a Github Action Workflow based off [this repo FTP-Deploy-Action](https://github.com/SamKirkland/FTP-Deploy-Action) which copies all files from the repo (except .git files) to the public_html folder on my GoDaddy Web Hosting plan's server
Note: Couldn't get cpanel repository syncing via "Git Version Control" to work, so removed the .cpanel.yml file

## Where I Left Off
HTACCESS FILE
- completed code for redirecting to non-www and https, and removing html suffix
- has templated commented out code for other SEO recommendations (trailing slash, get rid of index.html, still need code for 404)
- updated links to remove .html, removed index from links
- added canonical link tags to html

### Next
- SEO optimization + conversions
    - still need alt descriptions and aria features
    - reduce headers
- add newsletter signup
- add a banner to hiking page about waitlist
- add a banner to daycamp about limited time offer about waitlist

- add faq to boarding page
- separate sign up for hikes/daycamp, boarding, training
- add blog
- Change services carosel on main page to top section
- make it so service pages repeat in order of photo/description not alternating