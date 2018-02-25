export default class Validator {
  constructor(descriptor) {
    this.lastValidator = {};
    this.descriptor = descriptor;
  }

  validateItem(
    source,
    fieldName,
    callback,
    options = { first: true, cover: true, parallel: false },
    customFieldDescriptor,
  ) {
    let errors = [];
    let promiseQueue;
    let rules = customFieldDescriptor || this.descriptor[fieldName];
    if (!rules || rules.length < 1) {
      return;
    }
    if (!Array.isArray(rules)) {
      rules = [rules];
    }
    if (options.parallel) {
      promiseQueue = Promise.all(
        rules.map(rule => {
          const ruleTarget = [fieldName, ...(rule.join || [])].map(
            name => source[name],
          );
          return this.transformToPromise(
            fieldName,
            rule,
            ruleTarget,
            errors,
          ).then(value => value, options.first ? null : value => value);
        }),
      );
    } else {
      promiseQueue = rules.reduce((queue, rule) => {
        const ruleTarget = [fieldName, ...(rule.join || [])].map(
          name => source[name],
        );
        return queue.then(
          () => this.transformToPromise(fieldName, rule, ruleTarget, errors),
          options.first
            ? null
            : () =>
                this.transformToPromise(fieldName, rule, ruleTarget, errors),
        );
      }, Promise.resolve());
    }
    this.lastValidator[fieldName] = promiseQueue;
    return promiseQueue.then(
      value => {
        (!options.cover || this.lastValidator[fieldName] === promiseQueue) &&
          callback &&
          callback(errors, value);
        return value;
      },
      value => {
        (!options.cover || this.lastValidator[fieldName] === promiseQueue) &&
          callback &&
          callback(errors, value);
        return Promise.reject(value);
      },
    );
  }

  validate(source, callback, specificField, options = {}) {
    let hasError = false;
    const errors = {};
    const promises = [];
    (specificField || Object.keys(this.descriptor)).forEach(name => {
      promises.push(
        this.validateItem(
          source,
          name,
          fieldError => {
            errors[name] = fieldError;
          },
          options,
        ),
      );
    });
    return Promise.all(
      promises.map(p =>
        p.catch(v => {
          hasError = true;
          return v;
        }),
      ),
    ).then(
      () => {
        callback(errors, !hasError);
        return hasError ? Promise.reject(errors) : errors;
      },
    );
  }

  messageHandler(result, rule, target, promiseValue) {
    if (typeof rule.message === 'function') {
      result.push(
        `${rule.message(...target, promiseValue) || 'Error!'}`.trim(),
      );
    } else {
      result.push(`${rule.message || 'Error!'}`.trim());
    }
    return result;
  }

  cancelItem(name) {
    this.lastValidator[name] = null;
  }

  cancelAll() {
    this.lastValidator = {};
  }

  transformToPromise = (fieldName, rule, target, errors) => {
    let ruleReturn = rule.validator(...target);
    let isAsync = true;
    if (!ruleReturn || !ruleReturn.then || !ruleReturn.catch) {
      isAsync = false;
      ruleReturn = ruleReturn
        ? Promise.resolve(ruleReturn)
        : Promise.reject(ruleReturn);
    }
    const data = {
      errors,
      fieldName,
      target,
      isAsync,
    };
    return ruleReturn.then(
      promiseValue => Object.assign(data, { promiseValue }),
      promiseValue => {
        data.errors = this.messageHandler(errors, rule, target, promiseValue);
        return Promise.reject(Object.assign(data, { promiseValue }));
      },
    );
  };

  addRule(newRuleSet) {
    this.ruleSet = {
      ...this.ruleSet,
      ...newRuleSet,
    };
  }

  deleteRule(ruleName) {
    delete this.ruleSet[ruleName];
  }
}
