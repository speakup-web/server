import { type IHasher } from '@Applications/security/hasher'
import { type ITokenManager } from '@Applications/security/tokenManager'
import { type IValidator } from '@Applications/validation/validator'
import { User } from '@Domains/entitites/user'
import { type IUserRepository } from '@Domains/repositories/userRepository'
import { LoginUseCase } from '../loginUseCase'
import { AuthenticationError } from '@Commons/exceptions/authenticationError'

describe('LoginUseCase', () => {
  it('should throw AuthenticationError when user is not found', async () => {
    const useCasePayload = {
      email: 'johndoe@mail.com',
      password: 'secret_password',
    }

    const mockValidator: Partial<IValidator<typeof useCasePayload>> = {
      validate: jest.fn().mockReturnValueOnce(useCasePayload),
    }
    const mockUserRepository: Partial<IUserRepository> = {
      findByEmail: jest.fn().mockResolvedValueOnce(undefined),
    }

    const loginUseCase = new LoginUseCase(
      mockValidator as IValidator<typeof useCasePayload>,
      mockUserRepository as IUserRepository,
      {} as ITokenManager,
      {} as IHasher,
    )

    await expect(loginUseCase.execute(useCasePayload)).rejects.toThrow(AuthenticationError)
  })

  it('should throw AuthenticationError when password is incorrect', async () => {
    const useCasePayload = {
      email: 'johndoe@mail.com',
      password: 'secret_password',
    }
    const user = new User({
      id: 'user-123',
      email: useCasePayload.email,
      name: 'John Doe',
      password: 'hashed_password',
      role: 'admin',
    })

    const mockValidator: Partial<IValidator<typeof useCasePayload>> = {
      validate: jest.fn().mockReturnValueOnce(useCasePayload),
    }
    const mockUserRepository: Partial<IUserRepository> = {
      findByEmail: jest.fn().mockResolvedValueOnce(user),
    }
    const mockHasher: Partial<IHasher> = {
      compare: jest.fn().mockResolvedValueOnce(false),
    }

    const loginUseCase = new LoginUseCase(
      mockValidator as IValidator<typeof useCasePayload>,
      mockUserRepository as IUserRepository,
      {} as ITokenManager,
      mockHasher as IHasher,
    )

    await expect(loginUseCase.execute(useCasePayload)).rejects.toThrow(AuthenticationError)
  })

  it('should orchestrates the login use case', async () => {
    const useCasePayload = {
      email: 'johndoe@mail.com',
      password: 'secret_password',
    }
    const user = new User({
      id: 'user-123',
      email: useCasePayload.email,
      name: 'John Doe',
      password: useCasePayload.password,
      role: 'admin',
    })

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

    const loginUseCase = new LoginUseCase(
      mockValidator as IValidator<typeof useCasePayload>,
      mockUserRepository as IUserRepository,
      mockTokenManager as ITokenManager,
      mockHasher as IHasher,
    )

    const accessToken = await loginUseCase.execute(useCasePayload)

    expect(accessToken).toEqual('access_token')
    expect(mockValidator.validate).toHaveBeenCalledWith(useCasePayload)
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(useCasePayload.email)
    expect(mockHasher.compare).toHaveBeenCalledWith(useCasePayload.password, user.password)
    expect(mockTokenManager.generate).toHaveBeenCalledWith({
      sub: user.id,
      role: user.role,
    })
  })
})
