
// 2nd param is lodash
module.exports = (Handlebars, _) => {
  Handlebars.registerHelper('snakeCase', (str) => {
    return _.snakeCase(str)
  })

  Handlebars.registerHelper('toArray', (cols) => {
    if (Array.isArray(cols)) {
      const data = convertArrayToStr(cols.map(_.snakeCase))

      return data.join(', ')
    }

    return `'${_.snakeCase(cols)}'`
  })

  Handlebars.registerHelper('defineDbCol', (columnName, columnProps) => {
    columnName = _.snakeCase(columnName)

    let type = columnProps.type

    if (Array.isArray(columnProps.type)) {
      console.log(`Warning: '${columnName}' column is an array type, using the first value as the type`)
      type = columnProps.type[0]
    }

    switch (type) {
      case 'object':
        return `table.jsonb('${columnName}')`
      case 'string':
        switch (columnProps.format) {
          case 'date-time':
            return `table.datetime('${columnName}').defaultTo(knex.fn.now())`
          case 'date':
            return `table.date('${columnName}')`
          case 'time':
            return `table.time('${columnName}')`
          case 'uuid':
            return `table.uuid('${columnName}')`
        }

        if (Array.isArray(columnProps.enum)) {
          const enumData = convertArrayToStr(columnProps.enum)
          return `table.enu('${columnName}', [${enumData.join(', ')}])`
        }

        if (columnProps.maxLength) {
          return `table.string('${columnName}', ${columnProps.maxLength})`
        }

        return `table.string('${columnName}')`
      case 'integer':
      case 'number':
        return `table.integer('${columnName}')`
      case 'boolean':
        return `table.boolean('${columnName}')`
      default:
        console.log(`Warning: '${columnName}' type '${type}' is not supported. Using text type as default.`)
        return `table.text('${columnName}')`
    }
  })

  Handlebars.registerHelper('addRequired', (columnName, modelProps) => {
    const jsonSchema = modelProps.jsonSchema
    if (jsonSchema && Array.isArray(jsonSchema.required) && jsonSchema.required.includes(columnName)) {
      return '.notNullable()'
    }
  })

  /**
   * Checks if a value is not in an array
   */
  Handlebars.registerHelper('notInArray', (context, field, required = [], options) => {
    if (Array.isArray(required) && required.includes(field)) {
      return options.inverse(context);
    }

    return options.fn(context);
  })

  Handlebars.registerHelper('stringify', (obj = {}) => {
    return JSON.stringify(obj)
  });

  Handlebars.registerHelper('addDefault', (columnProps) => {
    if (columnProps.default !== undefined) {
      switch (columnProps.type) {
        case 'number':
        case 'integer':
          return `.defaultTo(${columnProps.default})`
        case 'string':
          switch (columnProps.format) {
            case 'date-time':
              // this is handled by defineDbCol
              return ``
            default:
              return `.defaultTo('${columnProps.default}')`
          }
        default:
          return `.defaultTo('${columnProps.default}')`
      }
    }
  })
}

function convertArrayToStr (arr) {
  return arr.reduce((curr, val) => {
    curr.push(`'${val}'`)

    return curr
  }, [])
}
