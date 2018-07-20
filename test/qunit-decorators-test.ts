import hello from 'qunit-decorators';

QUnit.module('qunit-decorators tests');

QUnit.test('hello', assert => {
  assert.equal(hello(), 'Hello from qunit-decorators');
});
