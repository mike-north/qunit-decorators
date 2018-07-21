import { getModuleMetadata } from '../module/module';

// tslint:disable ban-types
function skip<T>(
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> | void {
  let task = getModuleMetadata(target.constructor).testData.initTasks[propertyKey as string];
  task.options.skip = true;
  return descriptor;
}

export default skip;
