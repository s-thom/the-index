# the-index

A personal index.

I needed a place to store links to things in an organised manner, so I built one. It's still a work in progress.

## Frontend

Required environment variables (Normal CRA `.env` rules apply):

- `REACT_APP_SERVER_PATH`: Where to find the server e.g. `http://localhost:7000`

To build:

```sh
cd frontend
npm run build
```

For development:

```sh
cd frontend
npm start
```

## Backend

Uses an SQLite3 database for now. Database versioning is done with [flyway](https://flywaydb.org/). While a username and password is not required for SQLite, I've added them in anyway for the future.

Required environment variables (a `.env` file is supported):

- `CORS_ALLOWED`: Hostname to allow requests from e.g. `http://localhost:3000`
- `JWT_SECRET`: Secret used for generating JWTs. Make it a nice big random string
- `DB_PATH`: File for the SQLite databse e.g. `database.sqlite`
- `DB_USER`: Username for the database
- `DB_PASS`: Password for the database
- `FLYWAY_URL`: JDBC path to the database e.g. `jdbc:sqlite:database.sqlite`
- `FLYWAY_USER`: Same as `DB_USER`
- `FLYWAY_PASSWORD`: Same as `DB_PASS`

Optional variables:

- `SERVER_PORT`: Port for express to run on e.g. 7000

To build:

```sh
cd backend
npm run migrate
npm run build # Or `npm start` to run it
```

For development:

```sh
cd backend
npm run migrate
npm run dev
```

### Adding users

There's currently no way to actually add users via API, so for now you'll need to insert into the `users` table yourself. The `created_dts` column has a default.

### Securing

There are files that contain things that shouldn't be read by an attacker. Set the file permissions for your SQLite DB and .env file to `600`.

You'll want to put a reverse proxy in front for HTTPS. Block directly incoming connections using firewall rules.

## TODO

Some of these things are important, some are not.

- [x] Basic prototype
- [x] Remove title
- [x] Add new link
- [ ] Paginated APIs
- [ ] Version check
- [ ] Date selection
- [x] Promises for Express
- [x] Router
- [x] Suspense
- [x] Users
- [ ] Delete user
- [ ] Download user data
- [ ] Login via [TOTP code](https://www.npmjs.com/package/otplib) (single user)
- [ ] Login via WebAuthn
- [ ] Public ~~tag~~ links (not based on tags)
- [ ] Groups
- [ ] Group visibility
- [ ] Required tags
- [ ] Tag combination logic
- [ ] Service Worker
- [ ] [Share target](https://developers.google.com/web/updates/2018/12/web-share-target)
