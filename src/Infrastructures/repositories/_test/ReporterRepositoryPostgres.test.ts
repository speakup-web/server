import { pool } from '@Infrastructures/database/postgres/pool'
import { Reporter } from '@Domains/entities/Reporter/Reporter'
import { ReportersTableTestHelper } from '../../../../test/helpers/ReportersTableTestHelper'
import { ReporterRepositoryPostgres } from '../ReporterRepositoryPostgres'
import { ReporterBuilder } from '@Domains/entities/Reporter/ReporterBuilder'

describe('ReporterRepositoryPostgres', () => {
  let reportersTableTestHelper: ReportersTableTestHelper
  let reporterRepositoryPostgres: ReporterRepositoryPostgres

  beforeAll(() => {
    reportersTableTestHelper = new ReportersTableTestHelper(pool)
  })

  beforeEach(() => {
    reporterRepositoryPostgres = new ReporterRepositoryPostgres(pool)
  })

  afterEach(async () => {
    await reportersTableTestHelper.cleanTable()
  })

  afterAll(async () => {
    await pool.end()
  })

  describe('save', () => {
    it('should save a new reporter', async () => {
      const reporter = new ReporterBuilder('John Doe', 'johndoe@mail.com', '081123456789').build()

      await reporterRepositoryPostgres.save(reporter)

      const reporters = await reportersTableTestHelper.findReporters()
      expect(reporters).toHaveLength(1)
      expect(reporters?.[0]).toStrictEqual(reporter)
    })

    it('should update reporter when reporter already exists', async () => {
      const reporter = new ReporterBuilder('John Doe', 'johndoe@mail.com', '081123456789').build()
      const updatedReporter = new Reporter(
        reporter.id,
        reporter.name,
        'johndoe123@mail.com',
        reporter.phone,
      )
      await reportersTableTestHelper.addReporter(reporter)

      await reporterRepositoryPostgres.save(updatedReporter)

      const reporters = await reportersTableTestHelper.findReporters()
      expect(reporters).toHaveLength(1)
      expect(reporters?.[0]).toStrictEqual(updatedReporter)
    })
  })
})
