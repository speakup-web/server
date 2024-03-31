import { Router } from 'express'
import { authRoutes } from './authRoutes'

export const routes = Router()

routes.use('/auth', authRoutes)
