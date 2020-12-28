# the-index Backend

The backend for [the-index](https://github.com/s-thom/the-index).

## Development

### Prerequisites

- Node `14.x` or higher
- Run `npm install` and `npx lerna bootstrap` in the repository root

### Run dev server

First, ensure you have set the relevant environment variables and database configuration.

```sh
npm run start
```

### Update `src/api-types.ts`

If you have changed the OpenAPI definition, then you will need to update the `api-types.ts` file accordingly. This is most easily done by running `npm run generate-types` in the repository root. This will also generate the types for the frontend.

## Environment variables

The following environment variables can be used to change the app's behaviour. An example file is provided (`example.env`).

| Name                | Description                                                        | Required | Default value |
| ------------------- | ------------------------------------------------------------------ | -------- | ------------- |
| SERVER_PORT         | The port the Express server will open on                           | ❌       | `7000`        |
| CORS_ALLOWED        | A hostname that cross origin requests are allowed from             | ❌       | `<undefined>` |
| EXPRESS_PROXY       | Whether Express trusts the first proxy the response will hit       | ❌       | `<undefined>` |
| LOGGER_LEVEL        | The level [the logger](https://github.com/pinojs/pino) will log at | ❌       | `info`        |
| DATABASE_CONNECTION | The item in the database configuration that will be used           | ❌       | `default`     |
| SESSION_SECRET      | The secret used to sign session tokens                             | ✅       |               |

## Database configuration

A [database configuration file](https://typeorm.io/#/using-ormconfig) is required to run the app. An example file is provided (`ormconfig.example.json`).

Alternatively, you can use the [TypeORM environment variables](https://typeorm.io/#/using-ormconfig/using-environment-variables) to configure the database. However, during development these may get annoying to work with.
