import { suite, test } from 'qunit-decorators';

let runCount = 0;
let zeroCount = 0;
@suite('Meta test 2', { difficulty: 3 })
class MetaTest2 {
  @test first(assert: Assert) {
    if (zeroCount > 0) {
      assert.ok(runCount > 0);
    }
    if (runCount === 0) zeroCount++;
    assert.ok(true);
    runCount++;
  }
  @test second(assert: Assert) {
    if (zeroCount > 0) {
      assert.ok(runCount > 0);
    }
    if (runCount === 0) zeroCount++;
    assert.ok(true);
    runCount++;
  }
}
