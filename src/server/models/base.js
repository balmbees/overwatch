import request from 'request';
import _ from 'underscore';

export class GrapheneDB {
  constructor(url) {
    this.url = url;
  }

  cypher(q, params = undefined, contents = ['row']) {
    return new Promise((resolve, reject) => {
      request({
        uri: `${this.url}/db/data/transaction/commit`,
        method: 'POST',
        json: {
          statements: [{
            statement: q,
            resultDataContents: contents,
            parameters: params,
          }],
        },
      }, (err, response) => {
        if (err || response.statusCode < 200 || response.statusCode > 200) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }
}

import DB from '../services/db';

export function Model(jsonSchema) {
  const model = DB.createModel(jsonSchema.title);
  return model;
}

export function jsonSchemaModel(jsonSchema) {
  return function decorator(targetClass) {
    Object.defineProperty(
      targetClass,
      'schema',
      { value: jsonSchema }
    );

    const model = DB.createModel(jsonSchema.title);
    Object.defineProperty(
      targetClass,
      'model',
      { value: model }
    );
  };
}

import { Validator } from 'jsonschema';

export default class BaseModel {
  constructor(settings) {
    Object.assign(
      this,
      _.pick(
        settings,
        Object.keys(this.constructor.schema.properties).concat([
          'id',
        ])
      )
    );
  }

  serialize() {
    return _.pick(this, Object.keys(this.constructor.schema.properties).concat([
      'id',
    ]));
  }

  isValid() {
    const validator = new Validator();
    const result = validator.validate(this, this.constructor.schema, { throwError: true });
    return result.valid;
  }

  get __model() {
    return this.constructor.model;
  }

  save() {
    return new Promise((resolve, reject) => {
      this.__model.save(this.serialize(), (err, saved) => {
        if (err) reject(err);
        else resolve(saved);
      });
    });
  }

  static findAll(options = {}) {
    return new Promise((resolve, reject) => {
      this.model.findAll(options, (err, results) => {
        if (err) reject(err);
        else resolve(results.map(r => new this(r)));
      });
    });
  }

  static db() {
    return new GrapheneDB(process.env.GRAPHENEDB_URL || 'http://neo4j:neo4j@127.0.0.1:7474');
  }
}
