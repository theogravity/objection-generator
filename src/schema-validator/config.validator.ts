export const configValidator = {
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
}
