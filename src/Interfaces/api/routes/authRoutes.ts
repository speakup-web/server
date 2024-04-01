import { type LoginUserUseCase } from '@Applications/use_cases/loginUserUseCase'
import { Router } from 'express'

export const authRoutes = Router()

authRoutes.post('/login', async (req, res) => {
  const loginUserUseCase = req.container.resolve<LoginUserUseCase>('loginUserUseCase')

  const data = await loginUserUseCase.execute({
    email: req.body.email,
    password: req.body.password,
  })

  res.json({
    status: 'success',
    data,
  })
})
