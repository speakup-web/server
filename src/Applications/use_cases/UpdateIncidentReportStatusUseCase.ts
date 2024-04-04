import { type IValidator } from '@Applications/validators/IValidator'
import { NotFoundError } from '@Commons/exceptions/NotFoundError'
import { IncidentReport } from '@Domains/entities/IncidentReport/IncidentReport'
import { type IncidentStatus } from '@Domains/enums/IncidentStatus'
import { type IIncidentReportRepository } from '@Domains/repositories/IIncidentReportRepository'

interface UseCasePayload {
  reportId: string
  status: IncidentStatus
}

interface UseCaseResult {
  reportId: string
}

export class UpdateIncidentReportStatusUseCase {
  constructor(
    private readonly validator: IValidator<UseCasePayload>,
    private readonly incidentReportRepository: IIncidentReportRepository,
  ) {}

  public async execute(useCasePayload: unknown): Promise<UseCaseResult> {
    const payload = this.validator.validate(useCasePayload)

    let incidentReport = await this.incidentReportRepository.findById(payload.reportId)

    if (!incidentReport) {
      throw new NotFoundError(`Incident report with ID ${payload.reportId} not found`)
    }

    incidentReport = new IncidentReport(
      incidentReport.id,
      incidentReport.incidentLocation,
      incidentReport.incidentDate,
      incidentReport.incidentDetail,
      payload.status,
      incidentReport.reporter,
    )

    await this.incidentReportRepository.save(incidentReport)

    const result: UseCaseResult = {
      reportId: incidentReport.id,
    }

    return result
  }
}
