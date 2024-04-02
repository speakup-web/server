import { nanoid } from 'nanoid'

interface Payload {
  id?: User['id']
  name: User['name']
  email: User['email']
  password: User['password']
  role: User['role']
}

export enum UserRoles {
  ADMIN = 'admin',
  TASKFORCE = 'taskforce',
}

export class User {
  public readonly id: string
  public readonly name: string
  public readonly email: string
  public readonly password: string
  public readonly role: UserRoles

  constructor(payload: Payload) {
    this.id = payload.id ?? `user-${nanoid()}`
    this.name = payload.name
    this.email = payload.email
    this.password = payload.password
    this.role = payload.role
  }
}
