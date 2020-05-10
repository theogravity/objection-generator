/* eslint-env jest */

import { pathExistsSync, remove } from 'fs-extra'
import { readFileSync } from 'fs'
import { join } from 'path'
import validConfig from '../__fixtures__/valid-config.json'

import { Generator } from '../generator'
import { YamlConfig } from '../interfaces'

const templateDir = join(__dirname, '..', 'templates')

const OUT_DIR = '/tmp/objection-generator-test/generator'

beforeEach(async () => {
  await remove(OUT_DIR)
})

describe('Generator class', () => {
  it('should generate models', async () => {
    const generator = new Generator(
      (validConfig as unknown) as YamlConfig,
      templateDir,
      OUT_DIR
    )
    await generator.generate()

    const movieModelPath = join(OUT_DIR, 'MovieModel.ts')

    expect(pathExistsSync(movieModelPath)).toBe(true)
    expect(readFileSync(movieModelPath, 'utf8')).toMatchSnapshot()
  })
})
