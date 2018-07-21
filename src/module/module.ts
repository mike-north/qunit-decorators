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
    QUnit.module(nameOrTarget.name);
    const { initTasks } = getModuleMetadata(nameOrTarget).testData;
    Object.keys(initTasks)
      .map(k => initTasks[k])
      .forEach(task => {
        task.run(task.options);
      });
  } else {
    const name = nameOrTarget as string;
    return (target: any) => {
      QUnit.module(name, hooksOrNested as any, nested);
      const { initTasks } = getModuleMetadata(target).testData;
      Object.keys(initTasks)
        .map(k => initTasks[k])
        .forEach(task => {
          task.run(task.options);
        });
    };
  }
}
export default qunitModule;
