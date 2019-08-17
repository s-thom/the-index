# the-index

A personal index.

I needed a place to store links to things in an organised manner, so I built one. It's still a work in progress.

## Frontend

Required environment variables (Normal CRA `.env` rules apply):

- `SERVER_PATH`: Where to find the server

## Backend

Uses an SQLite3 database for now. Database versioning is done with [flyway](https://flywaydb.org/).

Required environment variables (a `.env` file is supported):

- `DB_PATH`: File for the SQLite databse e.g. `database.sqlite`
- `DB_USER`: Username for the database
- `DB_PASS`: Password for the database
- `FLYWAY_URL`: JDBC path to the database e.g. `jdbc:sqlite:database.sqlite`
- `FLYWAY_USER`: Same as `DB_USER`
- `FLYWAY_PASSWORD`: Same as `DB_PASS`
