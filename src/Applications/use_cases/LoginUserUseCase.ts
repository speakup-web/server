import { type IHasher } from '@Applications/securities/IHasher'
import { type ITokenManager } from '@Applications/securities/ITokenManager'
import { type IValidator } from '@Applications/validators/IValidator'
import { AuthenticationError } from '@Commons/exceptions/AuthenticationError'
import { type IUserRepository } from '@Domains/repositories/IUserRepository'

interface UseCasePayload {
  email: string
  password: string
}

interface UseCaseResult {
  accessToken: string
}

export class LoginUserUseCase {
  constructor(
    private readonly validator: IValidator<UseCasePayload>,
    private readonly userRepository: IUserRepository,
    private readonly tokenManager: ITokenManager,
    private readonly hasher: IHasher,
  ) {}

  async execute(useCasePayload: unknown): Promise<UseCaseResult> {
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
      name: user.name,
      role: user.role,
    })

    const result: UseCaseResult = {
      accessToken,
    }

    return result
  }
}
