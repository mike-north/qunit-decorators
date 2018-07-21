// tslint:disable ban-types
const INIT_TASKS_KEY = `__qunit_decorators_${Math.round(Math.random() * 1e9)}`;
type TestInitTaskFn = (opts: TestOptions) => any;
interface QUnitModuleMetadata {
  testData: {
    allTestOptions: TestOptions;
    initTasks: {
      [k: string]: TestInitTask;
    };
  };
}
interface TestInitTask {
  options: TestOptions;
  run: TestInitTaskFn;
}
interface TestOptions {
  skip?: boolean;
  only?: boolean;
  todo?: boolean;
}

interface Module {
  new (): any;
}

function getModuleMetadata(testModule: Module | Function): QUnitModuleMetadata {
  const obj = testModule as any;
  if (typeof obj[INIT_TASKS_KEY] === 'undefined') {
    obj[INIT_TASKS_KEY] = {
      testData: {
        allTestOptions: { skip: false },
        initTasks: {}
      }
    };
  }
  return obj[INIT_TASKS_KEY];
}

function addInitTask(
  target: any,
  name: string,
  task: TestInitTaskFn
): TestInitTask {
  const { initTasks } = getModuleMetadata(target).testData;
  const options = {};
  return (initTasks[name] = {
    run: task,
    options
  });
}

interface ModuleDecoratorOptions {
  skip?: boolean;
  only?: boolean;
}

function qunitModuleDecorator(
  target: any,
  name: string,
  options: ModuleDecoratorOptions,
  hooks?: Hooks,
  nested?: (hooks: NestedHooks) => void
) {
  let fn = QUnit.module;
  if (options.skip) fn = (QUnit.module as any).skip;
  else if (options.only) fn = (QUnit.module as any).only;
  fn(name, hks => {
    if (nested) nested(hks);
    if (hooks && hooks.before) hks.before(hooks.before);
    if (hooks && hooks.after) hks.after(hooks.after);
    if (hooks && hooks.beforeEach) hks.beforeEach(hooks.beforeEach);
    if (hooks && hooks.afterEach) hks.afterEach(hooks.afterEach);
    if (target.before) hks.before(target.before);
    if (target.after) hks.after(target.after);
    if (target.prototype.beforeEach) {
      hks.beforeEach(target.prototype.beforeEach);
    }
    if (target.prototype.afterEach) hks.afterEach(target.prototype.afterEach);
    const { initTasks } = getModuleMetadata(target).testData;
    Object.keys(initTasks)
      .map(k => initTasks[k])
      .forEach(task => {
        task.run(task.options);
      });
  });
}

function baseQunitModuleDecorator(
  nameOrTarget: Function | string,
  options: ModuleDecoratorOptions = { skip: false, only: false },
  hooksOrNested?: Hooks | ((hooks: NestedHooks) => void),
  nested?: ((hooks: NestedHooks) => void)
): ClassDecorator | void {
  const name =
    typeof nameOrTarget === 'string' ? nameOrTarget : nameOrTarget.name;
  if (typeof nameOrTarget !== 'string') {
    const target = nameOrTarget;
    qunitModuleDecorator(target, name, options);
  } else {
    return (target: any) => {
      let hooks = typeof hooksOrNested === 'object' ? hooksOrNested : undefined;
      let nestedFn = typeof hooksOrNested !== 'object' ? hooksOrNested : nested;
      qunitModuleDecorator(target, name, options, hooks, nestedFn);
    };
  }
}

function qunitModule<TFunction extends Function>(
  target: TFunction
): TFunction | void;
function qunitModule(
  name: string,
  nested?: (hooks: NestedHooks) => void
): ClassDecorator;
function qunitModule(
  name: string,
  hooks?: Hooks,
  nested?: (hooks: NestedHooks) => void
): ClassDecorator;
function qunitModule(
  nameOrTarget: Function | string,
  hooksOrNested?: Hooks | ((hooks: NestedHooks) => void),
  nested?: ((hooks: NestedHooks) => void)
): ClassDecorator | void {
  return baseQunitModuleDecorator(nameOrTarget, {}, hooksOrNested, nested);
}

function moduleSkip<TFunction extends Function>(
  target: TFunction
): TFunction | void;
function moduleSkip(
  name: string,
  nested?: (hooks: NestedHooks) => void
): ClassDecorator;
function moduleSkip(
  name: string,
  hooks?: Hooks,
  nested?: (hooks: NestedHooks) => void
): ClassDecorator;
function moduleSkip(
  nameOrTarget: Function | string,
  hooksOrNested?: Hooks | ((hooks: NestedHooks) => void),
  nested?: ((hooks: NestedHooks) => void)
): ClassDecorator | void {
  return baseQunitModuleDecorator(
    nameOrTarget,
    { skip: true },
    hooksOrNested,
    nested
  );
}
function moduleOnly<TFunction extends Function>(
  target: TFunction
): TFunction | void;
function moduleOnly(
  name: string,
  nested?: (hooks: NestedHooks) => void
): ClassDecorator;
function moduleOnly(
  name: string,
  hooks?: Hooks,
  nested?: (hooks: NestedHooks) => void
): ClassDecorator;
function moduleOnly(
  nameOrTarget: Function | string,
  hooksOrNested?: Hooks | ((hooks: NestedHooks) => void),
  nested?: ((hooks: NestedHooks) => void)
): ClassDecorator | void {
  return baseQunitModuleDecorator(
    nameOrTarget,
    { only: true },
    hooksOrNested,
    nested
  );
}
type moduleDecorator = typeof qunitModule & {
  skip: typeof moduleSkip;
  only: typeof moduleOnly;
};
(qunitModule as any).skip = moduleSkip;
(qunitModule as any).only = moduleOnly;
export const suite = qunitModule as moduleDecorator;

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
function testDecorator<T>(
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> | void;
// @test('this is a thing')
function testDecorator(name: string): MethodDecorator;
function testDecorator<T>(
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

type dec = typeof testDecorator & {
  only: typeof testOnly;
  skip: typeof testSkip;
  todo: typeof testTodo;
};
(testDecorator as any).only = testOnly;
(testDecorator as any).skip = testSkip;
(testDecorator as any).todo = testTodo;

export const test = testDecorator as dec;
