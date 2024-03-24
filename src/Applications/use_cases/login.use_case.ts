import type { Hasher } from '@Applications/security/Hasher'
import type { TokenManager } from '@Applications/security/TokenManager'
import type { Validator } from '@Applications/validation/Validator'
import type { UserRepository } from '@Domains/user/user.repository'

type Dependencies = {
  userRepository: UserRepository
  validator: Validator
  tokenManager: TokenManager
  hasher: Hasher
}

export type UseCasePayload = {
  email: string
  password: string
}

export class LoginUseCase {
  private userRepository: UserRepository
  private validator: Validator
  private tokenManager: TokenManager
  private hasher: Hasher

  constructor(dependencies: Dependencies) {
    this.userRepository = dependencies.userRepository
    this.validator = dependencies.validator
    this.tokenManager = dependencies.tokenManager
    this.hasher = dependencies.hasher
  }

  async execute(useCasePayload: any) {
    const { email, password } = this.validator.validate<UseCasePayload>(useCasePayload)

    const encryptedPassword = await this.userRepository.getPasswordByEmail(email)

    await this.hasher.compare(password, encryptedPassword)

    const role = await this.userRepository.getRoleByEmail(email)
    const token = this.tokenManager.createToken({ email, role })

    return token
  }
}
