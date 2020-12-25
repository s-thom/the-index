export default class MultipleError extends Error {
  readonly errors: Error[] = [];

  constructor(errors: Error[]) {
    super(
      // The `super()` call must be the first thing in the constructor.
      // However, we need to process the incoming errors array to flatten out the MultipleErrors.
      // This is some pretty ugly stuff
      (() => {
        for (const error of errors) {
          if (error instanceof MultipleError) {
            this.errors.push(...error.errors);
          } else {
            this.errors.push(error);
          }
        }

        return `${this.errors.length} errors`;
      })(),
    );

    // Typescript compiles errors weird
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
