# the-index

## Backend

Uses an SQLite3 database for now. Database versioning is done with [flyway](https://flywaydb.org/).

Required environment variables (a `.env` file is supported):

- `DB_PATH` File for the SQLite databse e.g. `database.sqlite`
- `DB_USER`: Username for the database
- `DB_PASS`: Password for the database
- `FLYWAY_URL`: JDBC path to the database e.g. `jdbc:sqlite:database.sqlite`
- `FLYWAY_USER`: Same as `DB_USER`
- `FLYWAY_PASSWORD`: Same as `DB_PASS`
