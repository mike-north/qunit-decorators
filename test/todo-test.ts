// import { module, test } from 'qunit-decorators';

// let invocationCounts: { [k: string]: number } = {};

// @module('(experiment) Test use of the @todo decorator')
// class TodoTest {
//   @test.todo
//   testTodo(assert: Assert) {
//     invocationCounts.testTodo = (invocationCounts.testTodo || 0) + 1;
//     assert.ok(true);
//   }
// }

// QUnit.module('zzz Test use of the @todo decorator');
// QUnit.test(
//   'A method decorated with @todo decorator is invoked, and passes despite failures',
//   assert => {
//     assert.equal(invocationCounts.testTodo, 1);
//   }
// );
