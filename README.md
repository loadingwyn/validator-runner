# validator-runner

> async form validator runner

## Install

`yarn add validator-runner`

## Usage

```js
import Validator from 'validator-runner';

const schema = {
  name: [
    {
      validator: name => name,
      message: 'Please input something!',
    },
    {
      validator(name) {
        return new Promise((res, rej) => {
          setTimeout(() => {
            name === 'loading' ? res(name) : rej(name);
          }, 0);
        });
      },
      message: name => `"${name}" is not my name!`,
    },
  ],
  birth: {
    validator(date) {
      return date === '1995';
    },
    message: 'Wrong Date!',
  },
};
const validator = new Validator(schema);
validator.validateItem({ name: 'loading' }, 'name').then(data => {
  // data:
  //    errors: an array of errors
  //    rule: the validation object that executed last
});
// or
validator.validateItem({ name: 'loading' }, 'name', (errors, data) => {
  // errors: an array of errors
  // data:
  //    errors: an array of errors
  //    rule: the validation object that executed last
});
```

> ⚠️⚠️⚠️
>
> Note: All sync validators will be transformed to promises internally.

## Apis

### Validator

`new Validator(schema, options)`

### options

`option.first` default: `true`. If true, every field will not stop validation at first failed rule

`option.retention` default: `false`. If true, the last pending validation will be not covered when a new validation begins

`option.concurrent` default: `false`. if true, all validator will be executed at the same time

### validateItem

`validateItem(source, fieldName, callback})`

#### Arguments

- source: `object` The data to validate
- fieldName: `string` The name of field to validate
- callback: `function(errors, data)`

#### Return

- promise: A promise that will be rejected if the validation fails.
