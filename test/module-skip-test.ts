import { suite, test } from 'qunit-decorators';

@suite.skip
class ModuleSkipTest {
  @test
  willFail(assert: Assert) {
    assert.ok(false);
  }
}
