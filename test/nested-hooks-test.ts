import { suite, test } from 'qunit-decorators';

let counts: { [k: string]: number } = {};

let testsRun = 0;
@suite('Test that nested hooks work via the @module decorator', hks => {
  hks.beforeEach(() => {
    counts.beforeEach = (counts.beforeEach || 0) + 1;
  });
  hks.afterEach(() => {
    counts.afterEach = (counts.afterEach || 0) + 1;
  });
  hks.before(() => {
    counts.before = (counts.before || 0) + 1;
  });
  hks.after(() => {
    counts.after = (counts.after || 0) + 1;
  });
})
class NestedHooksTest {
  @test
  first(assert: Assert) {
    assert.equal(counts.after, undefined);
    assert.equal(counts.before, 1);
    assert.equal(counts.afterEach, testsRun || undefined);
    assert.equal(+counts.beforeEach, testsRun + 1);
    testsRun++;
  }

  @test
  second(assert: Assert) {
    assert.equal(counts.after, undefined);
    assert.equal(counts.before, 1);
    assert.equal(counts.afterEach, testsRun || undefined);
    assert.equal(+counts.beforeEach, testsRun + 1);
    testsRun++;
  }
  @test
  third(assert: Assert) {
    assert.equal(counts.after, undefined);
    assert.equal(counts.before, 1);
    assert.equal(counts.afterEach, testsRun || undefined);
    assert.equal(+counts.beforeEach, testsRun + 1);
    testsRun++;
  }
}
