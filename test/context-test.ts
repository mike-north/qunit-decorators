import { suite, test } from 'qunit-decorators';

@suite('Testing context tests', hks => {
  hks.before(function(this: any) {
    this.started = 'yes';
  });
})
class ContextTests {
  foo = 'valueOfFoo';
  @test
  memberDataOnClass(a: Assert) {
    a.equal(this.foo, 'valueOfFoo');
  }

  @test
  dataFromHooks(a: Assert) {
    a.equal((this as any).started, 'yes');
  }
}
