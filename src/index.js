export default class Validator {
  constructor(schema, options = { first: true, concurrent: false }) {
    this.lastValidator = {};
    this.schema = schema;
    this.options = options;
  }

  validate(target, rules, options = {}, ...other) {
    let errors = [];
    let promiseQueue;
    if (!rules || rules.length < 1) {
      return Promise.resolve({
        value: target,
      });
    }
    if (!Array.isArray(rules)) {
      rules = [rules];
    }
    if (options.concurrent) {
      promiseQueue = Promise.all(
        rules.map(rule => {
          return this.transformToPromise(rule, target, errors, ...other).then(
            value => value,
            options.first ? value => value : null,
          );
        }),
      );
    } else {
      promiseQueue = rules.reduce((queue, rule) => {
        return queue.then(
          () => this.transformToPromise(rule, target, errors, ...other),
          !options.first
            ? () => this.transformToPromise(rule, target, errors, ...other)
            : null,
        );
      }, Promise.resolve());
    }
    return promiseQueue;
  }

  validateItem(source, fieldName, callback, ...other) {
    let rules = this.schema[fieldName];
    const validation = this.validate(
      source[fieldName],
      rules,
      this.options,
      ...other,
    );
    this.lastValidator[fieldName] = validation;
    return validation.then(
      value => {
        if (callback && this.lastValidator[fieldName] === validation) {
          this.lastValidator[fieldName] = null;
          callback(null, value.target);
        }
        return value;
      },
      value => {
        if (callback && this.lastValidator[fieldName] === validation) {
          this.lastValidator[fieldName] = null;
          callback(value.errors, value.target);
        }
        return value;
      },
    );
  }

  validateAll(source, callback, options = {}) {
    let hasError = false;
    const errors = {};
    const promises = [];
    (options.specificField || Object.keys(this.schema)).forEach(name => {
      promises.push(
        this.validateItem(source, name, fieldError => {
          errors[name] = fieldError;
          options.fieldCallback && options.fieldCallback(name, fieldError);
        }),
      );
    });
    return Promise.all(
      promises.map(p =>
        p.catch(v => {
          hasError = true;
          return v;
        }),
      ),
    ).then(() => {
      callback(errors, !hasError);
      return hasError ? null : errors;
    });
  }

  messageHandler(result, message, target, promiseValue, ...other) {
    if (typeof message === 'function') {
      result.push(
        `${message(target, promiseValue, ...other) || 'Error!'}`.trim(),
      );
    } else {
      result.push(`${message != null ? message : 'Error!'}`.trim());
    }
    return result;
  }

  cancelItem(name) {
    this.lastValidator[name] = null;
  }

  cancelAll() {
    this.lastValidator = {};
  }

  transformToPromise = (rule, target, errors, ...other) => {
    if (typeof rule.validator !== 'function') {
      throw 'invalid validator';
    }
    let ruleReturn = rule.validator(target, ...other);
    if (!ruleReturn || !ruleReturn.then || !ruleReturn.catch) {
      ruleReturn = ruleReturn
        ? Promise.resolve(ruleReturn)
        : Promise.reject(ruleReturn);
    }
    const data = {
      errors,
      target,
    };
    return ruleReturn.then(
      promiseValue => Object.assign(data, { promiseValue }),
      promiseValue => {
        data.errors = this.messageHandler(
          errors,
          rule.message,
          target,
          promiseValue,
          ...other,
        );
        return Promise.reject(Object.assign(data, { promiseValue }));
      },
    );
  };

  setSchema(schema) {
    this.schema = schema;
  }

  setOptions(options) {
    this.options = options;
  }
}
