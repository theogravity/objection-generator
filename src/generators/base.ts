import { join } from 'path'
import prettier from 'prettier-standard'
import Handlebars from 'handlebars'
import * as _ from 'lodash'

import { YamlConfig } from '../interfaces'
import { readDirs } from '../utils'

export class BaseGenerator {
  defs: YamlConfig
  templatesDir: string
  outDir: string
  templateFiles: string[]

  constructor (defs: YamlConfig, templatesDir: string, outDir: string) {
    this.defs = defs
    this.templatesDir = templatesDir
    this.outDir = outDir
  }

  /**
   * Always call this first
   */
  async init (): Promise<void> {
    this.templateFiles = await readDirs(this.templatesDir)
    await registerHelpers(Handlebars, this.templatesDir)
  }

  /**
   * Call this after init
   */
  async generate (): Promise<void> {}

  protected prettify (content: string, filepath) {
    return prettier.format(content, {
      filepath,
      parser: 'typescript'
    })
  }
}

export async function registerHelpers (Handlebrs, templatesDir: string) {
  const helpers = await readDirs(join(templatesDir, '.helpers'))

  helpers.forEach(helperFile => {
    try {
      const helper = require(helperFile)
      helper(Handlebrs, _)
    } catch (e) {
      console.error('Could not load helper:', helperFile)
      console.error(e)
      process.exit(1)
    }
  })
}
