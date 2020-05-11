#!/usr/bin/env node

import yargs from 'yargs'
import { handleGenerateKnex, handleGenerateObjection } from '../handle-generate'
;(async () => {
  const builder = yargs => {
    return yargs
      .positional('specFile', {
        type: 'string',
        describe: 'The YAML file to use for generation.'
      })
      .positional('outDir', {
        type: 'string',
        describe: 'The directory to output generated files.'
      })
  }

  return yargs
    .wrap(yargs.terminalWidth())
    .command(
      'generate <specFile> <outDir>',
      'Generates objection.js models from a YAML file',
      builder,
      handleGenerateObjection
    )
    .command(
      'knex <specFile> <outDir>',
      'Generates a basic knex migration from a YAML file',
      builder,
      handleGenerateKnex
    )
    .options({
      templateDir: {
        type: 'string',
        description: 'Path to a custom template directory.'
      }
    })
    .demandCommand(1, '').argv
})()
