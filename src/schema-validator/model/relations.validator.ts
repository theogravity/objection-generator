const toFromRelation = {
  type: 'object',
  required: ['from', 'to'],
  properties: {
    from: {
      type: 'string'
    },
    to: {
      type: 'string'
    }
  }
}

const throughRelation = {
  type: 'object',
  required: ['from', 'through', 'to'],
  properties: {
    from: {
      type: 'string'
    },
    through: {
      type: 'object',
      required: ['from', 'to'],
      properties: {
        from: {
          type: 'string'
        },
        to: {
          type: 'string'
        }
      }
    },
    to: {
      type: 'string'
    }
  }
}

// for defining objection relations
// https://vincit.github.io/objection.js/guide/relations.html#examples
export const modelRelationsValidator = {
  type: 'object',
  patternProperties: {
    '[A-Za-z0-9_]*': {
      type: 'object',
      additionalProperties: true,
      required: ['relation', 'modelClass', 'join'],
      properties: {
        modelClass: {
          type: 'string'
        },
        relation: {
          type: 'string',
          enum: [
            'Model.BelongsToOneRelation',
            'Model.HasManyRelation',
            'Model.HasOneThroughRelation',
            'Model.ManyToManyRelation',
            'Model.HasOneRelation'
          ],
          join: {
            type: 'object',
            oneOf: [toFromRelation, throughRelation]
          }
        }
      }
    }
  }
}
