import Validator from '../src';

describe('Validator', () => {
  const rules = {
    name: [
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
    ],
    job: {
      validator(data) {
        return data === '3';
      },
      message: 'Only FE!',
    },
  };
  describe('validateItem', () => {
    const validator = new Validator(rules);
    test('success', () => {
      return validator.validateItem({ name: 'loading' }, 'name').then(data => {
        expect(data.errors).toEqual([]);
      });
    });
    test('fail', () => {
      expect.assertions(1);
      return validator.validateItem({ name: '123' }, 'name').catch(data => {
        expect(data.errors).toEqual([`"123" is not my name!`]);
      });
    });
    test('first', () => {
      expect.assertions(1);
      return validator.validateItem({ name: '' }, 'name').catch(data => {
        expect(data.errors).toEqual([`Please input something!`]);
      });
    });
    test('no first', () => {
      expect.assertions(1);
      return validator
        .validateItem({ name: '' }, 'name', () => {}, {
          traversal: true,
          retention: false,
          concurrent: false,
        })
        .catch(data => {
          expect(data.errors).toEqual([
            'Please input something!',
            '"" is not my name!',
          ]);
        });
    });
    test('cover last validation', done => {
      validator
        .validateItem({ name: '123' }, 'name', () => {
          expect(true).toBe(false);
          done();
        })
        .catch(e => e);
      validator
        .validateItem({ name: '' }, 'name', errors => {
          expect(errors).toEqual([`Please input something!`]);
          done();
        })
        .catch(e => e);
    });
    test('no cover', done => {
      validator
        .validateItem(
          { name: '' },
          'name',
          errors => {
            expect(errors).toEqual([`Please input something!`]);
            done();
          },
          { traversal: false, retention: true, concurrent: false },
        )
        .catch(e => e);
      validator
        .validateItem({ name: 'loading' }, 'name', () => {
          expect(true).toEqual(false);
          done();
        })
        .catch(e => e);
    });
  });

  describe('validate', () => {
    test('success', done => {
      const validator = new Validator(rules);
      validator.validate(
        { name: 'loading', job: '3' },
        errors => {
          expect(errors).toEqual({
            name: [],
            job: [],
          });
          done();
        },
        {},
      );
    });
    test('fail', done => {
      const validator = new Validator(rules);
      validator.validate({ name: '12', job: 2 }, errors => {
        expect(errors).toEqual({
          name: [`"12" is not my name!`],
          job: ['Only FE!'],
        });
        done();
      });
    });
  });
});
