/* eslint-env jest */

import { pathExistsSync, remove } from 'fs-extra'
import { readFileSync } from 'fs'
import { resolve } from 'path'

import { handleGenerateObjection, handleGenerateKnex } from '../handle-generate'

const OUT_DIR = '/tmp/objection-generator-test/handle-generate'

beforeEach(async () => {
  await remove(OUT_DIR)
})

describe('handle-generator', () => {
  it('should generate objection models', async () => {
    await handleGenerateObjection({
      specFile: resolve(__dirname, '..', '..', 'sample.yaml'),
      outDir: OUT_DIR
    })

    const movieModelPath = resolve(OUT_DIR, 'models', 'MovieModel.ts')
    const reviewsModelPath = resolve(OUT_DIR, 'models', 'ReviewModel.ts')

    expect(pathExistsSync(movieModelPath)).toBe(true)
    expect(readFileSync(movieModelPath, 'utf8')).toMatchSnapshot()
    expect(readFileSync(reviewsModelPath, 'utf8')).toMatchSnapshot()
  })

  it('should generate a knex migration', async () => {
    await handleGenerateKnex({
      specFile: resolve(__dirname, '..', '..', 'sample.yaml'),
      outDir: OUT_DIR
    })

    const knexMigration = resolve(OUT_DIR, 'migrations', '000-init.js')

    expect(pathExistsSync(knexMigration)).toBe(true)
    expect(readFileSync(knexMigration, 'utf8')).toMatchSnapshot()
  })
})
