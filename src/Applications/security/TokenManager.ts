export interface TokenManager {
  createToken(payload: any): string
  decodeToken(token: string): any
}
