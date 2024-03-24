export abstract class ClientError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message)
    this.name = 'ClientError'
  }
}
