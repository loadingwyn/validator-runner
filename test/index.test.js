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
    test('fail(first mode)', () => {
      expect.assertions(1);
      return validator.validateItem({ name: '' }, 'name').catch(data => {
        expect(data.errors).toEqual([`Please input something!`]);
      });
    });
    test('fail', () => {
      expect.assertions(1);
      return validator.validateItem({ name: '123' }, 'name').catch(data => {
        expect(data.errors).toEqual([`"123" is not my name!`]);
      });
    });
    test('cover last validation', done => {
      validator
        .validateItem({ name: '123' }, 'name', () => {
          expect(true).toBe(false);
          done();
        })
        .catch(e => e);
      validator.validateItem({ name: '' }, 'name', errors => {
        expect(errors).toEqual([`Please input something!`]);
        done();
      }).catch(e => e);
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
          { first: true, cover: false, parallel: false },
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

  describe('validator', () => {
    test('组合校验：通过', done => {
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
  //   test('组合校验：一条不通过', () => {
  //     expect(validator.validate({ date: '2017' }, () => {}, ['date'])).toEqual({
  //       date: 'empty'
  //     });
  //   });

  //   test('组合校验：全部不通过', () => {
  //     expect(validator.validate({ date: '201' }, () => {}, ['date'])).toEqual({
  //       date: 'wrong date empty'
  //     });
  //   });
  //   test('同时校验全部规则：通过', () => {
  //     expect(validator.validate({ date: '2017', name: 'wyn' })).toEqual({
  //       date: '',
  //       name: ''
  //     });
  //   });
  //   test('同时校验全部规则：一条通过', () => {
  //     expect(validator.validate({ date: '2017', name: 'w' })).toEqual({
  //       date: '',
  //       name: 'wrong name'
  //     });
  //   });
  //   test('同时校验全部规则：不通过', () => {
  //     expect(validator.validate({ date: '207', name: '' })).toEqual({
  //       date: 'wrong date empty',
  //       name: 'wrong name'
  //     });
  //   });
});
