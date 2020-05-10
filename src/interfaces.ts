export interface YamlConfig {
  config: {
    model: {
      classNamePrefix?: string
      classNamePostfix?: string
    }
  }
  models: {
    [key: string]: ModelDef
  }
  components: {
    [key: string]: any
  }
}

export interface ModelDef {
  tableName: string
  jsonSchema: {
    required?: string[]
    properties: {
      [key: string]: {
        type: string
        [key: string]: any
      }
    }
  }
}

export interface Arguments {
  specFile: string
  outDir: string
  templateDir?: string
}
