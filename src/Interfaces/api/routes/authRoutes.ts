import { type LoginUseCase } from '@Applications/use_cases/loginUseCase'
import { Router } from 'express'

export const authRoutes = Router()

authRoutes.post('/login', async (req, res) => {
  const loginUseCase = req.container.resolve<LoginUseCase>('loginUseCase')

  const accessToken = await loginUseCase.execute({
    email: req.body.email,
    password: req.body.password,
  })

  res.json({
    status: 'success',
    data: {
      accessToken,
    },
  })
})
