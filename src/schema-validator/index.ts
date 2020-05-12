import Ajv from 'ajv'
import { configValidator } from './config.validator'
import { modelValidator } from './model'

// validates the yaml configuration
const schema = {
  properties: {
    config: configValidator,
    models: modelValidator,
    components: {
      additionalProperties: true
    }
  }
}

const ajv = new Ajv()
const validate = ajv.compile(schema)

export async function validateConfig (config) {
  const validated = validate(config)

  if (!validated) {
    throw new Ajv.ValidationError(validate.errors)
  }

  return validated
}
