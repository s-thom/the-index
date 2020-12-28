# the-index Frontend

The React-based frontend for [the-index](https://github.com/s-thom/the-index).

## Development

### Prerequisites

- Node `14.x` or higher
- Run `npm install` and `npx lerna bootstrap` in the repository root

### Run dev server

```sh
npm run start
```

### Update `src/api-types.ts`

If you have changed the OpenAPI definition, then you will need to update the `api-types.ts` file accordingly. This is most easily done by running `npm run generate-types` in the repository root. This will also generate the types for the backend.

## Environment variables

In addition to the environment variables [used to configure `react-scripts`](https://create-react-app.dev/docs/advanced-configuration), the following can be used to change the app's behaviour.

| Name                  | Description                  | Required | Default value |
| --------------------- | ---------------------------- | -------- | ------------- |
| REACT_APP_SERVER_PATH | The base URL for the backend | ❌       | ``            |
