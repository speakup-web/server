import { type CreateNewIncidentReportUseCase } from '@Applications/use_cases/CreateNewIncidentReportUseCase'
import { type GetAllIncidentReportsUseCase } from '@Applications/use_cases/GetAllIncidentReportsUseCase'
import { type GetIncidentReportStatsUseCase } from '@Applications/use_cases/GetIncidentReportStatsUseCase'
import { UserRole } from '@Domains/enums/UserRole'
import { authenticateMiddleware } from '@Infrastructures/http/express/middlewares/authenticateMiddleware'
import { authorizeMiddleware } from '@Infrastructures/http/express/middlewares/authorizeMiddleware'
import { type Request, type Response, Router } from 'express'

export const incidentReportRoutes = Router()

incidentReportRoutes.post('/', async (req, res) => {
  const createNewIncidentReportUseCase = req.container.resolve<CreateNewIncidentReportUseCase>(
    'createNewIncidentReportUseCase',
  )

  const data = await createNewIncidentReportUseCase.execute({
    reporterName: req.body.reporterName,
    reporterEmail: req.body.reporterEmail,
    reporterPhone: req.body.reporterPhone,
    incidentLocation: req.body.incidentLocation,
    incidentDate: req.body.incidentDate,
    incidentDetail: req.body.incidentDetail,
  })

  res.json({
    status: 'success',
    data,
  })
})

incidentReportRoutes.get(
  '/',
  authenticateMiddleware({ required: true }),
  authorizeMiddleware([UserRole.ADMIN, UserRole.TASKFORCE]),
  async (req: Request, res: Response) => {
    const getAllIncidentReportsUseCase = req.container.resolve<GetAllIncidentReportsUseCase>(
      'getAllIncidentReportsUseCase',
    )

    const data = await getAllIncidentReportsUseCase.execute({
      offset: req.query.offset,
      limit: req.query.limit,
      status: req.query.status,
    })

    res.json({
      status: 'success',
      data,
    })
  },
)

incidentReportRoutes.get(
  '/stats',
  authenticateMiddleware({ required: true }),
  authorizeMiddleware([UserRole.ADMIN, UserRole.TASKFORCE]),
  async (req: Request, res: Response) => {
    const getIncidentReportStatsUseCase = req.container.resolve<GetIncidentReportStatsUseCase>(
      'getIncidentReportStatsUseCase',
    )

    const data = await getIncidentReportStatsUseCase.execute()

    res.json({
      status: 'success',
      data,
    })
  },
)
