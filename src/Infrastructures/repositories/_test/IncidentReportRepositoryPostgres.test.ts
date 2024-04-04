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

  describe('findAll', () => {
    it('should return all incident reports', async () => {
      const reporter1 = new ReporterBuilder(
        'John Doe',
        'johndoe@example.com',
        '081123456789',
      ).build()
      const reporter2 = new ReporterBuilder(
        'Jane Smith',
        'janesmith@example.com',
        '082234567890',
      ).build()
      const incidentReport1 = new IncidentReportBuilder(
        'lorem ipsum dolor sit amet',
        new Date('2024-01-01'),
        'lorem ipsum dolor sit amet consectetur adipiscing elit',
        IncidentStatus.SUBMITED,
        reporter1,
      ).build()
      const incidentReport2 = new IncidentReportBuilder(
        'lorem ipsum dolor sit amet',
        new Date('2024-01-02'),
        'lorem ipsum dolor sit amet consectetur adipiscing elit',
        IncidentStatus.ON_PROGRESS,
        reporter2,
      ).build()
      await reportersTableTestHelper.addReporter(reporter1)
      await reportersTableTestHelper.addReporter(reporter2)
      await incidentReportsTableTestHelper.addIncidentReport(incidentReport1)
      await incidentReportsTableTestHelper.addIncidentReport(incidentReport2)
      const limit = 20
      const offset = 0
      const status = undefined

      const incidentReports = await incidentReportRepositoryPostgres.findAll(limit, offset, status)

      expect(incidentReports).toHaveLength(2)
      expect(incidentReports[0]).toStrictEqual(incidentReport2)
      expect(incidentReports[1]).toStrictEqual(incidentReport1)
    })

    it('should return incident reports with specific status', async () => {
      const reporter1 = new ReporterBuilder(
        'John Doe',
        'johndoe@example.com',
        '081123456789',
      ).build()
      const reporter2 = new ReporterBuilder(
        'Jane Smith',
        'janesmith@example.com',
        '082234567890',
      ).build()
      const incidentReport1 = new IncidentReportBuilder(
        'lorem ipsum dolor sit amet',
        new Date('2024-01-01'),
        'lorem ipsum dolor sit amet consectetur adipiscing elit',
        IncidentStatus.SUBMITED,
        reporter1,
      ).build()
      const incidentReport2 = new IncidentReportBuilder(
        'lorem ipsum dolor sit amet',
        new Date('2024-01-02'),
        'lorem ipsum dolor sit amet consectetur adipiscing elit',
        IncidentStatus.ON_PROGRESS,
        reporter2,
      ).build()
      await reportersTableTestHelper.addReporter(reporter1)
      await reportersTableTestHelper.addReporter(reporter2)
      await incidentReportsTableTestHelper.addIncidentReport(incidentReport1)
      await incidentReportsTableTestHelper.addIncidentReport(incidentReport2)
      const limit = 20
      const offset = 0
      const status = 'on-progress'

      const incidentReports = await incidentReportRepositoryPostgres.findAll(limit, offset, status)

      expect(incidentReports).toHaveLength(1)
      expect(incidentReports[0]).toStrictEqual(incidentReport2)
    })

    it('should return empty array when incident reports is not found', async () => {
      const limit = 20
      const offset = 0
      const status = undefined

      const incidentReports = await incidentReportRepositoryPostgres.findAll(limit, offset, status)

      expect(incidentReports).toHaveLength(0)
    })

    it('should return incident reports with limit and offset', async () => {
      const reporter1 = new ReporterBuilder(
        'John Doe',
        'johndoe@example.com',
        '081123456789',
      ).build()
      const reporter2 = new ReporterBuilder(
        'Jane Smith',
        'janesmith@example.com',
        '082234567890',
      ).build()
      const incidentReport1 = new IncidentReportBuilder(
        'lorem ipsum dolor sit amet',
        new Date('2024-01-01'),
        'lorem ipsum dolor sit amet consectetur adipiscing elit',
        IncidentStatus.SUBMITED,
        reporter1,
      ).build()
      const incidentReport2 = new IncidentReportBuilder(
        'lorem ipsum dolor sit amet',
        new Date('2024-01-02'),
        'lorem ipsum dolor sit amet consectetur adipiscing elit',
        IncidentStatus.ON_PROGRESS,
        reporter2,
      ).build()
      await reportersTableTestHelper.addReporter(reporter1)
      await reportersTableTestHelper.addReporter(reporter2)
      await incidentReportsTableTestHelper.addIncidentReport(incidentReport1)
      await incidentReportsTableTestHelper.addIncidentReport(incidentReport2)
      const limit = 20
      const offset = 1
      const status = undefined

      const incidentReports = await incidentReportRepositoryPostgres.findAll(limit, offset, status)

      expect(incidentReports).toHaveLength(1)
      expect(incidentReports[0]).toStrictEqual(incidentReport1)
    })
  })

  describe('allCount', () => {
    it('should return correct value when', async () => {
      const reporter = new ReporterBuilder(
        'John Doe',
        'johndoe@example.com',
        '081123456789',
      ).build()
      const incidentReport = new IncidentReportBuilder(
        'lorem ipsum dolor sit amet',
        new Date('2024-01-01'),
        'lorem ipsum dolor sit amet consectetur adipiscing elit',
        IncidentStatus.SUBMITED,
        reporter,
      ).build()
      await reportersTableTestHelper.addReporter(reporter)
      await incidentReportsTableTestHelper.addIncidentReport(incidentReport)

      const count = await incidentReportRepositoryPostgres.countAll()

      expect(count).toEqual(1)
    })
  })

  describe('save', () => {
    it('should save a new incident report', async () => {
      const reporter = new ReporterBuilder('John Doe', 'johndoe@mail.com', '081123456789').build()
      const incidentReport = new IncidentReportBuilder(
        'lorem ipsum dolor sit amet',
        new Date('2024-01-01'),
        'lorem ipsum dolor sit amet consectetur adipiscing elit',
        IncidentStatus.SUBMITED,
        reporter,
      ).build()
      await reportersTableTestHelper.addReporter(reporter)

      await incidentReportRepositoryPostgres.save(incidentReport)

      const incidentReports = await incidentReportsTableTestHelper.findIncidentReports()
      expect(incidentReports).toHaveLength(1)
      expect(incidentReports[0]).toStrictEqual(incidentReport)
    })

    it('should update incident report when incident report already exists', async () => {
      const reporter = new ReporterBuilder('John Doe', 'johndoe@mail.com', '081123456789').build()
      const incidentReport = new IncidentReportBuilder(
        'lorem ipsum dolor sit amet',
        new Date('2024-01-01'),
        'lorem ipsum dolor sit amet consectetur adipiscing elit',
        IncidentStatus.ON_PROGRESS,
        reporter,
      ).build()
      const updatedIncidentReport = new IncidentReport(
        incidentReport.id,
        incidentReport.incidentLocation,
        incidentReport.incidentDate,
        incidentReport.incidentDetail,
        IncidentStatus.DONE,
        reporter,
      )
      await reportersTableTestHelper.addReporter(reporter)
      await incidentReportsTableTestHelper.addIncidentReport(incidentReport)

      await incidentReportRepositoryPostgres.save(updatedIncidentReport)

      const incidentReports = await incidentReportsTableTestHelper.findIncidentReports()
      expect(incidentReports).toHaveLength(1)
      expect(incidentReports[0]).toStrictEqual(updatedIncidentReport)
    })
  })
})
