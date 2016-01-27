Back to the [README.md documentation](https://github.com/CollabAcademy/UnWorkshop/blob/master/README.md)

# Fork this repository
[Fork](https://github.com/CollabAcademy/UnWorkshop#fork-destination-box) this repository.

# Install heroku on your computer
Download and Install the [Heroku toolbelt](https://toolbelt.heroku.com/)

```
heroku login
git clone <your_forked_repository> UnWorkshop # original repo: https://github.com/CollabAcademy/UnWorkshop.git
cd UnWorkshop
heroku create <name_your_app>
```

# Get credentials to login with Github and Google

## Github credentials

- Create [github dev](https://github.com/settings/developers) creds
- Register new app
    - app name : (get creative),
    - homepage : https://github.com/CollabAcademy/UnWorkshop,
    - description : An Online Participatory Tool for the 2016 IAP PrototypeJam
    - https://`<your_app_name>`.herokuapp.com/auth/github/callback
- Register
- In your terminal,
```
heroku config:set GITHUB_CLIENT_ID=<GITHUB_CLIENT_ID> GITHUB_CLIENT_SECRET=<GITHUB_CLIENT_SECRET>
```

## Google credentials
- Access the [Google Developers panel](https://console.developers.google.com)
- Create a new project in the top menu (`Create new project`)
- Under `Overview` (left menu), make sure to activate the Google+ API. (If it still doesn't work, try adding Gmail as well.)
- Under `Credentials`
  - New Credentials
  - OAuth Client ID
  - Web application
  - Name: get creative
  - Authorized JavaScript origins
    https://`<heroku_app_name>`.herokuapp.com
    http://localhost:3000
  - Authorized redirect URIs
    https://`<heroku_app_name>`.herokuapp.com/auth/google/callback
    http://localhost:3000/auth/google/callback
  - Create
```
heroku config:set GOOGLE_CLIENT_ID=<GOOGLE_CLIENT_ID> GOOGLE_CLIENT_SECRET=<GOOGLE_CLIENT_SECRET>
heroku config:set HOST=https://<heroku_app_name>.herokuapp.com
heroku config:set ADMIN_ROUND_ONE=<email of the admin authorized for round 1>
heroku config:set ADMIN_ROUND_TWO=<email of the admin authorized for round 2>
```
- Setup [postgresql on Heroku](https://devcenter.heroku.com/articles/heroku-postgresql)
```
heroku addons:create heroku-postgresql:hobby-dev
```
- push code to master
```
git push heroku master
heroku run bash
sequelize db:migrate
exit
heroku ps:scale web=1
heroku open
```
