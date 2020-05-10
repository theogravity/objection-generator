#!/usr/bin/env node

import yargs from 'yargs'
import { handleGenerate } from '../handle-generate'
;(async () => {
  return yargs
    .wrap(yargs.terminalWidth())
    .command(
      'generate <specFile> <outDir>',
      'Generates objection.js models from a YAML file',
      // @ts-ignore
      yargs => {
        yargs
          .positional('specFile', {
            type: 'string',
            describe: 'The YAML file to use to generate models.'
          })
          .positional('outDir', {
            type: 'string',
            describe: 'The directory to output the models.'
          })
          .options({
            templateDir: {
              type: 'string',
              description: 'Path to a custom template directory.'
            }
          })
      },
      handleGenerate
    )
    .demandCommand(1, '').argv
})()
