import Handlebars from 'handlebars'
import { promises } from 'fs'
import fsEx from 'fs-extra'
import { BaseGenerator } from './base'

export class ObjectionGenerator extends BaseGenerator {
  async generate () {
    await fsEx.ensureDir(this.outDir + '/models')
    await this.generateModels()

    fsEx.copy(
      `${this.templatesDir}/BaseModel.ts`,
      `${this.outDir}/models/BaseModel.ts`
    )
  }

  protected async generateModels () {
    for (const file of this.templateFiles) {
      if (file.includes('$$model$$')) {
        const hbsData = await promises.readFile(file, 'utf8')
        const template = Handlebars.compile(hbsData)

        for (const result of this.compileModel(template)) {
          await promises.writeFile(
            `${this.outDir}/models/${result.modelName}.ts`,
            this.prettify(result.content),
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

      const modelData = this.defs.models[model]

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
