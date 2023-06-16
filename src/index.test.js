// ----------------------------------------------------------------------

function test_N() {
  // * _N) _D * //

  beforeEach();

  class _K extends _L {
  }

  const element = document.querySelector('.test');

  return new _K({ element });
}

// ------------------------------- Test ---------------------------------

function beforeEach() {
  document.body.innerHTML = '';
  const element = document.createElement('div');
  element.innerHTML = 'test';
  element.classList.add('test');
  element.classList.add('block');
  element.classList.add('my-view');
  document.body.append(element);
}

function test1() {
  // * 1) Block instantiates via element reference * //

  beforeEach();

  const element = document.querySelector('.test');

  return new Block({ element });
}

function test2() {
  // * 2) View instantiates via element reference * //

  beforeEach();

  class TestView extends View {
  }

  const element = document.querySelector('.test');

  return new TestView({ element });
}

function test3() {
  // * 3) Block instantiates via id * //

  beforeEach();

  const element = document.querySelector('.test');
  element.id = 'js-test-id';

  return new Block({ element: 'js-test-id' });
}

function test4() {
  // * 4) View instantiates via id * //

  beforeEach();

  class TestView extends View {
  }

  const element = document.querySelector('.test');
  element.id = 'js-test-id';

  return new TestView({ element: 'js-test-id' });
}

function test5() {
  // * 5) Block explicit name * //

  beforeEach();

  class MyBlock extends Block {
    static block = 'cool-two';
  }

  const element = document.querySelector('.test');

  return new MyBlock({ block: 'cool', element }).block; // "cool"
}

function test6() {
  // * 6) Block explicit constructor name * //

  beforeEach();

  class MyBlock extends Block {
    static block = 'cool-two';
  }

  const element = document.querySelector('.test');

  return new MyBlock({ element }).block; // "cool-two"
}

function test7() {
  // * 7) Block explicit constructor name inheritance * //

  beforeEach();

  class MyBlock extends Block {
    static block = 'cool-two';
  }

  class MyOtherBlock extends MyBlock {
    static block = 'my-other-block';
  }

  class MyImplicitOtherBlock extends MyBlock {
  }

  const element = document.querySelector('.test');

  const explicit = new MyOtherBlock({ element }).block;
  const implicit = new MyImplicitOtherBlock({ element }).block;

  return {
    explicit, // "my-other-block"
    implicit // "cool-two"
  };
}

function test8() {
  // * 8) Block implicit name * //

  beforeEach();

  class MyBlock extends Block {
  }

  const element = document.querySelector('.test');

  return new MyBlock({ element }).block; // "my-block"
}

function test9() {
  // * 9) Block implicit name inheritance * //

  beforeEach();

  class MyBlock extends Block {
  }

  class MyOtherBlock extends MyBlock {
  }

  const element = document.querySelector('.test');

  return new MyOtherBlock({ element }).block; // "my-other-block"
}

function test10() {
  // * 10) View explicit constructor name * //

  beforeEach();

  class MyView extends View {
    static block = 'cool-view';
  }

  const element = document.querySelector('.test');

  return new MyView({ element }).block; // "cool-view"
}

function test11() {
  // * 11) View explicit constructor name inheritance * //

  beforeEach();

  class MyView extends View {
    static block = 'cool-view';
  }

  class MyOtherView extends MyView {
    static block = 'my-other-view';
  }

  class MyImplicitOtherView extends MyView {
  }

  const element = document.querySelector('.test');

  const explicit =  new MyOtherView({ element }).block;
  const implicit = new MyImplicitOtherView({ element }).block;

  return {
    explicit, // "my-other-view"
    implicit // "cool-view"
  };
}

function test12() {
  // * 12) View implicit name * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  return new MyView({ element }).block; // "my-view"
}

function test13() {
  // * 13) View implicit name inheritance * //

  beforeEach();

  class MyView extends View {
  }

  class MyOtherView extends MyView {
  }

  const element = document.querySelector('.test');

  return new MyOtherView({ element }).block; // "my-other-view"
}

function test14() {
  // * 14) Block block getter * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ block: 'block-getter', element });

  return testBlock.block; // "block-getter"
}

function test15() {
  // * 15) View block getter * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  return myView.block; // "my-view"
}

function test16() {
  // * 16) Block element getter * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  return testBlock.element;
}

function test17() {
  // * 17) View element getter * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  return myView.element;
}

function test18() {
  // * 18) Block elem method * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  const results = {
    empty: testBlock.elem(), // "block__"
    noClassName: testBlock.elem('test'), // "block__test"
    yesClassName: testBlock.elem('test', true) // ".block__test"
  };

  return results;
}

function test19() {
  // * 19) View elem method * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  const results = {
    empty: myView.elem(), // "my-view__"
    noClassName: myView.elem('test'), // "my-view__test"
    yesClassName: myView.elem('test', true) // ".my-view__test"
  };

  return results;
}

function test20() {
  // * 20) Block getName method * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  return testBlock.getName(); // "block"
}

function test21() {
  // * 21) View getName method * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  return myView.getName(); // "my-view"
}

function test22() {
  // * 22) Block getParams method * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  return testBlock.getParams(); // {}
}

function test23() {
  // * 23) Block getParam method * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  const result = {
    empty: testBlock.getParam(), // undefined
    nonEmpty: testBlock.getParam('my-param'), // undefined
  };

  return result;
}

function test24() {
  // * 24) Block params getter * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  return testBlock.params; // {}
}

function test25() {
  // * 25) View getParams method * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  return myView.getParams(); // {}
}

function test26() {
  // * 26) View getParam method * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  const result = {
    empty: myView.getParam(), // undefined
    nonEmpty: myView.getParam('my-param') // undefined
  };

  return result;
}

function test27() {
  // * 27) View params getter * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  return myView.params; // {}
}

function test28() {
  // * 28) Block setParams method * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  testBlock.setParams({
    name: 'Tom',
    age: 12,
    cool: true,
    surname: undefined,
    whatever: null
  });

  const firstCase = {
    all: testBlock.getParams(),
    one: testBlock.getParam('name')
  };

  testBlock.setParams({
    one: 1,
    two: 2,
    three: null,
    four: undefined
  });

  const secondCase = {
    all: testBlock.getParams(),
    one: testBlock.getParam('one')
  };

  return {
    firstCase, // { all: { name: 'Tom', age: 12, cool: true, whatever: null }, one: 'Tom' }
    secondCase // { all: { one: 1, two: 2, three: null }, one: 1 }
  };
}

function test29() {
  // * 29) Block setParam method * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  testBlock.setParam('name', 'Tom2');

  const firstCase = {
    all: testBlock.getParams(),
    one: testBlock.getParam('name')
  };

  testBlock.setParam('age', 22);

  const secondCase = {
    all: testBlock.getParams(),
    one: testBlock.getParam('name')
  };

  return {
    firstCase, // { all: { name: 'Tom2' }, one: 'Tom2' }
    secondCase // { all: { name: 'Tom2', age: 22 }, one: 'Tom2' }
  };
}

function test30() {
  // * 30) View setParams method * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  myView.setParams({
    name: 'Tom',
    age: 12,
    cool: true,
    surname: undefined,
    whatever: null
  });

  const firstCase = {
    all: myView.getParams(),
    one: myView.getParam('name')
  };

  myView.setParams({
    one: 1,
    two: 2,
    three: null,
    four: undefined
  });

  const secondCase = {
    all: myView.getParams(),
    one: myView.getParam('one')
  };

  return {
    firstCase, // { all: { name: 'Tom', age: 12, cool: true, whatever: null }, one: 'Tom' }
    secondCase // { all: { one: 1, two: 2, three: null }, one: 1 }
  };
}

function test31() {
  // * 31) View setParam method * //

  class MyView extends View {
  }

  beforeEach();

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  myView.setParam('name', 'Tom2');

  const firstCase = {
    all: myView.getParams(),
    one: myView.getParam('name')
  };

  myView.setParam('age', 22);

  const secondCase = {
    all: myView.getParams(),
    one: myView.getParam('name')
  };

  return {
    firstCase, // { all: { name: 'Tom2' }, one: 'Tom2' }
    secondCase // { all: { name: 'Tom2', age: 22 }, one: 'Tom2' }
  };
}

function test32() {
  // * 32) Block getMods method * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  return testBlock.getMods(); // {}
}

function test33() {
  // * 33) Block getMod method * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  const result = {
    empty: testBlock.getMod(),
    nonEmpty: testBlock.getMod('my-mod'),
  };

  return result; // { empty: undefined, nonEmpty: undefined }
}

function test34() {
  // * 34) View getMods method * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  return myView.getMods(); // {}
}

function test35() {
  // * 35) View getMod method * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  const result = {
    empty: myView.getMod(),
    nonEmpty: myView.getMod('my-mod'),
  };

  return result; // { empty: undefined, nonEmpty: undefined }
}

function test36() {
  // * 36) Block setMods method * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  testBlock.setMods({
    open: 'yes',
    expanded: true,
    size: 12,
    zero: 0,
    empty: '',
    destructing: false,
    empty: undefined,
    whatever: null
  });

  const firstCase = {
    all: testBlock.getMods(),
    one: testBlock.getMod('open'),
    clsCheck: testBlock.cls() === testBlock.element.classList.toString()
  };

  testBlock.setMods({
    open: false,
    visible: true,
    size: 'xs'
  });

  const secondCase = {
    all: testBlock.getMods(),
    one: testBlock.getMod('visible'),
    another: testBlock.getMod('open'),
    cls: testBlock.element.classList.toString(),
    clsCheck: testBlock.cls() === testBlock.element.classList.toString()
  };

  return {
    firstCase, // { all: { open: 'yes', expanded: true, size: '12', zero: '0' }, one: 'yes', cls: 'test block my-view block_open_yes block_expanded block_size_12 block_zero_0' }
    secondCase // { all: { size: 'xs', visible: true }, one: true, another: undefined, cls: 'test block my-view block_visible block_size_xs' }
  };
}

function test37() {
  // * 37) Block setMod method * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  testBlock.setMod('open');
  testBlock.setMod('visible', true);
  testBlock.setMod('size', 'xs');
  testBlock.setMod('zero', 0);
  testBlock.setMod('empty', '');

  const firstCase = {
    all: testBlock.getMods(),
    one: testBlock.getMod('size'),
    cls: testBlock.element.className.toString(),
    clsCheck: testBlock.cls() === testBlock.element.classList.toString()
  };

  testBlock.setMod('open', undefined);
  testBlock.setMod('visible', false);
  testBlock.setMod('size', 0);
  testBlock.setMod('zero', null);

  const secondCase = {
    all: testBlock.getMods(),
    one: testBlock.getMod('size'),
    cls: testBlock.element.className.toString(),
    clsCheck: testBlock.cls() === testBlock.element.classList.toString()
  };

  return {
    firstCase, // { all: { open: true, visible: true, size: 'xs', zero: '0' }, one: 'xs' }
    secondCase // { all: { size: '0' }, one: '0' }
  };
}

function test38() {
  // * 38) View setMods method * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  myView.setMods({
    open: 'yes',
    expanded: true,
    size: 12,
    zero: 0,
    empty: '',
    destructing: false,
    empty: undefined,
    whatever: null
  });

  const firstCase = {
    all: myView.getMods(),
    one: myView.getMod('open'),
    cls: myView.element.classList.toString(),
    clsCheck: myView.cls() === myView.element.classList.toString()
  };

  myView.setMods({
    open: false,
    visible: true,
    size: 'xs'
  });

  const secondCase = {
    all: myView.getMods(),
    one: myView.getMod('visible'),
    another: myView.getMod('open'),
    cls: myView.element.classList.toString(),
    clsCheck: myView.cls() === myView.element.classList.toString()
  };

  return {
    firstCase, // { all: { open: 'yes', expanded: true, size: '12', zero: '0' }, one: 'yes', cls: 'test block my-view my-view_open_yes my-view_expanded my-view_size_12 my-view_zero_0' }
    secondCase // { all: { size: 'xs', visible: true }, one: true, another: undefined, cls: 'test block my-view my-view_visible my-view_size_xs' }
  };
}

function test39() {
  // * 39) View setMod method * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  myView.setMod('open');
  myView.setMod('visible', true);
  myView.setMod('size', 'xs');
  myView.setMod('zero', 0);
  myView.setMod('empty', '');

  const firstCase = {
    all: myView.getMods(),
    one: myView.getMod('size'),
    cls: myView.element.className.toString(),
    clsCheck: myView.cls() === myView.element.classList.toString()
  };

  myView.setMod('open', undefined);
  myView.setMod('visible', false);
  myView.setMod('size', 0);
  myView.setMod('zero', null);

  const secondCase = {
    all: myView.getMods(),
    one: myView.getMod('size'),
    cls: myView.element.className.toString(),
    clsCheck: myView.cls() === myView.element.classList.toString()
  };

  return {
    firstCase, // { all: { open: true, visible: true, size: 'xs', zero: '0' }, one: 'xs' }
    secondCase // { all: { size: '0' }, one: '0' }
  };
}

function test40() {
  // * 40) Block toggleMod method * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  testBlock.toggleMod('open');
  testBlock.toggleMod('closed', null);
  testBlock.toggleMod('empty', '');

  const firstCase = testBlock.getMods();

  testBlock.toggleMod('open');
  testBlock.toggleMod('closed', undefined);
  testBlock.toggleMod('empty', '');

  const secondCase = testBlock.getMods();

  testBlock.toggleMod('open', 'yes');
  testBlock.toggleMod('closed', 0);

  const thirdCase = testBlock.getMods();

  return {
    firstCase, // { open: true }
    secondCase, // {}
    thirdCase, // { open: 'yes', closed: '0' }
    cls: testBlock.element.classList.toString(),
    clsCheck: testBlock.cls() === testBlock.element.classList.toString()
  };
}

function test41() {
  // * 41) View toggleMod method * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  myView.toggleMod('open');
  myView.toggleMod('closed', null);
  myView.toggleMod('empty', '');

  const firstCase = myView.getMods();

  myView.toggleMod('open');
  myView.toggleMod('closed', undefined);
  myView.toggleMod('empty', '');

  const secondCase = myView.getMods();

  myView.toggleMod('open', 'yes');
  myView.toggleMod('closed', 0);

  const thirdCase = myView.getMods();

  return {
    firstCase, // { open: true }
    secondCase, // {}
    thirdCase, // { open: 'yes', closed: '0' }
    cls: myView.element.classList.toString(),
    clsCheck: myView.cls() === myView.element.classList.toString()
  };
}

function test42() {
  // * 42) View getElemMods method * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  element.innerHTML = '<span class="my-view__title">content</span>';

  const myView = new MyView({ element });

  return {
    mods: myView.getElemMods('title'), // {}
    cls: myView.find('title').element.classList.toString(),
    clsCheck: myView.find('title').cls() === myView.find('title').element.classList.toString()
  }
}

function test43() {
  // * 43) View getElemMod method * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  element.innerHTML = '<span class="my-view__title">content</span>';

  const myView = new MyView({ element });

  const result = {
    empty: myView.getElemMod('title'),
    nonEmpty: myView.getElemMod('title', 'size'),
    cls: myView.find('title').element.classList.toString(),
    clsCheck: myView.find('title').cls() === myView.find('title').element.classList.toString()
  };

  return result; // { empty: undefined, nonEmpty: undefined }
}

function test44() {
  // * 44) View setElemMods method * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  element.innerHTML = '<span class="my-view__title">content</span>';

  const myView = new MyView({ element });

  myView.setElemMods('title', {
    open: 'yes',
    expanded: true,
    size: 12,
    zero: 0,
    empty: '',
    destructing: false,
    empty: undefined,
    whatever: null
  });

  const firstCase = {
    all: myView.getElemMods('title'),
    one: myView.getElemMod('title', 'open'),
    cls: myView.find('title').element.classList.toString(),
    clsCheck: myView.find('title').cls() === myView.find('title').element.classList.toString()
  };

  myView.setElemMods('title', {
    open: false,
    visible: true,
    size: 'xs'
  });

  const secondCase = {
    all: myView.getElemMods('title'),
    one: myView.getElemMod('title', 'visible'),
    another: myView.getElemMod('title', 'open'),
    cls: myView.find('title').element.classList.toString(),
    clsCheck: myView.find('title').cls() === myView.find('title').element.classList.toString()
  };

  return {
    firstCase, // { all: { open: 'yes', expanded: true, size: '12', zero: '0' }, one: 'yes' }
    secondCase // { all: { size: 'xs', visible: true }, one: true, another: undefined }
  };
}

function test45() {
  // * 45) View setElemMod method * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  element.innerHTML = '<span class="my-view__title">content</span>';

  const myView = new MyView({ element });

  myView.setElemMod('title', 'open');
  myView.setElemMod('title', 'visible', true);
  myView.setElemMod('title', 'size', 'xs');
  myView.setElemMod('title', 'zero', 0);
  myView.setElemMod('title', 'empty', '');

  const firstCase = {
    all: myView.getElemMods('title'),
    one: myView.getElemMod('title', 'size'),
    cls: myView.find('title').element.classList.toString(),
    clsCheck: myView.find('title').cls() === myView.find('title').element.classList.toString()
  };

  myView.setElemMod('title', 'size', null);
  myView.setElemMod('title', 'zero', false);

  const secondCase = {
    all: myView.getElemMods('title'),
    one: myView.getElemMod('title', 'open'),
    cls: myView.find('title').element.classList.toString(),
    clsCheck: myView.find('title').cls() === myView.find('title').element.classList.toString()
  };

  return {
    firstCase, // { all: { open: true, visible: true, size: 'xs', zero: '0' }, one: 'xs' }
    secondCase // { all: { open: true, visible: true }, one: true }
  };
}

function test46() {
  // * 46) View toggleElemMod method * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  element.innerHTML = '<span class="my-view__title">content</span>';

  const myView = new MyView({ element });

  myView.toggleElemMod('title', 'open');
  myView.toggleElemMod('title', 'empty', '');

  const firstCase = myView.getElemMod('title', 'open');

  myView.toggleElemMod('title', 'open');
  myView.toggleElemMod('title', 'empty', '');

  const secondCase = myView.getElemMod('title', 'open');

  myView.toggleElemMod('title', 'open', 'yes');

  const thirdCase = myView.getElemMod('title', 'open');

  return {
    firstCase, // true
    secondCase, // undefined
    thirdCase // "yes"
  };
}

function test47() {
  // * 47) View triggers onSetMod * //

  beforeEach();

  class MyView extends View {
    static block = 'my-view';

    constructor(options) {
      super(options);

      this.onSetMod = {
        visible: function(value) {
          console.log('triggered visible', { value, current: this.getMod('visible') });
        }
      };
    }
  }

  class MyOtherView extends MyView {
    constructor(options) {
      super(options);

      this.onSetMod = {
        open: function(value) {
          console.log('triggered open', { value, current: this.getMod('open') });
        }
      };
    }
  }

  const element = document.querySelector('.test');

  const myOtherView = new MyOtherView({ element });

  myOtherView.setMods({ visible: '1', open: '1' });
  myOtherView.setMod('visible', 2);
  myOtherView.setMod('open', 2);
  myOtherView.toggleMod('visible');
  myOtherView.toggleMod('visible');
  myOtherView.toggleMod('open');
  myOtherView.toggleMod('open');

  /**
    * triggered visible { value: 1, current: undefined }
    * triggered open { value: 1, current: undefined }
    * triggered visible { value: 2, current: '1' }
    * triggered open { value: 2, current: '1' }
    * triggered visible { value: false, current: '2' }
    * triggered visible { value: true, current: undefined }
    * triggered open { value: false, current: '2' }
    * triggered open { value: true, current: undefined }
   */
}

function test48() {
  // * 48) Block removes element and unbinds from it * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  testBlock.on('click', () => {
    console.log('block click');
  });

  testBlock.once('click', () => {
    console.log('block once click');
  });

  testBlock.on('click', () => {
    console.log('block bound click');
  }, {});

  testBlock.once('click', () => {
    console.log('block once bound click');
  }, {});

  testBlock.remove();

  return testBlock; // check map and element
}

function test49() {
  // * 49) View removes element and unbinds from it * //

  beforeEach();

  class MyView extends View {
    constructor(options) {
      super(options);

      this.element.innerHTML = `
        <span class="${this.elem('title')}">
          content
        </span>

        ${[1, 2].map(() => (`
            <span class="${this.elem('item')}">
              item content
            </span>
        `))}
      `;

      this.on('click', () => {
        console.log('view click');
      });

      this.on('title', 'click', () => {
        console.log('view title click');
      });

      this.once('click', () => {
        console.log('view once click');
      });

      this.once('title', 'click', () => {
        console.log('view title once click');
      });

      this.delegate('item', 'click', () => {
        console.log('view item delegate click');
      });
    }
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  myView.remove();

  return myView; // check map and element
}

function test50() {
  // * 50) View removes and unbinds blocks * //

  beforeEach();

  class MyView extends View {
    constructor(options) {
      super(options);

      this.element.innerHTML = `
        <span class="${this.elem('title')}">
          content
        </span>

        ${[1, 2].map(() => (`
            <span class="${this.elem('item')}">
              item content
            </span>
        `))}
      `;

      this.on('click', () => {
        console.log('view click');
      });

      this.on('title', 'click', () => {
        console.log('view title click');
      });

      this.once('click', () => {
        console.log('view once click');
      });

      this.once('title', 'click', () => {
        console.log('view title once click');
      });

      this.delegate('item', 'click', () => {
        console.log('view item delegate click');
      });
    }
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  myView.remove('title');

  return myView; // check map and element
}

function test51() {
  // * 51) View doesn't cause memory leaks * //

  // * WARN: inspect via devtools and WeakSet here is the flow:
  //   create window.TESTSET = new WeakSet(); and in Block constructor do window.TESTSET.add(this);
  //   let v = test47();
  //   check should have references
  //   TESTSET;
  //   click garbage collect and wait a second
  //   check should have no references
  //   TESTSET;
  //   v.remove();
  //   v = undefined;
  //   click garbage collect and wait a second
  //   check should have no references
  //   TESTSET;

  beforeEach();

  class MyView extends View {
    constructor(options) {
      super(options);
      this.element.innerHTML = '<span class="my-view__title">content</span>';
    }
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  myView.find('title');
  myView.find('title');
  myView.find('title');
  myView.find('title').on('click', () => {});
  myView.find('title').on('click', () => {});
  myView.find('title').on('click', () => {});

  return myView;
}

function test52() {
  // * 52) View elemify method * //

  beforeEach();

  class MyView extends View {
    constructor(options) {
      super(options);
      this.element.innerHTML = '<span class="my-view__title">content</span>';
    }
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  const empty = myView.elemify();
  const firstCase = myView.elemify(element);
  const secondCase = myView.elemify('title');
  const thirdCase = myView.elemify(new Block({ element }));

  const result = {
    empty,
    firstCase,
    secondCase,
    thirdCase,
    instanceCheck: [firstCase, thirdCase].every(
      (value) => value instanceof Block && value.element === element
    )
  }

  return result; // { empty: null, firstCase: element, secondCase: null, thirdCase: element, instanceCheck: true }
}

function test53() {
  // * 53) View find method * //

  beforeEach();

  class MyView extends View {
    constructor(options) {
      super(options);

      this.element.innerHTML = `
        <span class="${this.elem('title')}">
          content
        </span>

        ${[1, 2].map(() => (`
            <span class="${this.elem('item')}">
              item content
            </span>
        `))}

        <span class="${
            this.elem('item')
          } ${
            `${this.elem('item')}_hidden`
          }"
        >
          item content hidden
        </span>
      `;
    }
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  const result = {
    empty: myView.find(),
    title: myView.find('title'),
    item: myView.find('item'),
    itemFound: myView.find(myView.find('item')),
    itemFoundElement: myView.find(myView.find('item').element),
    specialItem: myView.find('item', { hidden: true })
  };

  return result; // { empty: element, title: title, item: item, itemFound: item, itemFoundElement: item, specialItem: hidden item }
}

function test54() {
  // * 54) View findAll method * //

  beforeEach();

  class MyView extends View {
    constructor(options) {
      super(options);

      this.element.innerHTML = `
        <span class="${this.elem('title')}">
          content
        </span>

        ${[1, 2].map(() => (`
            <span class="${this.elem('item')}">
              item content
            </span>
        `))}

        ${[1, 2].map(() => (`
          <span class="${
              this.elem('item')
            } ${
              `${this.elem('item')}_hidden`
            }"
          >
            item content hidden
          </span>
        `))}
      `;
    }
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  const result = {
    empty: myView.findAll(),
    titles: myView.findAll('title'),
    items: myView.findAll('item'),
    specialItems: myView.findAll('item', { hidden: true })
  };

  return result; // { empty: [], titles: [title], items: [...item x2 + ...hidden item x2], specialItems: [hidden item x2] }
}

function test55() {
  // * 55) View findOn method * //

  beforeEach();

  class MyView extends View {
    constructor(options) {
      super(options);
      this.element.innerHTML = `
        <span class="${this.elem('title')}">
          <span class="${this.elem('content')}">
            content
          </span>
        </span>
      `;
    }
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  const title = myView.find('title');
  const content = myView.find('content');

  const result = {
    title: myView.findOn(content, 'title'),
    content: myView.findOn(title, 'content')
  };

  return result;
}

function test56() {
  // * 56) Block on method * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  function boundClick(event) {
    console.log('block bound click', { event, context: this });
  }

  testBlock.on('click', function(event) {
    console.log('block click', { event, context: this  });
  });

  testBlock.on('click', (event) => {
    console.log('block arrow click', { event, context: this  });
  });

  testBlock.on('click', boundClick, { testContext: true });

  return testBlock;
}

function test57() {
  // * 57) Block off method * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  const handleClick = (target, event) => {
    console.log('block click', { target, event });
  };

  testBlock.on('click', handleClick);

  testBlock.off('click', handleClick);

  return testBlock;
}

function test58() {
  // * 58) View on method * //

  beforeEach();

  class MyView extends View {
    constructor(options) {
      super(options);
      this.on('click', this.onClick);
    }

    onClick(event) {
      console.log('view click', { event, context: this });
    }
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  return myView;
}

function test59() {
  // * 59) View off method * //

  beforeEach();

  class MyView extends View {
    constructor(options) {
      super(options);
      this.on('click', this.onClick);
      this.off('click', this.onClick);
    }

    onClick(event) {
      console.log('view click', { event, context: this });
    }
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  return myView;
}

function test60() {
  // * 60) View on elem method * //

  beforeEach();

  class MyView extends View {
    constructor(options) {
      super(options);

      this.element.innerHTML += `<br /><span class="${this.elem('title')}">content</span>`;

      this.on('title', 'click', this.onClick);
    }

    onClick(event) {
      console.log('view elem click', { event, context: this });
    }
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  return myView;
}

function test61() {
  // * 61) View off elem method * //

  beforeEach();

  class MyView extends View {
    constructor(options) {
      super(options);

      this.element.innerHTML += `<br /><span class="${this.elem('title')}">content</span>`;

      this.on('title', 'click', this.onClick);
      this.off('title', 'click', this.onClick);
    }

    onClick(event) {
      console.log('view elem click', { event, context: this });
    }
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  return myView;
}

function test62() {
  // * 62) View delegate method * //

  beforeEach();

  class MyView extends View {
    constructor(options) {
      super(options);

      this.element.innerHTML = `
        <span class="${this.elem('title')}">
          content
        </span>

        ${[1, 2].map(() => (`
            <span class="${this.elem('item')}">
              item content
            </span>
        `))}

        ${[1, 2].map(() => (`
          <span class="${
              this.elem('item')
            } ${
              `${this.elem('item')}_hidden`
            }"
          >
            item content hidden
          </span>
        `))}
      `;

      this.delegate('item', 'click', this.onItemClick);
    }

    onItemClick(item, event) {
      console.log('item delegated clicked', {
        target: item,
        event,
        context: this,
        hidden: item.getMod('hidden')
      });
    }
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  return myView;
}

function test63() {
  // * 63) Block trigger method * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  testBlock.on('my-event', (event) => {
    console.log('my-event', { event, detail: event.detail, context: this });
  });

  testBlock.trigger('my-event', { name: 'Tom', age: 12 });

  return testBlock;
}

function test64() {
  // * 64) View trigger method * //

  beforeEach();

  class MyView extends View {
    constructor(options) {
      super(options);

      this.element.innerHTML = `
        <span class="${this.elem('title')}">
          content
        </span>

        ${[1, 2].map(() => (`
            <span class="${this.elem('item')}">
              item content
            </span>
        `))}

        ${[1, 2].map(() => (`
          <span class="${
              this.elem('item')
            } ${
              `${this.elem('item')}_hidden`
            }"
          >
            item content hidden
          </span>
        `))}
      `;

      this.on('my-event', this.blockListener);
      this.on('title', 'my-event', this.elemListener);
      this.delegate('item', 'my-event', this.delegatedListener);
    }

    blockListener(event) {
      console.log('blockListener', { event, detail: event.detail, context: this });
    }

    elemListener(event) {
      console.log('elemListener', { event, detail: event.detail, context: this });
    }

    delegatedListener(target, event) {
      console.log('delegatedListener', { target, event, detail: event.detail, context: this });
    }
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });
  const title = myView.find('title');
  const item = myView.find('item', { hidden: true });

  /*
    blockListener view-dispatch
    elemListener view-elem-dispatch
    blockListener view-elem-dispatch
    elemListener block-dispatch
    blockListener block-dispatch
    blockListener view-elem-dispatch-2
    delegatedListener view-elem-dispatch-2
    blockListener block-dispatch-2
    delegatedListener block-dispatch-2
  */

  myView.trigger('my-event', { type: 'view-dispatch' });
  myView.trigger('title', 'my-event', { type: 'view-elem-dispatch' });
  title.trigger('my-event', { type: 'block-dispatch' });
  myView.trigger('item', 'my-event', { type: 'view-elem-dispatch-2' });
  item.trigger('my-event', { type: 'block-dispatch-2' });

  return myView;
}

function test65() {
  // * 65) Block once method * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  testBlock.once('click', (event) => {
    console.log('clicked block once', { event, context: this });
  });

  testBlock.once('click', (event) => {
    console.log('clicked block once with error', { event, context: this });
    throw new Error('test error');
  });

  return testBlock;
}

function test66() {
  // * 66) View once method * //

  beforeEach();

  class MyView extends View {
    constructor(options) {
      super(options);

      this.element.innerHTML += `<br /><span class="${this.elem('title')}">content</span>`;

      this.once('click', (event) => {
        console.log('clicked view once', { event, context: this });
      });

      this.once('click', (event) => {
        console.log('clicked view once with error', { event, context: this });
        throw new Error('test error');
      });

      this.once('title', 'click', (event) => {
        console.log('clicked view title once', { event, context: this });
      });

      this.once('title', 'click', (event) => {
        console.log('clicked view title once with error', { event, context: this });
        throw new Error('test error');
      });
    }
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  return myView;
}

function test67() {
  // * 67) Block on context * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  const customContext = { name: 'Tom', age: 12 };

  testBlock.on('click', function(event) {
    console.log('on handler', {
      event,
      context: this,
      check: this === testBlock
    });
  });

  testBlock.once('click', function(event) {
    console.log('once handler', {
      event,
      context: this,
      check: this === testBlock
    });
  });

  testBlock.on('click', function(event) {
    console.log('on handler custom context', {
      event,
      context: this,
      check: this === customContext
    });
  }, customContext);

  testBlock.once('click', function(event) {
    console.log('once handler custom context', {
      event,
      context: this,
      check: this === customContext
    });
  }, customContext);

  return testBlock;
}

function test68() {
  // * 68) View on context * //

  beforeEach();

  const element = document.querySelector('.test');

  class MyView extends View {
    constructor(options) {
      super(options);

      this.element.innerHTML += `<br /><span class="${this.elem('title')}">content</span>`;

      this.on('click', function(event) {
        console.log('on handler', {
          event,
          context: this,
          check: this === myView
        });
      });

      this.once('click', function(event) {
        console.log('once handler', {
          event,
          context: this,
          check: this === myView
        });
      });

      this.on('title', 'click', function(event) {
        console.log('on elem handler', {
          event,
          context: this,
          check: this === myView
        });
      });

      this.once('title', 'click', function(event) {
        console.log('once elem handler', {
          event,
          context: this,
          check: this === myView
        });
      });

      this.delegate('title', 'click', function(target, event) {
        console.log('delegate handler', {
          target,
          event,
          context: this,
          check: this === myView
        });
      });
    }
  }

  const myView = new MyView({ element });

  return myView;
}

// ----------------------------------------------------------------------
