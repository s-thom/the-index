export default class MultipleError extends Error {
  readonly errors: Error[];

  constructor(errors: Error[]) {
    const errorArray = [];
    for (const error of errors) {
      if (error instanceof MultipleError) {
        errorArray.push(...error.errors);
      } else {
        errorArray.push(error);
      }
    }

    super(`${errorArray.length} errors`);

    // Typescript compiles errors weird
    Object.setPrototypeOf(this, new.target.prototype);

    this.errors = errorArray;
  }
}
