# 2016-MIT-IAP-PrototypeJam UnWorkshop
An Online Participatory Tool for the 2016 IAP PrototypeJam
 http://collabacademy.github.io/UnWorkshop

## What is this?
  **For Mass Participatory Ideation, Prioritization & Decision Making**

A tool/framework to help you gather, filter, choose and decide what to work on from a vast set of ideas.  

This tool in intended to enable large groups and entire populations to self-organize, self-govern and self-start the innovative:
* production of new products,
* deployment of new services,
* launch of new ventures and/or
* creation of other new value

# Initial Reference Implementation:

**Goal: Invent & Launch Innovative MIT/Law Spring Blockchain Project**
* Method: Recursive rounds of ideation and prioritization which produce by design the deployment of innovative new value
* Mechanism: Online participants generate a new innovative project though several rounds of ideation and decision.   Each proposal or other contribution should have an equal opportunity to be considered and advanved to the next round.  A webform and other actions (sliders, selectors, etc) can enable simulteneous proposal of ideas followed immediately be simulteneous rating of each idea by a statistically significant number and cross-section of the population.

## ROUND ONE: WHAT
**Ask: What do you want to be hacking?**
  - pitch in *ideas*, with a **title**, a **blurb** and **success metrics** via a web form.
  - submissions/references to submissions are *stored* in the contract along with the senders id/address.
  - **Rate** the submissions
  - authorized person *takes a call/decides* (the filter) - The selected idea is now a *candidate for the next round*
Output: The project summary as a README in the GitHub repo

## ROUND TWO: HOW
**Ask: How do we hack it?**
  - **Rate** the submissions
  - authorized person **takes a call**
Output: The Process. Details go into the README on GitHub

## ROUND THREE: WHEN
  - Ask *What key milestones* and *Dates* to hack this project?
  - Automate the results to Milestones in GitHub, and include the "Successfully Achieved Success Metric" data as an Issue tied to a key project milestone.

### MVP - 1 - features
  - API to **register** participants
  - API to **gather** WHATs - ideas{title, blurb}, success metrics[] in round 1 and HOWs - language, framework etc in round 2
  - API to **rate** the entries that were gathered (ideas are distributed to the participants randomly) #TODO @dazzaji, more details?
  - API to **sort** the entries based on the ratings
  - API to **filter**, in this case access is granted only to the authorized person for the respective round
  - **Decision** API that returns the final summary of the decisions made.

Note: This will evolve :)


### How to run the application

On Heroku: https://github.com/CollabAcademy/UnWorkshop/blob/master/install_on_heroku.md

On local: Follow the below steps

Prerequisites:
- Setup node and npm - https://nodejs.org/en/
- Get Github dev credentials/authorize app on github - https://github.com/settings/developers
- install Mongodb on your system - https://www.mongodb.org/downloads
#### Pre-requisites:
- Setup node and npm in your computer: https://nodejs.org/en/
- Get Github dev credentials(Github OAuth2): https://github.com/settings/developers
  - The default host is http://localhost:5000
- Get Google dev credentials(Google OAuth2) [https://console.developers.google.com/home/dashboard]

#### Setup
```
git clone https://github.com/CollabAcademy/UnWorkshop
cd UnWorkshop
npm install
```
Set ENVIRONMENT variables
```
 export HOST = http://localhost:3000
 export ADMIN_ROUND_ONE = <email_admin_1>
 export ADMIN_ROUND_TWO = <email_admin_2>
 export ADMIN_ROUND_THREE = <email_admin_3>
 export GITHUB_CLIENT_ID = <GITHUB_CLIENT_ID>
 export GITHUB_CLIENT_SECRET = <GITHUB_CLIENT_SECRET>
 export GOOGLE_CLIENT_ID = <GOOGLE_CLIENT_ID>
 export GOOGLE_CLIENT_SECRET = <GOOGLE_CLIENT_SECRET>
 export MONGOLAB_URI = mongodb://localhost/unworkshop
```
- install dependancies
```
 npm install
```
- start the app
```
 node app.js
```
