import { modelDatabaseValidator } from './database.validator'
import { modelRelationsValidator } from './relations.validator'
import { modelJsonSchemaValidator } from './json-schema.validator'

export const modelValidator = {
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
        jsonSchema: modelJsonSchemaValidator,
        relations: modelRelationsValidator,
        // model-specific knex definition
        database: modelDatabaseValidator
      }
    }
  }
}
