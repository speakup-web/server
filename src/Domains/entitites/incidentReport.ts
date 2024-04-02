import { nanoid } from 'nanoid'
import { type Reporter } from './reporter'

interface Payload {
  id?: IncidentReport['id']
  incidentLocation: IncidentReport['incidentLocation']
  incidentDate: IncidentReport['incidentDate']
  incidentDetail: IncidentReport['incidentDetail']
  incidentStatus: IncidentReport['incidentStatus']
  reporterId: IncidentReport['reporterId']
}

export enum IncidentStatuses {
  SUBMITED = 'submited',
  ON_PROGRESS = 'on-progress',
  CANCELED = 'canceled',
  DONE = 'done',
}

export class IncidentReport {
  public readonly id: string
  public readonly incidentLocation: string
  public readonly incidentDate: Date
  public readonly incidentDetail: string
  public readonly incidentStatus: IncidentStatuses
  public readonly reporterId: Reporter['id']

  constructor(payload: Payload) {
    this.id = payload.id ?? `report-${nanoid()}`
    this.incidentLocation = payload.incidentLocation
    this.incidentDate = payload.incidentDate
    this.incidentDetail = payload.incidentDetail
    this.incidentStatus = payload.incidentStatus
    this.reporterId = payload.reporterId
  }
}
