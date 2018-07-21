import { module, skip, test, todo } from 'qunit-decorators';

let invocationCounts: { [k: string]: number } = {};

@module('(experiment) Test use of the @todo decorator')
class TodoTest {
  @todo
  @test
  testTodo(assert: Assert) {
    assert.ok(false);
    invocationCounts.testTodo = (invocationCounts.testTodo || 0) + 1;
  }

}

QUnit.module('zzz Test use of the @todo decorator');
QUnit.test(
  'A method decorated with @tofo decorator is invoked, and passes despite failures',
  assert => {
    assert.equal(invocationCounts.testTodo, 1);
  }
);