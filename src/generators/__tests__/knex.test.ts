/* eslint-env jest */

import { pathExistsSync, remove } from 'fs-extra'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import validConfig from '../../__fixtures__/valid-config.json'

import { KnexGenerator } from '../knex'
import { YamlConfig } from '../../interfaces'

const templateDir = resolve(__dirname, '..', '..', 'templates')

const OUT_DIR = '/tmp/objection-generator-test/generator/knex'

beforeEach(async () => {
  await remove(OUT_DIR)
})

describe('KnexGenerator class', () => {
  it('should generate a migration', async () => {
    const generator = new KnexGenerator(
      (validConfig as unknown) as YamlConfig,
      templateDir + '/knex',
      OUT_DIR
    )

    await generator.init()
    await generator.generate()

    const migrationPath = resolve(OUT_DIR, 'migrations', '000-init.js')

    expect(pathExistsSync(migrationPath)).toBe(true)
    expect(readFileSync(migrationPath, 'utf8')).toMatchSnapshot()
  })
})
