# Greddiit (A Reddit clone) using the MERN stack

## Miscellaneous Notes:
* Username cannot have spaces
* When blocking timer is set for one report, no other report can be acted upon i.e. buttons get disabled
* Moderators cannot block themselves but can report their own post
* Image Upload in Create SubGreddiits Page has a limit of 50kb
* Page might become unresponsive at times due to socket errors, so you need to refresh once for everything to will be as usual.
* When user leaves a subgreddiit and you has saved one of its post, the post remains in their saved posts until they manually delete it.
* API Loaders with a backdrop have been implemented wherever the API calls are time-taking
* As NGINX was not given as a requirement in the pdf, I have not implemented it in the Dockerization process after confirming with a TA.

## Bonuses Implemented:
1. Image Upload in Create SubGreddiits (2 marks)
2. Fuzzy Search (2 marks)

## Requirements not attempted:
1. Stats in MySubGreddiits page

## How to run:
1. Download the zipped folder
2. After extracting the folder, execute command `docker compose up --build` (make sure you have docker installed)
3. Make sure you have an internet connection and then go to `http://localhost:3000/` on your browser