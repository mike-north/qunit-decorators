import { module, test } from 'qunit-decorators';

@module.skip
class ModuleSkipTest {
  @test
  willFail(assert: Assert) {    
    assert.ok(false);
  }
}
