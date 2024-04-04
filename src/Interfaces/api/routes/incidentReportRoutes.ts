import { type CreateNewIncidentReportUseCase } from '@Applications/use_cases/CreateNewIncidentReportUseCase'
import { Router } from 'express'

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
