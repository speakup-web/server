/* eslint-disable no-console */

import * as path from 'path'
import * as fs from 'fs'
import * as bcrypt from 'bcrypt'
import { pool } from '@Infrastructures/database/postgres/pool'

async function processFile(fileName: string, dataFolderPath: string) {
  const tableName = fileName.split('.')[0]
  const filePath = path.join(dataFolderPath, fileName)
  const jsonData = fs.readFileSync(filePath, 'utf-8')
  const data = JSON.parse(jsonData)[tableName]

  const insertValues = await Promise.all(
    data.map(async (record: Record<string, any>) => {
      if (tableName === 'users' && record.password) {
        record.password = await bcrypt.hash(record.password, 10)
      }
      return `(${Object.values(record)
        .map((value) => (typeof value === 'string' ? `'${value}'` : value))
        .join(',')})`
    }),
  )

  await pool.query(`DELETE FROM ${tableName} WHERE 1=1`)

  const query = `INSERT INTO ${tableName} (${Object.keys(data[0]).join(',')}) VALUES ${insertValues.join(',')}`
  return query
}

async function seedData() {
  try {
    const dataFolderPath = path.join(process.cwd(), 'seeder', 'data')
    const files = fs.readdirSync(dataFolderPath)

    for (const file of files) {
      if (file.endsWith('.json')) {
        const query = await processFile(file, dataFolderPath)
        await pool.query(query)
        console.log(`Seeding data from ${file} into table ${file.split('.')[0]}`)
      }
    }

    console.log('Seed data completed')
  } catch (err) {
    console.error('Error seeding data:', err)
  } finally {
    await pool.end()
  }
}

seedData()
