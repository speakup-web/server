import { nanoid } from 'nanoid'
import { IncidentReport } from './IncidentReport'

export class IncidentReportBuilder {
  constructor(
    private readonly incidentLocation: IncidentReport['incidentLocation'],
    private readonly incidentDate: IncidentReport['incidentDate'],
    private readonly incidentDetail: IncidentReport['incidentDetail'],
    private readonly incidentStatus: IncidentReport['incidentStatus'],
    private readonly reporterId: IncidentReport['reporterId'],
  ) {}

  public build(): IncidentReport {
    const id = `report-${nanoid()}`
    return new IncidentReport(
      id,
      this.incidentLocation,
      this.incidentDate,
      this.incidentDetail,
      this.incidentStatus,
      this.reporterId,
    )
  }
}
