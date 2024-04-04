import { type IValidator } from '@Applications/validators/IValidator'
import { type IIncidentReportRepository } from '@Domains/repositories/IIncidentReportRepository'
import { NotFoundError } from '@Commons/exceptions/NotFoundError'
import { IncidentStatus } from '@Domains/enums/IncidentStatus'

interface UseCasePayload {
  reportId: string
  isAuthenticated: boolean
}

interface UseCaseResult {
  id: string
  reporterName?: string
  reporterEmail?: string
  reporterPhone?: string
  incidentLocation: string
  incidentDate: Date
  incidentDetail: string
  incidentStatus: {
    submited: boolean
    onProgress: boolean
    canceled: boolean
    done: boolean
  }
}

export class GetIncidentReportDetailUseCase {
  constructor(
    private readonly validator: IValidator<UseCasePayload>,
    private readonly incidentReportRepository: IIncidentReportRepository,
  ) {}

  public async execute(useCasePayload: unknown): Promise<UseCaseResult> {
    const payload = this.validator.validate(useCasePayload)

    const incidentReport = await this.incidentReportRepository.findById(payload.reportId)

    if (!incidentReport) {
      throw new NotFoundError(`Incident report with ID ${payload.reportId} not found`)
    }

    const result: UseCaseResult = {
      id: incidentReport.id,
      incidentLocation: incidentReport.incidentLocation,
      incidentDate: incidentReport.incidentDate,
      incidentDetail: incidentReport.incidentDetail,
      incidentStatus: {
        submited: true,
        onProgress: false,
        canceled: false,
        done: false,
      },
    }

    if (payload.isAuthenticated) {
      const { reporter } = incidentReport
      result.reporterName = reporter.name
      result.reporterEmail = reporter.email
      result.reporterPhone = reporter.phone
    }

    switch (incidentReport.incidentStatus) {
      case IncidentStatus.ON_PROGRESS:
        result.incidentStatus.onProgress = true
        break
      case IncidentStatus.DONE:
        result.incidentStatus.onProgress = true
        result.incidentStatus.done = true
        break
      case IncidentStatus.CANCELED:
        result.incidentStatus.onProgress = true
        result.incidentStatus.canceled = true
        result.incidentStatus.done = true
        break
    }

    return result
  }
}
