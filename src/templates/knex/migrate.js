const { resolve } = require('path')
const kn = require('knex')

;(async () => {
  // Sample migration with a sqlite database
  const knex = kn({
    client: 'sqlite3',
    connection: {
      filename: resolve(process.cwd(), 'sample.db')
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: resolve(__dirname, 'migrations')
    },
    timezone: 'UTC'
  })

  // run the migration
  await knex.migrate.latest()

  console.log(`Migration complete. Created 'sample.db'`)
  process.exit(0)
})()
