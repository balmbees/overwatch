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

export function jsonSchemaModel(jsonSchema, extraSettingFn = null) {
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

    if (extraSettingFn) {
      extraSettingFn(model);
    }
  };
}

import { Validator } from 'jsonschema';

export default class BaseModel {
  constructor(settings) {
    Object.assign(
      this,
      _.pick(
        settings,
        this.__properties()
      )
    );
  }

  __properties() {
    const names = Object.keys(this.constructor.schema.properties)
      .concat(['id'])
      .concat(Object.keys(this.constructor.model.compositions));

    return names;
  }

  serialize() {
    return _.pick(this, this.__properties());
  }

  isValid() {
    const validator = new Validator();
    const result = validator.validate(this, this.constructor.schema, { throwError: true });
    return result.valid;
  }

  get __model() {
    return this.constructor.model;
  }

  static create(settings) {
    return new Promise((resolve, reject) => {
      this.model.save(settings, (err, model) => {
        if (err) reject(err);
        else resolve(new this(model));
      });
    });
  }

  static read(idOrObject) {
    return new Promise((resolve, reject) => {
      this.model.read(idOrObject, (err, model) => {
        if (err) reject(err);
        else {
          if (model) resolve(new this(model));
          else reject(new Error(`Cant find ${this.name} with ${JSON.stringify(idOrObject)}`));
        }
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
