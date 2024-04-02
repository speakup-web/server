import { pool } from '@Infrastructures/database/postgres/pool'
import { Reporter } from '@Domains/entitites/reporter'
import { ReportersTableTestHelper } from '../../../../test/helpers/reportersTableTestHelper'
import { ReporterRepositoryPostgres } from '../reporterRepositoryPostgres'

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
      const reporter = new Reporter({
        name: 'John Doe',
        email: 'johndoe@mail.com',
        phone: '081123456789',
      })

      await reporterRepositoryPostgres.save(reporter)

      const reporters = await reportersTableTestHelper.findReporters()
      expect(reporters).toHaveLength(1)
      expect(reporters?.[0]).toStrictEqual(reporter)
    })

    it('should update reporter when reporter already exists', async () => {
      const reporter = new Reporter({
        name: 'John Doe',
        email: 'johndoe@mail.com',
        phone: '081123456789',
      })
      const updatedReporter = new Reporter({
        id: reporter.id,
        name: reporter.name,
        email: 'johndoe123@mail.com',
        phone: reporter.phone,
      })

      await reportersTableTestHelper.addReporter(reporter)

      await reporterRepositoryPostgres.save(updatedReporter)

      const reporters = await reportersTableTestHelper.findReporters()
      expect(reporters).toHaveLength(1)
      expect(reporters?.[0]).toStrictEqual(updatedReporter)
    })
  })
})
