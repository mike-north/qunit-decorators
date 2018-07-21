import { getModuleMetadata } from '../module/module';

// tslint:disable ban-types
function only<T>(
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> | void {
    // test
    let task = getModuleMetadata(target.constructor).testData.initTasks[propertyKey as string];
    task.options.only = true;
    return descriptor;
}

export default only;
