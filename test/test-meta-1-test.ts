import { suite, test } from 'qunit-decorators';

let runCount = 0;
let zeroCount = 0;
@suite
class TestMetaTest {
  @test({ points: 999 })
  first(assert: Assert) {
    if (zeroCount > 0) {
      assert.ok(runCount > 0);
    }
    if (runCount === 0) zeroCount++;
    assert.ok(true);
    runCount++;
  }
  @test('second', { medal: 'silver' }) second(assert: Assert) {
    if (zeroCount > 0) {
      assert.ok(runCount > 0);
    }
    if (runCount === 0) zeroCount++;
    assert.ok(true);
    runCount++;
  }
}
