import { getModuleMetadata } from '../module/module';

// tslint:disable ban-types
function todo<T>(
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> | void {
    // test
    let task = getModuleMetadata(target.constructor).testData.initTasks[propertyKey as string];
    task.options.todo = true;
    return descriptor;
}

export default todo;
