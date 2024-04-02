import { IncidentReport, IncidentStatuses } from '@Domains/entitites/incidentReport'
import { Reporter } from '@Domains/entitites/reporter'
import { ReportersTableTestHelper } from '../../../../test/helpers/reportersTableTestHelper'
import { IncidentReportsTableTestHelper } from '../../../../test/helpers/incidentReportsTableTestHelper'
import { IncidentReportRepositoryPostgres } from '../incidentReportRepositoryPostgres'
import { pool } from '@Infrastructures/database/postgres/pool'

describe('IncidentReportRepositoryPostgres', () => {
  let reportersTableTestHelper: ReportersTableTestHelper
  let incidentReportsTableTestHelper: IncidentReportsTableTestHelper
  let incidentReportRepositoryPostgres: IncidentReportRepositoryPostgres

  beforeAll(() => {
    reportersTableTestHelper = new ReportersTableTestHelper(pool)
    incidentReportsTableTestHelper = new IncidentReportsTableTestHelper(pool)
  })

  beforeEach(() => {
    incidentReportRepositoryPostgres = new IncidentReportRepositoryPostgres(pool)
  })

  afterEach(async () => {
    await reportersTableTestHelper.cleanTable()
    await incidentReportsTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('save', () => {
    it('should save a new incident report', async () => {
      const reporter = new Reporter({
        name: 'John Doe',
        email: 'johndoe@mail.com',
        phone: '081123456789',
      })
      const incidentReport = new IncidentReport({
        incidentLocation: 'lorem ipsum dolor sit amet',
        incidentDate: new Date('2024-01-01'),
        incidentDetail: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
        incidentStatus: IncidentStatuses.SUBMITED,
        reporterId: reporter.id,
      })

      await reportersTableTestHelper.addReporter(reporter)

      await incidentReportRepositoryPostgres.save(incidentReport)

      const incidentReports = await incidentReportsTableTestHelper.findIncidentReports()
      expect(incidentReports).toHaveLength(1)
      expect(incidentReports?.[0]).toStrictEqual(incidentReport)
    })

    it('should update incident report when incident report already exists', async () => {
      const reporter = new Reporter({
        name: 'John Doe',
        email: 'johndoe@mail.com',
        phone: '081123456789',
      })
      const incidentReport = new IncidentReport({
        incidentLocation: 'lorem ipsum dolor sit amet',
        incidentDate: new Date('2024-01-01'),
        incidentDetail: 'lorem ipsum dolor sit amet consectetur adipiscing elit',
        incidentStatus: IncidentStatuses.ON_PROGRESS,
        reporterId: reporter.id,
      })
      const updatedIncidentReport = new IncidentReport({
        id: incidentReport.id,
        incidentLocation: incidentReport.incidentLocation,
        incidentDate: incidentReport.incidentDate,
        incidentDetail: incidentReport.incidentDetail,
        incidentStatus: IncidentStatuses.DONE,
        reporterId: reporter.id,
      })

      await reportersTableTestHelper.addReporter(reporter)
      await incidentReportsTableTestHelper.addIncidentReport(incidentReport)

      await incidentReportRepositoryPostgres.save(updatedIncidentReport)

      const incidentReports = await incidentReportsTableTestHelper.findIncidentReports()
      expect(incidentReports).toHaveLength(1)
      expect(incidentReports?.[0]).toStrictEqual(updatedIncidentReport)
    })
  })
})
