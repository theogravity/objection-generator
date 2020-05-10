import { safeLoad } from 'js-yaml'
import { readFileSync } from 'fs'
import walk from '@fcostarodrigo/walk'
import RefParser from '@apidevtools/json-schema-ref-parser'

import { YamlConfig } from './interfaces'

export async function loadYaml (file: string): Promise<YamlConfig> {
  return safeLoad(readFileSync(file, 'utf8'))
}

export async function dereference (
  config: YamlConfig,
  baseDir: string
): Promise<YamlConfig> {
  const data = ((await RefParser.dereference(`${baseDir}/`, config, {
    dereference: {
      circular: 'ignore'
    }
  })) as unknown) as YamlConfig

  // Recurse through the structure and flatten allOf references
  // @ts-ignore
  traverse(data, (obj, key, value) => {
    if (obj[key]?.allOf) {
      obj[key] = obj[key].allOf.reduce((accum, curr) => {
        return {
          ...accum,
          ...curr
        }
      }, {})
    }
  })

  return data
}

export async function readDirs (path: string) {
  const files: string[] = []

  for await (const file of walk(path)) {
    files.push(file)
  }

  return files
}

// https://gist.github.com/sphvn/dcdf9d683458f879f593
export function traverse (
  o: any,
  fn: (obj: any, prop: string, value: any) => void
) {
  for (const i in o) {
    fn.apply(this, [o, i, o[i]])
    if (o[i] !== null && typeof o[i] === 'object') {
      traverse(o[i], fn)
    }
  }
}
