import type { Validator } from '@Applications/validation/Validator'
import { LoginUseCase, type UseCasePayload } from '../login.use_case'
import type { UserRepository } from '@Domains/user/user.repository'
import type { TokenManager } from '@Applications/security/TokenManager'
import type { Hasher } from '@Applications/security/Hasher'

describe('loginUseCase', () => {
  it('should orchestrates the login process', async () => {
    const useCasePayload: UseCasePayload = {
      email: 'example@mail.com',
      password: 'secret',
    }

    const mockUserRepository = {
      getPasswordByEmail: jest.fn().mockResolvedValueOnce('encrypted_password'),
      getRoleByEmail: jest.fn().mockResolvedValueOnce('admin'),
    } as jest.Mocked<UserRepository>
    const mockValidator = {
      validate: jest.fn().mockImplementationOnce(() => useCasePayload),
    } as jest.Mocked<Validator>
    const mockTokenManager = {
      createToken: jest.fn().mockReturnValue('access_token'),
    } as unknown as jest.Mocked<TokenManager>
    const mockHasher = {
      compare: jest.fn().mockImplementationOnce(() => Promise.resolve()),
    } as unknown as jest.Mocked<Hasher>

    const useCase = new LoginUseCase({
      userRepository: mockUserRepository,
      validator: mockValidator,
      tokenManager: mockTokenManager,
      hasher: mockHasher,
    })

    const token = await useCase.execute({ ...useCasePayload })

    expect(token).toEqual('access_token')
    expect(mockUserRepository.getPasswordByEmail).toHaveBeenCalledWith(useCasePayload.email)
    expect(mockUserRepository.getRoleByEmail).toHaveBeenCalledWith(useCasePayload.email)
    expect(mockValidator.validate).toHaveBeenCalledWith(useCasePayload)
    expect(mockTokenManager.createToken).toHaveBeenCalledWith({ email: useCasePayload.email, role: 'admin' })
    expect(mockHasher.compare).toHaveBeenCalledWith(useCasePayload.password, 'encrypted_password')
  })
})
