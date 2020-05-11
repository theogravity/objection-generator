module.exports = (Handlebars) => {
  Handlebars.registerHelper('printSchema', (jsonSchema) => {
    return JSON.stringify({
      type: 'object',
      ...jsonSchema
    }, null, 2)
  })

  Handlebars.registerHelper('jsonStringify', (json) => {
    return JSON.stringify(json, null, 2)
  })

  Handlebars.registerHelper('formatRelation', (json) => {
    const obj = {
      ...json
    }

    delete obj.modelClass
    delete obj.relation

    let str = JSON.stringify(obj, null, 2)

    // remove the top and bottom brackets
    str = str.substr(1, str.length-1)

    return str.slice(0, str.length-1).trim()
  })

  Handlebars.registerHelper('getModelName', (modelPrefix, modelPostfix, modelClass) => {
    return `${modelPrefix}${modelClass}${modelPostfix}`
  })

  /**
   * Types can be an array, break them out if possible
   */
  Handlebars.registerHelper('tsType', (fieldProperties) => {
    if (Array.isArray(fieldProperties.enum)) {
      return fieldProperties.enum.map((item) => `'${item}'`).join(' | ')
    }

    if (Array.isArray(fieldProperties.type)) {
      return fieldProperties.type.join(' | ')
    }

    return fieldProperties.type
  })
}
