import { Router } from 'express'
import { authRoutes } from './authRoutes'
import { incidentReportRoutes } from './incidentReportRoutes'
import { userRoutes } from './userRoutes'

export const routes = Router()

routes.use('/auth', authRoutes)
routes.use('/incident-reports', incidentReportRoutes)
routes.use('/users', userRoutes)
