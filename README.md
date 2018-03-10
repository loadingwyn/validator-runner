# validator-runner

> async form validator runner

## Install

`yarn add validator-runner`

## Usage

define descriptor => passing the descriptor => add callback

```js
import Validator from 'validator-runner';

const descriptor = {
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
const validator = new Validator(descriptor);
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

### validateItem

`validateItem(source, fieldName, callback, options = { first: true, cover: true, concurrent: false },customFieldDescriptor)`

#### Arguments

- source: `object` The data to validate
- fieldName: `string` The name of field to validate
- callback: `function(errors, data)`
- option: `object`

`option.first` If true, every field will stop validation at first failed rule

`option.cover` If true, the last pending validation will be covered when a new validation begins

`option.concurrent` if true, all validator will be executed at the same time

#### Return

- promise: A promise that will be rejected if the validation fail

### validate

`validate(source, callback, specificField, options = { first: true, cover: true, concurrent: false },customFieldDescriptor)`

#### Arguments

- source: `object` The data to validate
- callback: `function(errors, data)`
- specificField: `array` The names of field to validate. If null, all fields will be validated.
- option: `object`

#### Return

- promise: A promise that will be rejected if the validation fail
