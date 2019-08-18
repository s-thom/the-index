# the-index

A personal index.

I needed a place to store links to things in an organised manner, so I built one. It's still a work in progress.

This project uses VS Code's dev containers. If you want your dev environment consistent with what I use, then install the "Remote - Containers" extension.

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
- `DB_PATH`: File for the SQLite databse e.g. `database.sqlite`
- `DB_USER`: Username for the database
- `DB_PASS`: Password for the database
- `FLYWAY_URL`: JDBC path to the database e.g. `jdbc:sqlite:database.sqlite`
- `FLYWAY_USER`: Same as `DB_USER`
- `FLYWAY_PASSWORD`: Same as `DB_PASS`

Optional variables:

- `SERVER_PORT`: Port for express to run on

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

## TODO

- [ ] Basic prototype
- [ ] Login via TOTP code (single user)
- [ ] Public tag
- [ ] Required tags
- [ ] Multiuser
