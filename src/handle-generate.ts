import Ajv from 'ajv'
import { resolve, dirname } from 'path'

import { Arguments } from './interfaces'
import { dereference, loadYaml } from './utils'
import { validateConfig } from './schema-validator'
import { ObjectionGenerator } from './generators/objection'
import { KnexGenerator } from './generators/knex'
import { BaseGenerator } from './generators/base'

export async function handleGenerateObjection (params: Arguments) {
  params.templateDir = params.templateDir
    ? params.templateDir
    : resolve(__dirname, 'templates', 'objection')

  await handleGenerate(ObjectionGenerator, params)

  console.log('Models generated in:', params.outDir)
}

export async function handleGenerateKnex (params: Arguments) {
  params.templateDir = params.templateDir
    ? params.templateDir
    : resolve(__dirname, 'templates', 'knex')

  await handleGenerate(KnexGenerator, params)
  console.log('Migration generated in:', params.outDir)
}

export async function handleGenerate (
  Generator: typeof BaseGenerator,
  params: Arguments
) {
  try {
    const specPath = resolve(process.cwd(), params.specFile)
    const outDir = resolve(process.cwd(), params.outDir)

    const data = await loadYaml(specPath)

    console.log('Validating YAML spec')

    await validateConfig(data)

    console.log('Generating')

    const dereferenced = await dereference(data, dirname(specPath))

    const generator = new Generator(dereferenced, params.templateDir, outDir)
    await generator.init()
    await generator.generate()
  } catch (err) {
    if (err instanceof Ajv.ValidationError) {
      console.log(JSON.stringify(err.errors, null, 2))
      process.exit(1)
    }

    console.log(err.message)
    process.exit(1)
  }
}
