import Ajv from 'ajv'
import { resolve, dirname } from 'path'

import { Arguments } from './interfaces'
import { dereference, loadYaml } from './utils'
import { validateConfig } from './schema-validator'
import { Generator } from './generator'

export async function handleGenerate (params: Arguments) {
  try {
    const specPath = resolve(process.cwd(), params.specFile)
    const templateDir = params.templateDir
      ? params.templateDir
      : resolve(__dirname, 'templates')
    const outDir = resolve(process.cwd(), params.outDir)

    const data = await loadYaml(specPath)

    console.log('Validating YAML spec')

    await validateConfig(data)

    console.log('Generating models')

    const dereferenced = await dereference(data, dirname(specPath))

    const generator = new Generator(dereferenced, templateDir, outDir)
    await generator.generate()

    console.log('Models generated in:', outDir)
  } catch (err) {
    if (err instanceof Ajv.ValidationError) {
      console.log(err.errors)
      process.exit(1)
    }

    console.log(err.message)
    process.exit(1)
  }
}
