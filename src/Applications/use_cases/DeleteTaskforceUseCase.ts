import { type IValidator } from '@Applications/validators/IValidator'
import { type IUserRepository } from '@Domains/repositories/IUserRepository'
import { UserRole } from '@Domains/enums/UserRole'
import { NotFoundError } from '@Commons/exceptions/NotFoundError'
import { InvariantError } from '@Commons/exceptions/InvariantError'

interface UseCasePayload {
  email: string
}

interface UseCaseResult {
  userId: string
}

export class DeleteTaskforceUseCase {
  constructor(
    private readonly validator: IValidator<UseCasePayload>,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(useCasePayload: unknown): Promise<UseCaseResult> {
    const payload = this.validator.validate(useCasePayload)

    const user = await this.userRepository.findByEmail(payload.email)

    if (!user) {
      throw new NotFoundError('User not found.')
    } else if (user.role === UserRole.ADMIN) {
      throw new InvariantError('Cannot delete an admin user.')
    }

    await this.userRepository.deleteByEmail(user.email)

    const result: UseCaseResult = {
      userId: user.id,
    }

    return result
  }
}
