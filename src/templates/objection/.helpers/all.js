// 2nd param is lodash
module.exports = (Handlebars, _) => {
  Handlebars.registerHelper('printSchema', (jsonSchema) => {
    return JSON.stringify({
      type: 'object',
      ...jsonSchema
    }, null, 2)
  })

  Handlebars.registerHelper('snakeCase', (str) => {
    return _.snakeCase(str)
  })

  Handlebars.registerHelper('camelCase', (str) => {
    return _.camelCase(str)
  })

  Handlebars.registerHelper('firstCap', (str) => {
    return _.upperFirst(str)
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

  Handlebars.registerHelper('defineEnum', (fieldProperties) => {
    if (Array.isArray(fieldProperties.enum)) {
      return fieldProperties.enum.map((item, idx) => {
        if (isVariableName(item) && typeof item === 'string') {
          return `${_.snakeCase(item).toUpperCase().replace(/-/g, '_')} = '${item}'`
        } else if (typeof item === 'number') {
          return `ITEM_${idx} = ${item}`
        }

        // handle names that can't be converted to a variable
        return `ITEM_${idx} = '${item}'`
      }).join(', ')
    }

    return ''
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

function isVariableName (str) {
  return /^[A-Za-z_][A-Za-z0-9_-]*$/.test(str)
}

