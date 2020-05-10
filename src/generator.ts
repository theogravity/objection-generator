import Handlebars from 'handlebars'
import { promises } from 'fs'
import fsEx from 'fs-extra'
import { join } from 'path'
import prettier from 'prettier-standard'
import { YamlConfig } from './interfaces'
import { readDirs } from './utils'

export class Generator {
  defs: YamlConfig
  templatesDir: string
  outDir: string

  constructor (defs: YamlConfig, templatesDir: string, outDir: string) {
    this.defs = defs
    this.templatesDir = templatesDir
    this.outDir = outDir
  }

  async generate () {
    const files = await readDirs(this.templatesDir)
    await registerHelpers(this.templatesDir)
    await fsEx.ensureDir(this.outDir)

    await this.generateModels(files)

    fsEx.copy(
      `${this.templatesDir}/BaseModel.ts`,
      `${this.outDir}/BaseModel.ts`
    )
  }

  protected async generateModels (files: string[]) {
    for (const file of files) {
      const hbsData = await promises.readFile(file, 'utf8')
      const template = Handlebars.compile(hbsData)

      if (file.includes('$$model$$')) {
        for (const result of this.compileModel(template)) {
          await promises.writeFile(
            `${this.outDir}/${result.modelName}.ts`,
            prettier.format(result.content),
            'utf8'
          )
        }
      }
    }
  }

  protected * compileModel (template: HandlebarsTemplateDelegate) {
    for (const model of Object.keys(this.defs.models)) {
      const prefix = this.defs.config?.model?.classNamePrefix || ''
      const postfix = this.defs.config?.model?.classNamePostfix || ''
      const modelName = `${prefix}${model}${postfix}`

      let modelData = this.defs.models[model]

      const templateData = {
        modelPrefix: prefix,
        modelPostfix: postfix,
        modelName,
        data: modelData
      }

      yield {
        modelName,
        content: template(templateData)
      }
    }
  }
}

export async function registerHelpers (templatesDir: string) {
  const helpers = await readDirs(join(templatesDir, '.helpers'))

  helpers.forEach(helperFile => {
    try {
      const helper = require(helperFile)
      helper(Handlebars)
    } catch (e) {
      console.error('Could not load helper:', helperFile)
      console.error(e)
      process.exit(1)
    }
  })
}
