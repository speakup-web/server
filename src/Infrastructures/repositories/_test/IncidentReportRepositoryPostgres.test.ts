import { IncidentReport } from '@Domains/entities/IncidentReport/IncidentReport'
import { ReportersTableTestHelper } from '../../../../test/helpers/ReportersTableTestHelper'
import { IncidentReportsTableTestHelper } from '../../../../test/helpers/IncidentReportsTableTestHelper'
import { IncidentReportRepositoryPostgres } from '../IncidentReportRepositoryPostgres'
import { pool } from '@Infrastructures/database/postgres/pool'
import { IncidentReportBuilder } from '@Domains/entities/IncidentReport/IncidentReportBuilder'
import { IncidentStatus } from '@Domains/enums/IncidentStatus'
import { ReporterBuilder } from '@Domains/entities/Reporter/ReporterBuilder'

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
      const reporter = new ReporterBuilder('John Doe', 'johndoe@mail.com', '081123456789').build()
      const incidentReport = new IncidentReportBuilder(
        'lorem ipsum dolor sit amet',
        new Date('2024-01-01'),
        'lorem ipsum dolor sit amet consectetur adipiscing elit',
        IncidentStatus.SUBMITED,
        reporter.id,
      ).build()
      await reportersTableTestHelper.addReporter(reporter)

      await incidentReportRepositoryPostgres.save(incidentReport)

      const incidentReports = await incidentReportsTableTestHelper.findIncidentReports()
      expect(incidentReports).toHaveLength(1)
      expect(incidentReports?.[0]).toStrictEqual(incidentReport)
    })

    it('should update incident report when incident report already exists', async () => {
      const reporter = new ReporterBuilder('John Doe', 'johndoe@mail.com', '081123456789').build()
      const incidentReport = new IncidentReportBuilder(
        'lorem ipsum dolor sit amet',
        new Date('2024-01-01'),
        'lorem ipsum dolor sit amet consectetur adipiscing elit',
        IncidentStatus.ON_PROGRESS,
        reporter.id,
      ).build()
      const updatedIncidentReport = new IncidentReport(
        incidentReport.id,
        incidentReport.incidentLocation,
        incidentReport.incidentDate,
        incidentReport.incidentDetail,
        IncidentStatus.DONE,
        reporter.id,
      )
      await reportersTableTestHelper.addReporter(reporter)
      await incidentReportsTableTestHelper.addIncidentReport(incidentReport)

      await incidentReportRepositoryPostgres.save(updatedIncidentReport)

      const incidentReports = await incidentReportsTableTestHelper.findIncidentReports()
      expect(incidentReports).toHaveLength(1)
      expect(incidentReports?.[0]).toStrictEqual(updatedIncidentReport)
    })
  })
})
