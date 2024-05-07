import { type UserRole } from '@Domains/enums/UserRole'
import { type IValidator } from '@Applications/validators/IValidator'
import { type IUserRepository } from '@Domains/repositories/IUserRepository'

interface UseCasePayload {
  user: {
    email: string
    role: UserRole
  }
}

interface UseCaseResult {
  name: string
  email: string
}

export class GetUserProfileUseCase {
  constructor(
    private readonly validator: IValidator<UseCasePayload>,
    private readonly userRepository: IUserRepository,
  ) {}

  public async execute(useCasePayload: unknown): Promise<UseCaseResult> {
    const payload = this.validator.validate(useCasePayload)

    const user = (await this.userRepository.findByEmail(payload.user.email))!

    const result: UseCaseResult = {
      name: user.name,
      email: user.email,
    }

    return result
  }
}
