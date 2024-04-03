import { type IncidentStatus } from '@Domains/enums/IncidentStatus'
import { type Reporter } from '../Reporter/Reporter'

export class IncidentReport {
  constructor(
    public readonly id: string,
    public readonly incidentLocation: string,
    public readonly incidentDate: Date,
    public readonly incidentDetail: string,
    public readonly incidentStatus: IncidentStatus,
    public readonly reporterId: Reporter['id'],
  ) {}
}
