// tslint:disable ban-types
const INIT_TASKS_KEY = `__qunit_decorators_${Math.round(Math.random() * 1e9)}`;
type TestInitTaskFn = (opts: TestOptions) => any;
interface QUnitModuleMetadata {
  testData: {
    allTestOptions: TestOptions,
    initTasks: {
      [k: string]: TestInitTask
    }
  };
}
export interface TestInitTask {
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

export function getModuleMetadata(testModule: Module | Function): QUnitModuleMetadata {
  const obj = testModule as any;
  if (typeof obj[INIT_TASKS_KEY] === 'undefined') {
    obj[INIT_TASKS_KEY] = {
      testData: {
        allTestOptions: {skip: false},
        initTasks: {}
      }
    };
  }
  return obj[INIT_TASKS_KEY];
}

export function addInitTask(target: any, name: string, task: TestInitTaskFn) {
  const { initTasks } = getModuleMetadata(target).testData;
  const options = { };
  initTasks[name] = {
    run: task,
    options
  };
}

function qunitModuleDecorator(target: any, name: string, hooks?: Hooks, nested?: (hooks: NestedHooks) => void) {
  QUnit.module(name, hooks || {}, hks => {
    if (nested) nested(hks);
    const { initTasks } = getModuleMetadata(target).testData;
    Object.keys(initTasks)
      .map(k => initTasks[k])
      .forEach(task => {
        task.run(task.options);
      });
  });
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
  if (typeof nameOrTarget !== 'string') {
    // 1
    const target = nameOrTarget;
    return qunitModuleDecorator(target, name);
  } else {
    const name = nameOrTarget as string;
    return (target: any) => {
      let hooks = typeof hooksOrNested === 'object' ? hooksOrNested : undefined;
      let nestedFn = typeof hooksOrNested !== 'object' ? hooksOrNested : nested;
      return qunitModuleDecorator(target, name, hooks, nestedFn);
    };
  }
}
export default qunitModule;
