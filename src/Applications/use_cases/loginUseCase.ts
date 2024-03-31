import { type IHasher } from '@Applications/security/hasher'
import { type ITokenManager } from '@Applications/security/tokenManager'
import { type IValidator } from '@Applications/validation/validator'
import { AuthenticationError } from '@Commons/exceptions/authenticationError'
import { type IUserRepository } from '@Domains/repositories/userRepository'

interface UseCasePayload {
  email: string
  password: string
}

export class LoginUseCase {
  constructor(
    private readonly validator: IValidator<UseCasePayload>,
    private readonly userRepository: IUserRepository,
    private readonly tokenManager: ITokenManager,
    private readonly hasher: IHasher,
  ) {}

  async execute(useCasePayload: UseCasePayload) {
    const payload = this.validator.validate(useCasePayload)

    const user = await this.userRepository.findByEmail(payload.email)

    if (!user) {
      throw new AuthenticationError('Invalid email or password.')
    }

    const passwordMatch = await this.hasher.compare(payload.password, user.password)

    if (!passwordMatch) {
      throw new AuthenticationError('Invalid email or password.')
    }

    const accessToken = await this.tokenManager.generate({
      sub: user.id,
      role: user.role,
    })

    return accessToken
  }
}
