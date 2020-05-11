/* eslint-env jest */

import { pathExistsSync, remove } from 'fs-extra'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import validConfig from '../../__fixtures__/valid-config.json'

import { ObjectionGenerator } from '../objection'
import { YamlConfig } from '../../interfaces'

const templateDir = resolve(__dirname, '..', '..', 'templates')

const OUT_DIR = '/tmp/objection-generator-test/generator/objection'

beforeEach(async () => {
  await remove(OUT_DIR)
})

describe('ObjectionGenerator class', () => {
  it('should generate models', async () => {
    const generator = new ObjectionGenerator(
      (validConfig as unknown) as YamlConfig,
      templateDir + '/objection',
      OUT_DIR
    )

    await generator.init()
    await generator.generate()

    const movieModelPath = resolve(OUT_DIR, 'models', 'MovieModel.ts')

    expect(pathExistsSync(movieModelPath)).toBe(true)
    expect(readFileSync(movieModelPath, 'utf8')).toMatchSnapshot()
  })
})
