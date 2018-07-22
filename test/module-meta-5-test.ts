import { suite, test } from 'qunit-decorators';
let count1 = 0;
let count2 = 0;
let runCount = 0;
let zeroCount = 0;
@suite(
  'Meta test 5',
  {
    before() {
      count1++;
    }
  },
  { color: 'green' },
  (hks: NestedHooks) => {
    hks.before(() => count2++);
  }
)
class MetaTest5 {
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
  @test('hooks are run')
  hooksAreRun(a: Assert) {
    a.equal(count1, 1);
    a.equal(count2, 1);
  }
}
