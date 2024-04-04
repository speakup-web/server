import { IncidentStatus } from '@Domains/enums/IncidentStatus'
import { type IIncidentReportRepository } from '@Domains/repositories/IIncidentReportRepository'

interface UseCaseResult {
  totalReporters: number
  submitedReports: number
  onProgressReports: number
  doneReports: number
}

export class GetIncidentReportStatsUseCase {
  constructor(private readonly incidentReportRepository: IIncidentReportRepository) {}

  public async execute(): Promise<UseCaseResult> {
    const incidentReports = await this.incidentReportRepository.findAll()

    const totalReporters = new Set(incidentReports.map((report) => report.reporter.id)).size
    const submitedReports = incidentReports.length
    const onProgressReports = incidentReports.filter(
      (report) => report.incidentStatus === IncidentStatus.ON_PROGRESS,
    ).length
    const doneReports = incidentReports.filter(
      (report) => report.incidentStatus === IncidentStatus.DONE,
    ).length

    const result: UseCaseResult = {
      totalReporters,
      submitedReports,
      onProgressReports,
      doneReports,
    }

    return result
  }
}
