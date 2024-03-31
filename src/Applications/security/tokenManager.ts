export interface ITokenManager {
  generate: (payload: Record<string, unknown>) => Promise<string>
  verify: (token: string) => Promise<Record<string, unknown>>
}
