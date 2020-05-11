import { join } from 'path'
import prettier from 'prettier-standard'
import Handlebars from 'handlebars'

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

  async init (): Promise<void> {
    this.templateFiles = await readDirs(this.templatesDir)
    await registerHelpers(Handlebars, this.templatesDir)
  }

  async generate (): Promise<void> {}

  prettify (content: string) {
    return prettier.format(content)
  }
}

export async function registerHelpers (Handlebrs, templatesDir: string) {
  const helpers = await readDirs(join(templatesDir, '.helpers'))

  helpers.forEach(helperFile => {
    try {
      const helper = require(helperFile)
      helper(Handlebrs)
    } catch (e) {
      console.error('Could not load helper:', helperFile)
      console.error(e)
      process.exit(1)
    }
  })
}