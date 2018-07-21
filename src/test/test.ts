import { addInitTask, getModuleMetadata } from '../module/module';

// tslint:disable ban-types

/**
 * declare type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;
 * declare type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void;
 * declare type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;
 * declare type ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
 */

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
  _descriptor?: TypedPropertyDescriptor<T>
): MethodDecorator | TypedPropertyDescriptor<T> | void {
  if (typeof nameOrTarget !== 'string' && propertyKey) {
    const target = nameOrTarget as any;
    const fn = target[propertyKey];
    const name = fn.name;
    addInitTask(target.constructor, name, (opts) => {
      console.log(name, opts);
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
  } else {
    const name = nameOrTarget as string;
    return (
      target: any,
      key: string | symbol,
      _desc: TypedPropertyDescriptor<any>
    ) => {
      const fn = target[key];
      addInitTask(target.constructor, fn.name, (opts) => {
        console.log(fn.name, opts);
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
    };
  }
}

export default test;
