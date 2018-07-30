import { suite, test } from 'qunit-decorators';

let testsRun = 0;
@suite('Test that decorators work with string method names')
class NonDuplicateNamesTest {
  @test 'first test'(assert: Assert) {
    assert.ok(true);
  }

  @test 'second test'(assert: Assert) {
    assert.ok(true);
  }
  @test.skip 'test'(assert: Assert) {
    assert.ok(true);
  }
}
