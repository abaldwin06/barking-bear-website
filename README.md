# barking-bear-website
Barking Bear Pet Care Website

## Deployment to GoDaddy
1. Commit & Push local changes to remote GitHub repo, `main` branch
2. This triggers a Github Action Workflow based off [this repo FTP-Deploy-Action](https://github.com/SamKirkland/FTP-Deploy-Action) which copies all files from the repo (except .git files) to the public_html folder on my GoDaddy Web Hosting plan's server
Note: Couldn't get cpanel repository syncing via "Git Version Control" to work, so removed the .cpanel.yml file

## Where I Left Off
HTACCESS FILE
- completed code for redirecting to non-www and https, and removing html suffix, trailing slash, get rid of index.html, updated links to remove .html, added canonical link tags to html
- 3/23 
 - updated pickup radius to Quebec
- verbiage on starting with school/training then go to camp/hikes
- updated pricing for hikes, camp and school
- updated sign up links to wait list form

### Next
- add link to pet pocketbook
- add newsletter signup
- SEO optimization + conversions
    - improve load time
    - still need 404 page
    - switch image file type
    - still need alt descriptions and aria features
    - reduce headers
- add new testimonials
- add faq to boarding page
- add blog
- Change services carosel on main page to top section
- make it so service pages repeat in order of photo/description not alternating