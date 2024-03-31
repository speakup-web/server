interface Payload {
  id: string
  name: string
  email: string
  password: string
  role: string
}

export class User {
  public readonly id: string
  public readonly name: string
  public readonly email: string
  public readonly password: string
  public readonly role: string

  constructor(payload: Payload) {
    this.id = payload.id
    this.name = payload.name
    this.email = payload.email
    this.password = payload.password
    this.role = payload.role
  }
}
