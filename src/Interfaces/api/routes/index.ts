import { Router } from 'express'
import { authRoutes } from './authRoutes'
import { incidentReportRoutes } from './incidentReportRoutes'

export const routes = Router()

routes.use('/auth', authRoutes)
routes.use('/incident-reports', incidentReportRoutes)
