import { type IValidator } from '@Applications/validators/IValidator'
import { type IUserRepository } from '@Domains/repositories/IUserRepository'
import { type IHasher } from '@Applications/securities/IHasher'
import { User } from '@Domains/entities/User/User'
import { NotFoundError } from '@Commons/exceptions/NotFoundError'
import { UserRole } from '@Domains/enums/UserRole'
import { InvariantError } from '@Commons/exceptions/InvariantError'

interface UseCasePayload {
  email: string
  name: string
  password: string
}

interface UseCaseResult {
  userId: string
}

export class UpdateTaskforceUseCase {
  constructor(
    private readonly validator: IValidator<UseCasePayload>,
    private readonly userRepository: IUserRepository,
    private readonly hasher: IHasher,
  ) {}

  public async execute(useCasePayload: unknown): Promise<UseCaseResult> {
    const payload = this.validator.validate(useCasePayload)

    const user = await this.userRepository.findByEmail(payload.email)

    if (!user) {
      throw new NotFoundError('User not found.')
    } else if (user.role === UserRole.ADMIN) {
      throw new InvariantError('Cannot edit an admin user.')
    }

    let hashedPassword = user.password
    if (payload.password) {
      hashedPassword = await this.hasher.hash(payload.password)
    }

    const updatedTaskforce = new User(
      user.id,
      payload.name || user.name,
      user.email,
      hashedPassword,
      user.role,
    )

    await this.userRepository.save(updatedTaskforce)

    const result: UseCaseResult = {
      userId: user.id,
    }

    return result
  }
}
