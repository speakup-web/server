import { nanoid } from 'nanoid'

interface Payload {
  id?: Reporter['id']
  name: Reporter['name']
  email: Reporter['email']
  phone: Reporter['phone']
}

export class Reporter {
  public readonly id: string
  public readonly name: string
  public readonly email: string
  public readonly phone: string

  constructor(payload: Payload) {
    this.id = payload.id ?? `reporter-${nanoid()}`
    this.name = payload.name
    this.email = payload.email
    this.phone = payload.phone
  }
}
