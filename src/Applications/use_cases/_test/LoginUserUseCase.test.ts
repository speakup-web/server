import { type IHasher } from '@Applications/securities/IHasher'
import { type ITokenManager } from '@Applications/securities/ITokenManager'
import { type IValidator } from '@Applications/validators/IValidator'
import { type IUserRepository } from '@Domains/repositories/IUserRepository'
import { LoginUserUseCase } from '../LoginUserUseCase'
import { AuthenticationError } from '@Commons/exceptions/AuthenticationError'
import { UserBuilder } from '@Domains/entities/User/UserBuilder'
import { UserRole } from '@Domains/enums/UserRole'

describe('LoginUserUseCase', () => {
  it('should throw AuthenticationError when user is not found', async () => {
    const useCasePayload = {
      email: 'johndoe@mail.com',
      password: 'secret_password',
    }

    const mockValidator: Partial<IValidator<typeof useCasePayload>> = {
      validate: jest.fn().mockReturnValueOnce(useCasePayload),
    }
    const mockUserRepository: Partial<IUserRepository> = {
      findByEmail: jest.fn().mockResolvedValueOnce(null),
    }

    const loginUserUseCase = new LoginUserUseCase(
      mockValidator as IValidator<typeof useCasePayload>,
      mockUserRepository as IUserRepository,
      {} as ITokenManager,
      {} as IHasher,
    )

    await expect(loginUserUseCase.execute(useCasePayload)).rejects.toThrow(AuthenticationError)
  })

  it('should throw AuthenticationError when password is incorrect', async () => {
    const useCasePayload = {
      email: 'johndoe@mail.com',
      password: 'secret_password',
    }
    const user = new UserBuilder(
      'John Doe',
      useCasePayload.email,
      'hashed_password',
      UserRole.ADMIN,
    ).build()

    const mockValidator: Partial<IValidator<typeof useCasePayload>> = {
      validate: jest.fn().mockReturnValueOnce(useCasePayload),
    }
    const mockUserRepository: Partial<IUserRepository> = {
      findByEmail: jest.fn().mockResolvedValueOnce(user),
    }
    const mockHasher: Partial<IHasher> = {
      compare: jest.fn().mockResolvedValueOnce(false),
    }

    const loginUserUseCase = new LoginUserUseCase(
      mockValidator as IValidator<typeof useCasePayload>,
      mockUserRepository as IUserRepository,
      {} as ITokenManager,
      mockHasher as IHasher,
    )

    await expect(loginUserUseCase.execute(useCasePayload)).rejects.toThrow(AuthenticationError)
  })

  it('should orchestrates the login use case', async () => {
    const useCasePayload = {
      email: 'johndoe@mail.com',
      password: 'secret_password',
    }
    const user = new UserBuilder(
      'John Doe',
      useCasePayload.email,
      useCasePayload.password,
      UserRole.ADMIN,
    ).build()

    const mockValidator: Partial<IValidator<typeof useCasePayload>> = {
      validate: jest.fn().mockReturnValueOnce(useCasePayload),
    }
    const mockUserRepository: Partial<IUserRepository> = {
      findByEmail: jest.fn().mockResolvedValueOnce(user),
    }
    const mockTokenManager: Partial<ITokenManager> = {
      generate: jest.fn().mockResolvedValueOnce('access_token'),
    }
    const mockHasher: Partial<IHasher> = {
      compare: jest.fn().mockResolvedValueOnce(true),
    }

    const loginUserUseCase = new LoginUserUseCase(
      mockValidator as IValidator<typeof useCasePayload>,
      mockUserRepository as IUserRepository,
      mockTokenManager as ITokenManager,
      mockHasher as IHasher,
    )

    const data = await loginUserUseCase.execute(useCasePayload)

    expect(data.accessToken).toEqual('access_token')
    expect(mockValidator.validate).toHaveBeenCalledWith(useCasePayload)
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(useCasePayload.email)
    expect(mockHasher.compare).toHaveBeenCalledWith(useCasePayload.password, user.password)
    expect(mockTokenManager.generate).toHaveBeenCalledWith({
      sub: user.id,
      role: user.role,
    })
  })
})
