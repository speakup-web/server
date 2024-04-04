import { type IValidator } from '@Applications/validators/IValidator'
import { type IncidentStatus } from '@Domains/enums/IncidentStatus'
import { type IIncidentReportRepository } from '@Domains/repositories/IIncidentReportRepository'

interface UseCasePayload {
  offset: number
  limit: number
  status?: IncidentStatus
}

interface UseCaseResult {
  count: number
  results: Array<{
    id: string
    reporterName: string
    reporterEmail: string
    incidentDetail: string
  }>
}

export class GetAllIncidentReportsUseCase {
  constructor(
    private readonly validator: IValidator<UseCasePayload>,
    private readonly incidentReportRepository: IIncidentReportRepository,
  ) {}

  public async execute(useCasePayload: unknown): Promise<UseCaseResult> {
    const payload = this.validator.validate(useCasePayload)

    const count = await this.incidentReportRepository.countAll()
    const incidentReports = await this.incidentReportRepository.findAll(
      payload.limit,
      payload.offset,
      payload.status,
    )

    const result: UseCaseResult = {
      count,
      results: incidentReports.map((report) => ({
        id: report.id,
        reporterName: report.reporter.name,
        reporterEmail: report.reporter.email,
        incidentDetail: report.incidentDetail,
      })),
    }

    return result
  }
}
