import { type IValidator } from '@Applications/validators/IValidator'
import { UserRole } from '@Domains/enums/UserRole'
import { type IUserRepository } from '@Domains/repositories/IUserRepository'

interface UseCasePayload {
  offset: number
  limit: number
}

interface UseCaseResult {
  count: number
  results: Array<{
    id: string
    name: string
    email: string
  }>
}

export class GetTaskforceProfilesUseCase {
  constructor(
    private readonly validator: IValidator<UseCasePayload>,
    private readonly userRepository: IUserRepository,
  ) {}

  public async execute(useCasePayload: unknown): Promise<UseCaseResult> {
    const payload = this.validator.validate(useCasePayload)

    const count = await this.userRepository.countAll(UserRole.TASKFORCE)
    const results = await this.userRepository.findAll(
      payload.limit,
      payload.offset,
      UserRole.TASKFORCE,
    )

    const result: UseCaseResult = {
      count,
      results: results.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
      })),
    }

    return result
  }
}
