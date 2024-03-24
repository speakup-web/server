type Payload = {
  id: string
  name: string
  email: string
  password: string
}

export class User {
  public id: string
  public name: string
  public email: string
  public password: string

  constructor(payload: Payload) {
    this.id = payload.id
    this.name = payload.name
    this.email = payload.email
    this.password = payload.password
  }
}
