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

function qunitSuiteDecorator(
  target: any,
  name: string,
  options: ModuleDecoratorOptions,
  meta: { [k: string]: any } = {},
  hooks?: Hooks,
  nested?: (hooks: NestedHooks) => void
) {
  let fn: (name: string, cb: (this: any, hooks: NestedHooks) => void) => void = QUnit.module;
  if (options.skip) fn = (QUnit.module as any).skip;
  else if (options.only) fn = (QUnit.module as any).only;
  let normalizedName: string = name
    ? name
    : target
      ? target.name
      : `Unnamed QUnit Module ${Math.round(1e6 + Math.random() * 1e6).toString(
          16
        )}`;
  let returned: any = fn(normalizedName, function(this: any, hks: NestedHooks) {
    if (nested) nested(hks);
    let instance = new target(hks);
    Object.assign(this, instance);
    if (hooks && hooks.before) hks.before(hooks.before);
    if (hooks && hooks.after) hks.after(hooks.after);
    if (hooks && hooks.beforeEach) hks.beforeEach(hooks.beforeEach);
    if (hooks && hooks.afterEach) hks.afterEach(hooks.afterEach);
    if (instance.before) {
      hks.before(instance.before);
    }
    if (instance.after) {
      hks.after(instance.after);
    }
    if (instance.beforeEach) {
      hks.beforeEach(instance.beforeEach);
    }
    if (instance.afterEach) hks.afterEach(instance.afterEach);
    const { initTasks } = getModuleMetadata(target).testData;
    Object.keys(initTasks)
      .map(k => initTasks[k])
      .forEach(task => {
        task.run(task.options);
      });
  });
  if (returned && returned.meta) {
    returned.meta(meta);
  }
}

function isHooks(maybeHooks: { [k: string]: any }) {
  // only a few property keys are allowed
  // all values must be functions
  const keys = Object.keys(maybeHooks);
  for (let k of keys) {
    if (['before', 'beforeEach', 'after', 'afterEach'].indexOf(k) < 0) {
      return false;
    }
    if (typeof maybeHooks[k] !== 'function') return false;
  }
  return true;
}

function baseQunitModuleDecorator(
  nameMetaOrTarget: Function | string | { [k: string]: any },
  options: ModuleDecoratorOptions = { skip: false, only: false },
  hooksMetaOrNested?: { [k: string]: any } | ((hooks: NestedHooks) => void),
  metaOrNested?: { [k: string]: any } | ((hooks: NestedHooks) => void),
  nested?: ((hooks: NestedHooks) => void)
): ClassDecorator | void {
  if (typeof nameMetaOrTarget !== 'function') {
    return (target: any) => {
      const arg3isHooks =
        typeof hooksMetaOrNested === 'object' && isHooks(hooksMetaOrNested);
      const name =
        typeof nameMetaOrTarget === 'string' ? nameMetaOrTarget : target.name;
      let hooks = arg3isHooks ? hooksMetaOrNested : undefined;
      const meta =
        typeof nameMetaOrTarget !== 'string'
          ? nameMetaOrTarget
          : !arg3isHooks
            ? hooksMetaOrNested
            : typeof metaOrNested !== 'function'
              ? metaOrNested
              : {};
      let nestedFn =
        typeof hooksMetaOrNested !== 'object'
          ? hooksMetaOrNested
          : typeof metaOrNested !== 'object'
            ? metaOrNested
            : nested;
      qunitSuiteDecorator(target, name, options, meta, hooks, nestedFn);
    };
  } else {
    const target = nameMetaOrTarget;
    const name = nameMetaOrTarget.name;
    qunitSuiteDecorator(target, name, options);
  }
}

function qunitModule<TFunction extends Function>(
  target: TFunction
): TFunction | void;
function qunitModule(
  name: string,
  nested?: (hooks: NestedHooks) => void
): ClassDecorator;
function qunitModule(meta: { [k: string]: any }): ClassDecorator;
function qunitModule(
  name: string,
  hooks: Hooks,
  meta: { [k: string]: any },
  nested?: (hooks: NestedHooks) => void
): ClassDecorator;
function qunitModule(
  name: string,
  meta: { [k: string]: any },
  nested?: (hooks: NestedHooks) => void
): ClassDecorator;
function qunitModule(
  name: string,
  hooks?: Hooks,
  nested?: (hooks: NestedHooks) => void
): ClassDecorator;
function qunitModule(
  nameMetaOrTarget: Function | string | { [k: string]: any },
  hooksMetaOrNested?: { [k: string]: any } | ((hooks: NestedHooks) => void),
  metaOrNested?: { [k: string]: any } | ((hooks: NestedHooks) => void),
  nested?: ((hooks: NestedHooks) => void)
): ClassDecorator | void {
  return baseQunitModuleDecorator(
    nameMetaOrTarget,
    {},
    hooksMetaOrNested,
    metaOrNested,
    nested
  );
}

function moduleSkip<TFunction extends Function>(
  target: TFunction
): TFunction | void;
function moduleSkip(
  name: string,
  nested?: (hooks: NestedHooks) => void
): ClassDecorator;
function moduleSkip(meta: { [k: string]: any }): ClassDecorator;
function moduleSkip(
  name: string,
  hooks: Hooks,
  meta: { [k: string]: any },
  nested?: (hooks: NestedHooks) => void
): ClassDecorator;
function moduleSkip(
  name: string,
  meta: { [k: string]: any },
  nested?: (hooks: NestedHooks) => void
): ClassDecorator;
function moduleSkip(
  name: string,
  hooks?: Hooks,
  nested?: (hooks: NestedHooks) => void
): ClassDecorator;
function moduleSkip(
  nameMetaOrTarget: Function | string | { [k: string]: any },
  hooksMetaOrNested?: { [k: string]: any } | ((hooks: NestedHooks) => void),
  metaOrNested?: { [k: string]: any } | ((hooks: NestedHooks) => void),
  nested?: ((hooks: NestedHooks) => void)
): ClassDecorator | void {
  return baseQunitModuleDecorator(
    nameMetaOrTarget,
    { skip: true },
    hooksMetaOrNested,
    metaOrNested,
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
function moduleOnly(meta: { [k: string]: any }): ClassDecorator;
function moduleOnly(
  name: string,
  hooks: Hooks,
  meta: { [k: string]: any },
  nested?: (hooks: NestedHooks) => void
): ClassDecorator;
function moduleOnly(
  name: string,
  meta: { [k: string]: any },
  nested?: (hooks: NestedHooks) => void
): ClassDecorator;
function moduleOnly(
  name: string,
  hooks?: Hooks,
  nested?: (hooks: NestedHooks) => void
): ClassDecorator;
function moduleOnly(
  nameMetaOrTarget: Function | string | { [k: string]: any },
  hooksMetaOrNested?: { [k: string]: any } | ((hooks: NestedHooks) => void),
  metaOrNested?: { [k: string]: any } | ((hooks: NestedHooks) => void),
  nested?: ((hooks: NestedHooks) => void)
): ClassDecorator | void {
  return baseQunitModuleDecorator(
    nameMetaOrTarget,
    { only: true },
    hooksMetaOrNested,
    metaOrNested,
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
  nameMetaOrTarget: string | Object,
  propertyKeyOrMeta?: string | symbol | { [k: string]: any },
  descriptor?: TypedPropertyDescriptor<T>,
  options: { skip?: boolean; todo?: boolean; only?: boolean } = {},
  meta: { [k: string]: any } = {}
): MethodDecorator | TypedPropertyDescriptor<T> | void {
  if (
    typeof nameMetaOrTarget !== 'string' &&
    propertyKeyOrMeta &&
    typeof propertyKeyOrMeta !== 'object'
  ) {
    const propertyKey = propertyKeyOrMeta;
    const target = nameMetaOrTarget as any;
    const fn = target[propertyKey];
    const name = fn.name;
    let task = addInitTask(target.constructor, name, opts => {
      let fnName: 'skip' | 'only' | 'todo' | 'test';
      if (opts.skip) {
        fnName = 'skip';
      } else if (opts.only) {
        fnName = 'only';
      } else if (opts.todo) {
        fnName = 'todo';
      } else {
        fnName = 'test';
      }
      let returned = (QUnit as any)[fnName](name, fn);
      if (returned && returned.meta) {
        returned.meta({});
      }
    });
    if (options.skip) task.options.skip = true;
    if (options.todo) task.options.todo = true;
    if (options.only) task.options.only = true;
    return descriptor;
  } else {
    return (
      target: any,
      key: string | symbol,
      desc: TypedPropertyDescriptor<any>
    ) => {
      if (typeof key === 'symbol') {
        throw new Error('Symbol test names are not allowed');
      }
      const name =
        typeof nameMetaOrTarget === 'string' ? nameMetaOrTarget : key;
      const testMeta =
        typeof nameMetaOrTarget !== 'string'
          ? nameMetaOrTarget
          : typeof propertyKeyOrMeta === 'object'
            ? propertyKeyOrMeta
            : meta || {};
      const fn = target[key];
      let task = addInitTask(target.constructor, fn.name, opts => {
        let fnName: 'skip' | 'only' | 'todo' | 'test';
        if (opts.skip) {
          fnName = 'skip';
        } else if (opts.only) {
          fnName = 'only';
        } else if (opts.todo) {
          fnName = 'todo';
        } else {
          fnName = 'test';
        }
        let returned = (QUnit as any)[fnName](name, fn);
        if (returned && returned.meta) {
          returned.meta(testMeta);
        }
      });
      if (options.skip) task.options.skip = true;
      if (options.todo) task.options.todo = true;
      if (options.only) task.options.only = true;
      return desc;
    };
  }
}

// @test
// @test('this is a thing')
// @test({ meta })
// @test('this is a thing', { meta })
function testDecorator<T>(
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> | void;
function testDecorator(
  name: string,
  meta?: { [k: string]: any }
): MethodDecorator;
function testDecorator(meta: { [k: string]: any }): MethodDecorator;
function testDecorator<T>(
  nameMetaOrTarget: string | Object,
  propertyKeyOrMeta?: string | symbol | { [k: string]: any },
  descriptor?: TypedPropertyDescriptor<T>
): MethodDecorator | TypedPropertyDescriptor<T> | void {
  return makeTestDecorator(nameMetaOrTarget, propertyKeyOrMeta, descriptor);
}

// @test.only
function testOnly<T>(
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> | void;
function testOnly(name: string, meta?: { [k: string]: any }): MethodDecorator;
function testOnly(meta: { [k: string]: any }): MethodDecorator;
function testOnly<T>(
  nameMetaOrTarget: string | Object,
  propertyKeyOrMeta?: string | symbol | { [k: string]: any },
  descriptor?: TypedPropertyDescriptor<T>
): MethodDecorator | TypedPropertyDescriptor<T> | void {
  return makeTestDecorator(nameMetaOrTarget, propertyKeyOrMeta, descriptor, {
    only: true
  });
}

// @test.skip
function testSkip<T>(
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> | void;
function testSkip(name: string, meta?: { [k: string]: any }): MethodDecorator;
function testSkip(meta: { [k: string]: any }): MethodDecorator;
function testSkip<T>(
  nameMetaOrTarget: string | Object,
  propertyKeyOrMeta?: string | symbol | { [k: string]: any },
  descriptor?: TypedPropertyDescriptor<T>
): MethodDecorator | TypedPropertyDescriptor<T> | void {
  return makeTestDecorator(nameMetaOrTarget, propertyKeyOrMeta, descriptor, {
    skip: true
  });
}

// @test.todo
function testTodo<T>(
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> | void;
function testTodo(name: string, meta?: { [k: string]: any }): MethodDecorator;
function testTodo(meta: { [k: string]: any }): MethodDecorator;
function testTodo<T>(
  nameMetaOrTarget: string | Object,
  propertyKeyOrMeta?: string | symbol | { [k: string]: any },
  descriptor?: TypedPropertyDescriptor<T>
): MethodDecorator | TypedPropertyDescriptor<T> | void {
  return makeTestDecorator(nameMetaOrTarget, propertyKeyOrMeta, descriptor, {
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
