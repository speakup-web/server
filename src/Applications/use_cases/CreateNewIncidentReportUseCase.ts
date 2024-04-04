import { type IValidator } from '@Applications/validators/IValidator'
import { type IIncidentReportRepository } from '@Domains/repositories/IIncidentReportRepository'
import { type IReporterRepository } from '@Domains/repositories/IReporterRepository'
import { IncidentReportBuilder } from '@Domains/entities/IncidentReport/IncidentReportBuilder'
import { ReporterBuilder } from '@Domains/entities/Reporter/ReporterBuilder'
import { IncidentStatus } from '@Domains/enums/IncidentStatus'

interface UseCasePayload {
  reporterName: string
  reporterEmail: string
  reporterPhone: string
  incidentLocation: string
  incidentDate: Date
  incidentDetail: string
}

interface UseCaseResult {
  reportId: string
}

export class CreateNewIncidentReportUseCase {
  constructor(
    private readonly validator: IValidator<UseCasePayload>,
    private readonly reporterRepository: IReporterRepository,
    private readonly incidentReportRepository: IIncidentReportRepository,
  ) {}

  async execute(useCasePayload: unknown): Promise<UseCaseResult> {
    const payload = this.validator.validate(useCasePayload)

    const reporter = new ReporterBuilder(
      payload.reporterName,
      payload.reporterEmail,
      payload.reporterPhone,
    ).build()
    const incidentReport = new IncidentReportBuilder(
      payload.incidentLocation,
      payload.incidentDate,
      payload.incidentDetail,
      IncidentStatus.SUBMITED,
      reporter.id,
    ).build()

    await this.reporterRepository.save(reporter)
    await this.incidentReportRepository.save(incidentReport)

    const result: UseCaseResult = {
      reportId: incidentReport.id,
    }

    return result
  }
}
