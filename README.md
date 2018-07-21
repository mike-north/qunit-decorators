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

When using qunit-decorators, you’ll use classes organize modules, and methods for your tests

```ts
import { module, test } from 'qunit-decorators';

@module // <-- decorate your modules with @module
class UserLoginTests {

  @test // <-- decorate your test methods with @test
  loginWithoutPassword(assert: Assert) {
    let { result } = loginWithoutPassword(); // the thing being tested
    assert.equal(result, 'ERROR', 'User receives an error'); // ✅
  }
  
  foo() {} // <-- You're free to put other non-test methods on the class too!
}
```

In the example above your test module would get its name from the class (`UserLoginTests`), and it would contain a test that gets its name from the method (`loginWithoutPassword`). You may also pass an argument to these decorators, in order to provide your own names

_see: [QUnit.module](https://api.qunitjs.com/QUnit/module) and [QUnit.test](https://api.qunitjs.com/QUnit/test)_


```ts
import { module, test } from 'qunit-decorators';

@module('User authentication test suite')
class UserLoginTests {

  @test('Missing password case errors as expected')
  loginWithoutPassword(assert: Assert) {
    let { result } = loginWithoutPassword(); // the thing being tested
    assert.equal(result, 'ERROR', 'User receives an error'); // ✅
  }

}
```

### Skipping & Focusing

Sometimes it's useful to temporarily focus on a subset of tests while writing new code. QUnit allows you to focus on a combination of modules and tests within modules.

_see: [QUnit.only](https://api.qunitjs.com/QUnit/only)_

```ts
import { module, test } from 'qunit-decorators';

@module.only('Working on some new tests')
class MyNewTests { ... }

@module
class ExistingFeatureTests {

  @test.only('Fixing something else too')
  buttonTest() { ... }

}
```

Alternatively, you may choose specific tests or modules to skip in a similar way

_see: [QUnit.skip](https://api.qunitjs.com/QUnit/skip)_

```ts
import { module, test } from 'qunit-decorators';

@module.skip('Things that take a long time')
class SlowTests { ... }

@module
class ExistingFeatureTests {

  @test.skip
  buggyTest() { ... }

}
```

Particularly while in the middle of a code change, you'll sometimes have tests that won't pass because you haven't gotten to them yet. You may mark these tests with `@test.todo`, and they'll pass as long as at least one assertion fails.

_see: [QUnit.todo](https://api.qunitjs.com/QUnit/todo)_

```ts
import { module, test } from 'qunit-decorators';

@module
class WIPBugFixes {

  @test.todo("We'll get to this Soon™️")
  somethingForTomorrow() {
    assert.ok(false);
  }

}
```

### Hooks



---

(c) 2018 LinkedIn
