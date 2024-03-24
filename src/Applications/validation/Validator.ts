export interface Validator {
  validate<T>(payload: T): T
}
