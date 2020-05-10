/* eslint-env jest */

import { pathExistsSync, remove } from 'fs-extra'
import { readFileSync } from 'fs'
import { join } from 'path'

import { handleGenerate } from '../handle-generate'

const OUT_DIR = '/tmp/generator-models'

beforeEach(async () => {
  await remove(OUT_DIR)
})

describe('handle-generator', () => {
  it('should generate models', async () => {
    await handleGenerate({
      specFile: join(__dirname, '..', '..', 'sample.yaml'),
      outDir: OUT_DIR
    })

    const movieModelPath = join(OUT_DIR, 'MovieModel.ts')

    expect(pathExistsSync(movieModelPath)).toBe(true)
    expect(readFileSync(movieModelPath, 'utf8')).toMatchSnapshot()
  })
})
