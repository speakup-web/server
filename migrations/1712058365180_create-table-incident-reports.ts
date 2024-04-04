import { type MigrationBuilder } from 'node-pg-migrate'

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType('incident_statuses', ['submited', 'on-progress', 'canceled', 'done'])

  pgm.createTable('incident_reports', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    incident_location: {
      type: 'text',
      notNull: true,
    },
    incident_date: {
      type: 'date',
      notNull: true,
    },
    incident_detail: {
      type: 'text',
      notNull: true,
    },
    incident_status: {
      type: 'incident_statuses',
      notNull: true,
      default: 'submited',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    reporter_id: {
      type: 'varchar(50)',
      notNull: true,
      references: '"reporters"',
      onDelete: 'CASCADE',
    },
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('incident_reports')
  pgm.dropType('incident_statuses')
}
