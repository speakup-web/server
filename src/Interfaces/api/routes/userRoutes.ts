import { type Request, Router, type Response } from 'express'
import { type GetUserProfileUseCase } from '@Applications/use_cases/GetUserProfileUseCase'
import { type UpdateUserUseCase } from '@Applications/use_cases/UpdateUserUseCase'
import { type CreateTaskforceAccountUseCase } from '@Applications/use_cases/CreateTaskforceAccountUseCase'
import { type GetTaskforceProfilesUseCase } from '@Applications/use_cases/GetTaskforceProfilesUseCase'
import { type DeleteTaskforceUseCase } from '@Applications/use_cases/DeleteTaskforceUseCase'
import { type UpdateTaskforceUseCase } from '@Applications/use_cases/UpdateTaskforceUseCase'
import { UserRole } from '@Domains/enums/UserRole'
import { authenticateMiddleware } from '@Infrastructures/http/express/middlewares/authenticateMiddleware'
import { authorizeMiddleware } from '@Infrastructures/http/express/middlewares/authorizeMiddleware'
import httpStatus from 'http-status'

export const userRoutes = Router()

userRoutes.get(
  '/profile',
  authenticateMiddleware({ required: true }),
  async (req: Request, res: Response) => {
    const getUserProfileUseCase =
      req.container.resolve<GetUserProfileUseCase>('getUserProfileUseCase')

    const data = await getUserProfileUseCase.execute({ user: req.user })

    res.json({
      status: 'success',
      data,
    })
  },
)

userRoutes.put(
  '/profile',
  authenticateMiddleware({ required: true }),
  async (req: Request, res: Response) => {
    const getUserProfileUseCase = req.container.resolve<UpdateUserUseCase>('updateUserUseCase')

    const data = await getUserProfileUseCase.execute({
      user: req.user,
      name: req.body.name,
      password: req.body.password,
    })

    res.json({
      status: 'success',
      data,
    })
  },
)

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

userRoutes.get(
  '/task-force',
  authenticateMiddleware({ required: true }),
  authorizeMiddleware([UserRole.ADMIN]),
  async (req: Request, res: Response) => {
    const getTaskforceProfilesUseCase = req.container.resolve<GetTaskforceProfilesUseCase>(
      'getTaskforceProfilesUseCase',
    )

    const data = await getTaskforceProfilesUseCase.execute({
      limit: req.query.limit,
      offset: req.query.offset,
    })

    res.json({
      status: 'success',
      data,
    })
  },
)

userRoutes.delete(
  '/task-force/:email',
  authenticateMiddleware({ required: true }),
  authorizeMiddleware([UserRole.ADMIN]),
  async (req: Request, res: Response) => {
    const deleteTaskforceUseCase =
      req.container.resolve<DeleteTaskforceUseCase>('deleteTaskforceUseCase')

    const data = await deleteTaskforceUseCase.execute({
      email: req.params.email,
    })

    res.json({
      status: 'success',
      data,
    })
  },
)

userRoutes.put(
  '/task-force/:email',
  authenticateMiddleware({ required: true }),
  authorizeMiddleware([UserRole.ADMIN]),
  async (req: Request, res: Response) => {
    const deleteTaskforceUseCase =
      req.container.resolve<UpdateTaskforceUseCase>('updateTaskforceUseCase')

    const data = await deleteTaskforceUseCase.execute({
      email: req.params.email,
      name: req.body.name,
      password: req.body.password,
    })

    res.json({
      status: 'success',
      data,
    })
  },
)
