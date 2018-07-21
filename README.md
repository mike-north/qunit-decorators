# QUnit Decorators
 Allow [QUnit](https://qunitjs.com/) tests to be written and organized with [JavaScript](https://github.com/tc39/proposal-decorators) or [TypeScript decorators](https://www.typescriptlang.org/docs/handbook/decorators.html).

## Setting this up in your project
```sh
npm install --save-dev qunit-decorators
```
or
```sh
yarn add -D qunit-decorators
```

## Writing your tests

When using qunit-decorators, you’ll use classes to describe your modules, and methods for your tests

```ts
@module // <-- decorate your modules with @module
class UserLoginTests {
 
  @test // <-- decorate your test methods with @test
	loginWithoutPassword(assert: Assert) {
	   let { result } = loginWithoutPassword(); // the thing being tested
     assert.equal(result, 'ERROR', 'User receives an error'); // ✅
  }

  foo() { } // <-- You're free to put other non-test methods on the class too!
}
```

---
(c) 2018