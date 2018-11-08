import { suite, test } from 'qunit-decorators';

class Base {
  reverse(raw: string) {
    return [...raw].reverse().join('');
  }
}

@suite('Testing context tests', hks => {
  hks.before(function(this: any) {
    this.started = 'yes';
  });
})
class ContextTests extends Base {
  foo = 'valueOfFoo';

  capitalize(raw: string) {
    if (raw.length < 2) return raw.toUpperCase();
    return [raw[0].toUpperCase(), raw.substr(1)].join('');
  }

  @test
  memberDataOnClass(a: Assert) {
    a.equal(this.foo, 'valueOfFoo');
    a.equal(this.capitalize(this.foo), 'ValueOfFoo');
    a.equal(this.reverse(this.capitalize(this.foo)), 'ooFfOeulaV');
  }

  @test
  dataFromHooks(a: Assert) {
    a.equal((this as any).started, 'yes');
  }
}
