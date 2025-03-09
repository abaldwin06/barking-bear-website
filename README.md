# barking-bear-website
Barking Bear Pet Care Website

## Deployment to GoDaddy
1. Commit & Push local changes to remote GitHub repo, `main` branch
2. This triggers a Github Action Workflow based off [this repo FTP-Deploy-Action](https://github.com/SamKirkland/FTP-Deploy-Action) which copies all files from the repo (except .git files) to the public_html folder on my GoDaddy Web Hosting plan's server
Note: Couldn't get cpanel repository syncing via "Git Version Control" to work, so removed the .cpanel.yml file