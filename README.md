# objection-generator

[![NPM version](http://img.shields.io/npm/v/objection-generator.svg?style=flat-square)](https://www.npmjs.com/package/objection-generator)
[![CircleCI](https://circleci.com/gh/theogravity/objection-generator.svg?style=svg)](https://circleci.com/gh/theogravity/objection-generator) 
![built with typescript](https://camo.githubusercontent.com/92e9f7b1209bab9e3e9cd8cdf62f072a624da461/68747470733a2f2f666c61742e62616467656e2e6e65742f62616467652f4275696c74253230576974682f547970655363726970742f626c7565) 
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)


Generates [`objection.js`](https://github.com/vincit/objection.js) models in Typescript 
from a YAML specification.

- Generate your initial set of `objection.js` models from a YAML file
- Supports `$ref` for re-using common definitions

<!-- TOC -->
- [Installation](#installation)
  - [Install the CLI utility](#install-the-cli-utility)
  - [Install objection (if you do not have it installed)](#install-objection-if-you-do-not-have-it-installed)
- [Usage](#usage)
  - [Example output](#example-output)
- [YAML spec](#yaml-spec)

<!-- TOC END -->

# Installation

## Install the CLI utility

`$ npm i objection-generator -g`

## Install objection (if you do not have it installed)

`$ npm i objection --save`

# Usage

`$ objection-generator generate <specFile> <outDir>`

```bash
objection-generator generate <specFile> <outDir>

Generates objection.js models from a YAML file

Positionals:
  specFile  The YAML file to use to generate models.                                                    [string] [required]
  outDir    The directory to output the models.                                                         [string] [required]
```

## Example output

Using the `sample.yaml` spec in this project:

`$ objection-generator generate sample.yaml /tmp/models`

Will generate models that look like this:

```typescript
import { Model } from 'objection'
import path from 'path'

import { BaseModel } from './BaseModel'

export class MovieModel extends BaseModel {
  id: string
  name: string

  static tableName = 'movies'

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: {
          type: 'string'
        },
        name: {
          type: 'string',
          minLength: 1,
          maxLength: 255
        }
      }
    }
  }

  static get relationMappings () {
    return {
      reviews: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'ReviewModel'),
        join: {
          from: 'movie.id',
          to: 'review.movieId'
        }
      }
    }
  }
}
```

# YAML spec

See `sample.yaml` for an example spec.

```yaml
config:
  model:
    # Adds a prefix to the class names of the generated objection.js models
    classNamePrefix:
    # Adds a postfix to the class names of the generated objection.js models
    classNamePostfix: Model

# Objection models to generate
models:
  # Defines an objection model named Person (actually PersonModel with the postfix)
  Person:
    # database table name
    tableName: persons
    # maps to Model#jsonSchema()
    # https://json-schema.org/understanding-json-schema/reference/type.html
    # https://vincit.github.io/objection.js/guide/models.html#examples
    jsonSchema:
      required: ['name', 'username']
      properties:
        id:
          type: string
        name:
          type: string
          minLength: 1
          maxLength: 100
        age:
          # You can define a re-usable set of properties and reference them via $ref
          $ref: '#/components/fieldProperties/age'
        gender:
          type: string
          enum: ['Male', 'Female', 'Other']
          default: 'Female'
        username:
          allOf:
            # combine a ref and a non-ref, see json schema spec for more info
            - $ref: '#/components/fieldProperties/username'
            - default: 'default-user'
    # Define relations - maps to Model#relationMappings()
    # https://vincit.github.io/objection.js/guide/relations.html#examples
    relations:
      movies:
        relation: Model.ManyToManyRelation
        modelClass: Movie
        join:
          from: persons.id
          through:
            from: persons_movies.personId
            to: persons_movies.movieId
          to: movies.id
      reviews:
        relation: Model.HasManyRelation
        modelClass: Review
        join:
          from: persons.id
          to: review.authorId
  Movie:
    tableName: movies
    jsonSchema:
      required: ['name']
      properties:
        id:
          type: string
        name:
          type: string
          minLength: 1
          maxLength: 255
    relations:
      reviews:
        relation: Model.HasManyRelation
        modelClass: Review
        join:
          from: movie.id
          to: review.movieId
  Review:
    tableName: reviews
    # If you want to use a primary key that's not called "id"
    idColumn: reviewId
    jsonSchema:
      required: ['authorId', 'movieId']
      properties:
        reviewId:
          type: string
        authorId:
          type: string
        movieId:
          type: string
        content:
          type: string
    relations:
      author:
        relation: Model.HasOneRelation
        modelClass: Person
        join:
          from: reviews.authorId
          to: persons.id

# components are re-usable elements that can be
# referenced in the model via $ref
components:
  # This is a made up section used for
  # defining common field properties
  fieldProperties:
    age:
      type: ['number', 'null']
    username:
      type: string
      minLength: 1
      maxLength: 25
```
