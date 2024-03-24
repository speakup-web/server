import { config } from '@Applications/common/config'
import type { TokenManager } from '@Applications/security/TokenManager'
import { HapiJwt } from '@hapi/jwt'

export class JwtTokenManager implements TokenManager {
  constructor(private token: HapiJwt.Token) {}

  createToken(payload: any): string {
    return this.token.generate(payload, config.jwt.secretKey)
  }

  decodeToken(token: string): any {
    const artifacts = this.token.decode(token)
    return artifacts.decoded.payload
  }
}
