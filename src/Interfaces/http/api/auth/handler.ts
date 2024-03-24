import type { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi'
import type { Container } from '../../../../types'
import type { LoginUseCase } from '@Applications/use_cases/login.use_case'

export class AuthHandler {
  constructor(private container: Container) {}

  postAuthLoginHandler = async (request: Request, h: ResponseToolkit): Promise<ResponseObject> => {
    const loginUseCase: LoginUseCase = this.container.resolve('loginUseCase')
    const token = await loginUseCase.execute(request.payload)

    const response = h.response({
      status: 'success',
      data: {
        token,
      },
    })
    return response
  }
}
