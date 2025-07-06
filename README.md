# barking-bear-website
Barking Bear Pet Care Website

## Deployment to GoDaddy
1. Commit & Push local changes to remote GitHub repo, `main` branch
2. This triggers a Github Action Workflow based off [this repo FTP-Deploy-Action](https://github.com/SamKirkland/FTP-Deploy-Action) which copies all files from the repo (except .git files) to the public_html folder on my GoDaddy Web Hosting plan's server
Note: Couldn't get cpanel repository syncing via "Git Version Control" to work, so removed the .cpanel.yml file

## Where I Left Off
Have separate pages for boarding, training, hiking, daycare and the header links to them
Redone the about us content and drop down, it's on the main page
Polished the copy on the hiking page
Fixed the scrolling where it cuts off the top header
Consolidated the css for service pages
Fixed the link to subsection bugs, and the padding of sections
Separate out booking page, update links to point to new page, update footer with new socials

### Next
- copy and details for the day camp page
- copy and details for the training page, add sub-links to training sub-services
- copy and details for the boarding page - with petsitting insurance


- add a banner to hiking page about waitlist
- add a banner to daycamp about limited time offer about waitlist
- add newsletter signup
- separate sign up for hikes or day camp
- add blog

- Change services carosel on main page to top section