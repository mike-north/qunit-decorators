import { suite, test } from 'qunit-decorators';

let runCount = 0;
let zeroCount = 0;
@suite(
  'Meta test 4',
  {
    beforeEach() {
      return 1 + 1;
    }
  },
  { color: 'green' }
)
class MetaTest4 {
  @test
  first(assert: Assert) {
    if (zeroCount > 0) {
      assert.ok(runCount > 0);
    }
    if (runCount === 0) zeroCount++;
    assert.ok(true);
    runCount++;
  }
  @test
  second(assert: Assert) {
    if (zeroCount > 0) {
      assert.ok(runCount > 0);
    }
    if (runCount === 0) zeroCount++;
    assert.ok(true);
    runCount++;
  }
}
