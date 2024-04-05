import { type IHasher } from '@Applications/securities/IHasher'
import { type IValidator } from '@Applications/validators/IValidator'
import { ConflictError } from '@Commons/exceptions/ConflictError'
import { UserBuilder } from '@Domains/entities/User/UserBuilder'
import { UserRole } from '@Domains/enums/UserRole'
import { type IUserRepository } from '@Domains/repositories/IUserRepository'

interface UseCasePayload {
  name: string
  email: string
  password: string
}

interface UseCaseResult {
  userId: string
}

export class CreateTaskforceAccountUseCase {
  constructor(
    private readonly validator: IValidator<UseCasePayload>,
    private readonly userRepository: IUserRepository,
    private readonly hasher: IHasher,
  ) {}

  public async execute(useCasePayload: unknown): Promise<UseCaseResult> {
    const payload = this.validator.validate(useCasePayload)

    const user = await this.userRepository.findByEmail(payload.email)

    if (user) {
      throw new ConflictError('Email already registered')
    }

    const hashedPassword = await this.hasher.hash(payload.password)

    const taskforce = new UserBuilder(
      payload.name,
      payload.email,
      hashedPassword,
      UserRole.TASKFORCE,
    ).build()

    await this.userRepository.save(taskforce)

    const result: UseCaseResult = {
      userId: taskforce.id,
    }

    return result
  }
}
