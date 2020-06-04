// for generating unique indices in knex generation
const uniqueValidator = {
  type: 'object',
  patternProperties: {
    // index name definition
    '[A-Za-z0-9_]*': {
      type: 'object',
      properties: {
        columns: {
          type: 'array'
        }
      }
    }
  }
}

// for generating indices in knex generation
const indexValidator = {
  type: 'object',
  patternProperties: {
    // index name definition
    '[A-Za-z0-9_]*': {
      type: 'object',
      properties: {
        columns: {
          type: 'array'
        },
        indexType: {
          type: 'string'
        }
      }
    }
  }
}

// for excluding columns in knex generation
const exclusionValidator = {
  type: 'object',
  properties: {
    columns: {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  }
}

export const modelDatabaseValidator = {
  type: 'object',
  additionalProperties: false,
  properties: {
    unique: uniqueValidator,
    index: indexValidator,
    exclude: exclusionValidator
  }
}
