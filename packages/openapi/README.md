# the-index OpenAPI Documentation

The API documentation for [the-index](https://github.com/s-thom/the-index).

## Development

### Prerequisites

- Node `14.x` or higher
- Run `npm install` and `npx lerna bootstrap` in the repository root

### Run dev server

```sh
npm run start
```

### Updating `src/api-types.ts` in the other projects

If you have changed the OpenAPI definition, then you will need to update the `api-types.ts` files accordingly. This is most easily done by running `npm run generate-types` in the repository root. This will generate the types in the other packages.
