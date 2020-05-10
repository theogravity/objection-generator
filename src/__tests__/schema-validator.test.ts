/* eslint-env jest */

import { validateConfig } from '../schema-validator'
import validConfig from '../__fixtures__/valid-config.json'
import missingTableName from '../__fixtures__/missing-table-name.json'

describe('YAML schema validator', () => {
  it('should pass a valid schema', async () => {
    await expect(validateConfig(validConfig)).resolves.toBe(true)
  })

  it('should throw on a missing tableName', async () => {
    await expect(validateConfig(missingTableName)).rejects.toBeDefined()
  })
})
