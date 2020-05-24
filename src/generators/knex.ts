import Handlebars from 'handlebars'
import { promises } from 'fs'
import fsEx from 'fs-extra'

import { BaseGenerator } from './base'

export class KnexGenerator extends BaseGenerator {
  async generate () {
    await fsEx.ensureDir(this.outDir + '/migrations')
    await this.generateMigration()
    await fsEx.copy(
      `${this.templatesDir}/migrate.js`,
      `${this.outDir}/migrate.js`
    )
  }

  protected async generateMigration () {
    for (const file of this.templateFiles) {
      if (file.includes('000-init.hbs')) {
        const hbsData = await promises.readFile(file, 'utf8')
        const template = Handlebars.compile(hbsData)

        const templateData = {
          models: this.defs.models
        }

        const content = template(templateData)
        const outPath = `${this.outDir}/migrations/000-init.js`
        await promises.writeFile(
          outPath,
          this.prettify(content, outPath),
          'utf8'
        )
      }
    }
  }
}
