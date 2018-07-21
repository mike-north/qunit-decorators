import { module, test } from 'qunit-decorators';

@module// .only
class ModuleOnlyTest {
  @test
  oneTest(assert: Assert) {
    assert.ok(true);
  }
}
