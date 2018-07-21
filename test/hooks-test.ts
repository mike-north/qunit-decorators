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
let invocationCounts2: { [k: string]: number } = {};

let testsRun2 = 0;
@module('Test that nested hooks work via the @module decorator', hks => {
  hks.beforeEach(() => {
    invocationCounts2.beforeEach = (invocationCounts2.beforeEach || 0) + 1;
  });
  hks.afterEach(() => {
    invocationCounts2.afterEach = (invocationCounts2.afterEach || 0) + 1;
  });
  hks.before(() => {
    invocationCounts2.before = (invocationCounts2.before || 0) + 1;
  });
  hks.after(() => {
    invocationCounts2.after = (invocationCounts2.after || 0) + 1;
  });
})
class NestedHooksTestExperiment {
  @test first(assert: Assert) {
    assert.equal(invocationCounts2.after, undefined);
    assert.equal(invocationCounts2.before, 1);
    assert.equal(invocationCounts2.afterEach, testsRun2 || undefined);
    assert.equal(+invocationCounts2.beforeEach, testsRun2 + 1);
    testsRun2++;
  }

  @test second(assert: Assert) {
    assert.equal(invocationCounts2.after, undefined);
    assert.equal(invocationCounts2.before, 1);
    assert.equal(invocationCounts2.afterEach, testsRun2 || undefined);
    assert.equal(+invocationCounts2.beforeEach, testsRun2 + 1);
    testsRun2++;
  }
  @test third(assert: Assert) {
    assert.equal(invocationCounts2.after, undefined);
    assert.equal(invocationCounts2.before, 1);
    assert.equal(invocationCounts2.afterEach, testsRun2 || undefined);
    assert.equal(+invocationCounts2.beforeEach, testsRun2 + 1);
    testsRun2++;
  }
}
