import type * as jose from 'jose'
import { type ITokenManager } from '@Applications/securities/ITokenManager'
import { config } from '@Commons/config'

type Jwt = typeof jose

export class JwtTokenManager implements ITokenManager {
  constructor(private readonly jwt: Jwt) {}

  public async generate(payload: Record<string, unknown>): Promise<string> {
    const signJwt = new this.jwt.SignJWT(payload)
    const alg = 'HS256'
    const secret = new TextEncoder().encode(config.jwt.secretKey)

    const token = await signJwt
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime(config.jwt.expiresIn)
      .sign(secret)

    return token
  }

  public async verify(token: string): Promise<Record<string, unknown>> {
    const secret = new TextEncoder().encode(config.jwt.secretKey)
    const { payload } = await this.jwt.jwtVerify(token, secret)
    return payload
  }
}
