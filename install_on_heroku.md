```
Download and Install the Heroku toolbelt: https://toolbelt.heroku.com/
heroku login
git clone https://github.com/CollabAcademy/UnWorkshop.git
cd UnWorkshop
heroku create <name_your_app> *remember this
```
- Create github dev creds - https://github.com/settings/developers
- Register new app
  app name : (you could get creative),
  homepage : (https://github.com/CollabAcademy/UnWorkshop) works for now,
  description : An Online Participatory Tool for the 2016 IAP PrototypeJam,
  https://<do_you_still_remember>.herokuapp.com/auth/github/callback
- Register

```
heroku config:set GITHUB_CLIENT_ID=<GITHUB_CLIENT_ID> GITHUB_CLIENT_SECRET=<GITHUB_CLIENT_SECRET>
```

- Create google dev creds - https://console.developers.google.com
- Under `Explore other services`
  - Enable APIs and get credentials like keys
  - Credentials
  - New Credentials
  - OAuth Client ID
  - Web application
  - Name: get creative
  - Authorized JavaScript origins
    https://<heroku_app_name>.herokuapp.com
    http://localhost:3000
  - Authorized redirect URIs
    https://<heroku_app_name>.herokuapp.com/auth/google/callback
    http://localhost:3000/auth/google/callback
  - Create
```
heroku config:set GOOGLE_CLIENT_ID=<GOOGLE_CLIENT_ID> GOOGLE_CLIENT_SECRET=<GOOGLE_CLIENT_SECRET>
heroku config:set HOST=https://unworkshop.herokuapp.com
heroku config:set ADMIN_ROUND_ONE=<email of the admin authorized for round 1>
heroku config:set ADMIN_ROUND_TWO=<email of the admin authorized for round 2>
```

```
git push heroku master
heroku ps:scale web=1
heroku open
```