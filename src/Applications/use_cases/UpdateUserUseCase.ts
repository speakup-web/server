import { type UserRole } from '@Domains/enums/UserRole'
import { type IValidator } from '@Applications/validators/IValidator'
import { type IUserRepository } from '@Domains/repositories/IUserRepository'
import { type IHasher } from '@Applications/securities/IHasher'
import { User } from '@Domains/entities/User/User'

interface UseCasePayload {
  user: {
    email: string
    role: UserRole
  }
  name: string
  password: string
}

interface UseCaseResult {
  userId: string
}

export class UpdateUserUseCase {
  constructor(
    private readonly validator: IValidator<UseCasePayload>,
    private readonly userRepository: IUserRepository,
    private readonly hasher: IHasher,
  ) {}

  public async execute(useCasePayload: unknown): Promise<UseCaseResult> {
    const payload = this.validator.validate(useCasePayload)

    const user = (await this.userRepository.findByEmail(payload.user.email))!

    let hashedPassword = user.password
    if (payload.password) {
      hashedPassword = await this.hasher.hash(payload.password)
    }

    const updatedUser = new User(
      user.id,
      payload.name || user.name,
      user.email,
      hashedPassword,
      user.role,
    )

    await this.userRepository.save(updatedUser)

    const result: UseCaseResult = {
      userId: user.id,
    }

    return result
  }
}
