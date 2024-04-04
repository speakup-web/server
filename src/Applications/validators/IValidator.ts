export interface IValidator<T> {
  validate: (payload: unknown) => T
}
