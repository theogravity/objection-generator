import Ajv from 'ajv'

// validates the yaml configuration
const schema = {
  properties: {
    config: {
      additionalProperties: false,
      properties: {
        model: {
          type: 'object',
          properties: {
            classNamePrefix: {
              type: ['string', 'null']
            },
            classNamePostfix: {
              type: 'string'
            }
          }
        }
      }
    },
    models: {
      type: 'object',
      patternProperties: {
        // model definition
        '[A-Za-z0-9_]*': {
          type: 'object',
          required: ['tableName'],
          properties: {
            tableName: {
              type: 'string'
            },
            // jsonSchema section
            jsonSchema: {
              type: 'object',
              patternProperties: {
                properties: {
                  type: 'object'
                }
              }
            }
          }
        }
      }
    },
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
