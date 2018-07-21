// tslint:disable ban-types

import { addInitTask } from './module';

function makeTestDecorator<T>(
  nameOrTarget: string | Object,
  propertyKey?: string | symbol,
  _descriptor?: TypedPropertyDescriptor<T>,
  options: { skip?: boolean; todo?: boolean; only?: boolean } = {}
): MethodDecorator | TypedPropertyDescriptor<T> | void {
  if (typeof nameOrTarget !== 'string' && propertyKey) {
    const target = nameOrTarget as any;
    const fn = target[propertyKey];
    const name = fn.name;
    let task = addInitTask(target.constructor, name, opts => {
      if (opts.skip) {
        QUnit.skip(name, fn);
      } else if (opts.only) {
        QUnit.only(name, fn);
      } else if (opts.todo) {
        QUnit.todo(name, fn);
      } else {
        QUnit.test(name, fn);
      }
    });
    if (options.skip) task.options.skip = true;
    if (options.todo) task.options.todo = true;
    if (options.only) task.options.only = true;
  } else {
    const name = nameOrTarget as string;
    return (
      target: any,
      key: string | symbol,
      _desc: TypedPropertyDescriptor<any>
    ) => {
      const fn = target[key];
      let task = addInitTask(target.constructor, fn.name, opts => {
        if (opts.skip) {
          QUnit.skip(name, fn);
        } else if (opts.only) {
          QUnit.only(name, fn);
        } else if (opts.todo) {
          QUnit.todo(name, fn);
        } else {
          QUnit.test(name, fn);
        }
      });
      if (options.skip) task.options.skip = true;
      if (options.todo) task.options.todo = true;
      if (options.only) task.options.only = true;
    };
  }
}

// @test
function test<T>(
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> | void;
// @test('this is a thing')
function test(name: string): MethodDecorator;
function test<T>(
  nameOrTarget: string | Object,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<T>
): MethodDecorator | TypedPropertyDescriptor<T> | void {
  return makeTestDecorator(nameOrTarget, propertyKey, descriptor);
}

// @test.only
function testOnly<T>(
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> | void;
// @test.only('this is a thing')
function testOnly(name: string): MethodDecorator;
function testOnly<T>(
  nameOrTarget: string | Object,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<T>
): MethodDecorator | TypedPropertyDescriptor<T> | void {
  return makeTestDecorator(nameOrTarget, propertyKey, descriptor, {
    only: true
  });
}

// @test.skip
function testSkip<T>(
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> | void;
// @test.skip('this is a thing')
function testSkip(name: string): MethodDecorator;
function testSkip<T>(
  nameOrTarget: string | Object,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<T>
): MethodDecorator | TypedPropertyDescriptor<T> | void {
  return makeTestDecorator(nameOrTarget, propertyKey, descriptor, {
    skip: true
  });
}

// @test.todo
function testTodo<T>(
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> | void;
// @test.todo('this is a thing')
function testTodo(name: string): MethodDecorator;
function testTodo<T>(
  nameOrTarget: string | Object,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<T>
): MethodDecorator | TypedPropertyDescriptor<T> | void {
  return makeTestDecorator(nameOrTarget, propertyKey, descriptor, {
    todo: true
  });
}

type dec = typeof test & {
  only: typeof testOnly;
  skip: typeof testSkip;
  todo: typeof testTodo;
};
(test as any).only = testOnly;
(test as any).skip = testSkip;
(test as any).todo = testTodo;

export default test as dec;
