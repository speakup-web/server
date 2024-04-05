import { type CreateTaskforceAccountUseCase } from '@Applications/use_cases/CreateTaskforceAccountUseCase'
import { UserRole } from '@Domains/enums/UserRole'
import { authenticateMiddleware } from '@Infrastructures/http/express/middlewares/authenticateMiddleware'
import { authorizeMiddleware } from '@Infrastructures/http/express/middlewares/authorizeMiddleware'
import { type Request, Router, type Response } from 'express'
import httpStatus from 'http-status'

export const userRoutes = Router()

userRoutes.post(
  '/task-force',
  authenticateMiddleware({ required: true }),
  authorizeMiddleware([UserRole.ADMIN]),
  async (req: Request, res: Response) => {
    const createTaskforceAccountUseCase = req.container.resolve<CreateTaskforceAccountUseCase>(
      'createTaskforceAccountUseCase',
    )

    const data = await createTaskforceAccountUseCase.execute({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })

    res.status(httpStatus.CREATED).json({
      status: 'success',
      data,
    })
  },
)
