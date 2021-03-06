import { suite, test } from 'qunit-decorators';

let invocationCounts: { [k: string]: number } = {};

@suite('(experiment) Test use of the @skip decorator')
class SkipTest {
  @test.skip
  testSkipped(assert: Assert) {
    assert.ok(true);
    invocationCounts.testSkipped = (invocationCounts.testSkipped || 0) + 1;
  }

  @test
  testNotSkipped(assert: Assert) {
    assert.ok(true);
    invocationCounts.testNotSkipped =
      (invocationCounts.testNotSkipped || 0) + 1;
  }
}

QUnit.module('Test use of the @skip decorator');
QUnit.test(
  'A method decorated with @skip decorator is never invoked',
  assert => {
    assert.equal(invocationCounts.testSkipped, undefined);
  }
);
QUnit.test(
  'Methods in the test module with a skipped test still run',
  assert => {
    assert.equal(invocationCounts.testNotSkipped, 1);
  }
);
