## 1.2.5 - Sun May 24 2020 21:19:30

**Contributor:** Theo Gravity

- Fix default not working in knex generation for integers

## 1.2.4 - Sun May 24 2020 07:21:07

**Contributor:** Theo Gravity

- Objection usability / generation fixes

- Will no longer overwrite `BaseModel` if it exists. This is so if you have modifications to it, you will not lose them
- Added a note to use `knexSnakeCaseMappers` in your `knex` configuration in the readme
- Updated `migrate.js` to use `knexSnakeCaseMappers`

## 1.2.3 - Sat May 23 2020 09:46:08

**Contributor:** Theo Gravity

- Fix enum generation; replace `_.capitalize` -> `_.upperFirst`

## 1.2.2 - Sat May 23 2020 06:32:28

**Contributor:** Theo Gravity

- Enum in model: handle if enum value is a number, or contains a dash

## 1.2.1 - Sat May 23 2020 06:19:27

**Contributor:** Theo Gravity

- Enums in models are now generated as Typescript enums

When an enum is detected, a typescript enum will be created in the format of:

`{ModelName}{PropertyName}Enum`

Enum key names are based off the enum values. If an enum value is not
convertable to a key, then `ITEM_{index}` is used instead for the name.

## 1.1.7 - Fri May 22 2020 04:29:19

**Contributor:** Theo Gravity

- Import Model only if relation is defined

## 1.1.6 - Thu May 21 2020 22:54:09

**Contributor:** Theo Gravity

- For knex `date-time` type, auto-adds `.defaultTo(knex.fn.now())`

## 1.1.5 - Mon May 18 2020 08:18:12

**Contributor:** Theo Gravity

- Remove unnecessary import from model generation

## 1.1.4 - Tue May 12 2020 19:48:43

**Contributor:** Theo Gravity

- Improved validation of the YAML schema to reduce chance of user mistakes (#1)

## 1.1.3 - Mon May 11 2020 16:42:53

**Contributor:** Theo Gravity

- Fix npm publish issue

## 1.1.2 - Mon May 11 2020 16:32:30

**Contributor:** Theo Gravity

- Update README.md

Correct directory output blurb in readme

## 1.1.1 - Mon May 11 2020 02:07:15

**Contributor:** Theo Gravity

- Update package.json metadata

## 1.0.4 - Mon May 11 2020 01:57:24

**Contributor:** Theo Gravity

- Add knex migration generation support

## 1.0.3 - Sun May 10 2020 19:13:20

**Contributor:** Theo Gravity

- Add `idColumn` support

## 1.0.2 - Sun May 10 2020 08:31:29

**Contributor:** Theo Gravity

- Add keywords to package.json for discoverability

## 1.0.1 - Sun May 10 2020 08:25:58

**Contributor:** Theo Gravity

- First version

