import { suite, test } from 'qunit-decorators';

@suite// .only
class ModuleOnlyTest {
  @test
  oneTest(assert: Assert) {
    assert.ok(true);
  }
}
