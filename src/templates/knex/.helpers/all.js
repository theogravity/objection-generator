
module.exports = (Handlebars) => {
  Handlebars.registerHelper('snakeCase', (name) => {
    return toSnakeCase(name)
  })

  Handlebars.registerHelper('toArray', (cols) => {
    if (Array.isArray(cols)) {
      const data = convertArrayToStr(cols.map(toSnakeCase))

      return data.join(', ')
    }

    return `'${toSnakeCase(cols)}'`
  })

  Handlebars.registerHelper('defineDbCol', (columnName, columnProps) => {
    columnName = toSnakeCase(columnName)

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
            return `table.datetime('${columnName}')`
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

  Handlebars.registerHelper('addDefault', (columnProps) => {
    if (columnProps.default) {
      switch (columnProps.type) {
        case 'number':
        case 'integer':
          return `.defaultTo(${columnProps.default})`
        default:
          return `.defaultTo('${columnProps.default}')`
      }
    }
  })
}

// https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-120.php
function toSnakeCase (str) {
  return str && str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('_')
}

function convertArrayToStr (arr) {
  return arr.reduce((curr, val) => {
    curr.push(`'${val}'`)

    return curr
  }, [])
}
