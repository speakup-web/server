import { type MigrationBuilder } from 'node-pg-migrate'

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createType('user_roles', ['admin', 'taskforce'])

  pgm.createTable('users', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    name: {
      type: 'varchar(50)',
      notNull: true,
    },
    password: {
      type: 'text',
      notNull: true,
    },
    email: {
      type: 'varchar(50)',
      notNull: true,
      unique: true,
    },
    role: {
      type: 'user_roles',
      notNull: true,
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
    is_deleted: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
  })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('users')
  pgm.dropType('user_roles')
}
