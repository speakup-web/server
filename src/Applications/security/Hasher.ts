export interface Hasher {
  hash(password: string): Promise<string>
  compare(password: string, encryptedPassword: string): Promise<void>
}
