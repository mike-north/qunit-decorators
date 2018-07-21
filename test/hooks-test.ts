import { module, test } from 'qunit-decorators';

let invocationCounts: { [k: string]: number } = {};

const myHooks: Hooks = {
  beforeEach() {
    invocationCounts.beforeEach = (invocationCounts.beforeEach || 0) + 1;
  },
  afterEach() {
    invocationCounts.afterEach = (invocationCounts.afterEach || 0) + 1;
  },
  before() {
    invocationCounts.before = (invocationCounts.before || 0) + 1;
  },
  after() {
    invocationCounts.after = (invocationCounts.after || 0) + 1;
  }
};

let testsRun = 0;
@module('Test that hooks work via the @module decorator', myHooks)
class HooksTestExperiment {
  @test first(assert: Assert) {
    assert.equal(invocationCounts.after, undefined);
    assert.equal(invocationCounts.before, 1);
    assert.equal(invocationCounts.afterEach, testsRun || undefined);
    assert.equal(+invocationCounts.beforeEach, testsRun + 1);
    testsRun++;
  }

  @test second(assert: Assert) {
    assert.equal(invocationCounts.after, undefined);
    assert.equal(invocationCounts.before, 1);
    assert.equal(invocationCounts.afterEach, testsRun || undefined);
    assert.equal(+invocationCounts.beforeEach, testsRun + 1);
    testsRun++;
  }
  @test third(assert: Assert) {
    assert.equal(invocationCounts.after, undefined);
    assert.equal(invocationCounts.before, 1);
    assert.equal(invocationCounts.afterEach, testsRun || undefined);
    assert.equal(+invocationCounts.beforeEach, testsRun + 1);
    testsRun++;
  }
}
