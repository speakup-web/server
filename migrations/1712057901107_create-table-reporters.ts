import { type MigrationBuilder } from 'node-pg-migrate'

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('reporters', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    name: {
      type: 'varchar(50)',
      notNull: true,
    },
    email: {
      type: 'varchar(50)',
      notNull: true,
      unique: true,
    },
    phone: {
      type: 'varchar(50)',
      notNull: true,
      unique: true,
    },
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('reporters')
}
