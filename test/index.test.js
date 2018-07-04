import Validator from '../src';

describe('Validator', () => {
  const nameRule = [
    {
      validator: name => name,
      message: 'Please input something!',
    },
    {
      validator(date) {
        return new Promise((res, rej) => {
          setTimeout(() => {
            date === 'loading' ? res(date) : rej(date);
          }, 0);
        });
      },
      message: name => `"${name}" is not my name!`,
    },
  ];
  const rules = {
    name: nameRule,
    job: {
      rules: {
        validator(data) {
          return data[0] === '3' && data[1] === 'loading';
        },
        message: 'Only FE!',
        withFields: ['name'],
      },
    },
  };
  describe('validate', () => {
    // const validator = new Validator(rules);
  });
  describe('validateItem', () => {
    const validator = new Validator(rules);
    test('success', () => {
      return validator.validateItem({ name: 'loading' }, 'name').then(data => {
        expect(data.errors).toEqual([]);
      });
    });
    test('fail', done => {
      function callback(errors) {
        expect(errors).toEqual([`"123" is not my name!`]);
        done();
      }
      validator.validateItem({ name: '123' }, 'name', callback);
    });
    test('first', () => {
      expect.assertions(1);
      return validator.validate('', nameRule, { first: true }).catch(data => {
        expect(data.errors).toEqual(['Please input something!']);
      });
    });
    test('no first', () => {
      expect.assertions(1);
      return validator
        .validate('', nameRule, () => {}, {
          first: false,
        })
        .catch(data => {
          expect(data.errors).toEqual([
            'Please input something!',
            '"" is not my name!',
          ]);
        });
    });
    test('cover last validation', done => {
      function callback() {
        expect(true).toBe(false);
        done();
      }
      validator.validateItem({ name: '123' }, 'name', callback);
      function callback2(errors) {
        expect(errors).toEqual([`Please input something!`]);
        done();
      }
      validator.validateItem({ name: '' }, 'name', callback2);
    });
    test('no cover', done => {
      validator.setOptions({ retention: true });
      validator.validateItem({ name: '' }, 'name', errors => {
        expect(errors).toEqual([`Please input something!`]);
        done();
      });
      validator.validateItem({ name: 'loading' }, 'name', errors => {
        expect(errors).toEqual(null);
        done();
      });
    });
    test('with', done => {
      validator.validateItem({ name: 'loading', job: '3' }, 'job', errors => {
        expect(errors).toEqual(null);
        done();
      });
    });
  });
});
