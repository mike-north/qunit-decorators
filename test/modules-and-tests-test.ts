import { module, test } from 'qunit-decorators';

let invocationCounts: { [k: string]: number } = {};

@module('(experiment) Test basic use of decorators for modules and tests')
class ModulesTest {
  @test // uses method name as description
  testNoDescription(assert: Assert) {
    assert.ok(true);
    invocationCounts.testNoDescription =
      (invocationCounts.testNoDescription || 0) + 1;
  }

  @test('A test') // custom description
  testWithDescription(assert: Assert) {
    assert.ok(true);
    invocationCounts.testWithDescription =
      (invocationCounts.testWithDescription || 0) + 1;
  }
}

QUnit.module('z Test basic use of decorators for modules and tests');
QUnit.test(
  'A method decorated with zero-argument @test decorator ran once',
  assert => {
    assert.equal(invocationCounts.testNoDescription, 1);
  }
);
QUnit.test(
  'A method decorated with one-argument @test("") decorator ran once',
  assert => {
    assert.equal(invocationCounts.testNoDescription, 1);
  }
);
