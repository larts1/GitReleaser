# GitReleaser
Moves git issues on webhook

# Install
Set these in index.js
* Change OriginIDs to match source columns in your project
* Change targetID to match target column
* Generate token from git repo settings and

run:
* `npm install --save`
* `node index.js`

Setup git webhook on branch create from repository settings to url of your server
