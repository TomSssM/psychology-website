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

  return new MyBlock({ block: 'cool', element });
}

function test6() {
  // * 6) Block explicit constructor name * //

  beforeEach();

  class MyBlock extends Block {
    static block = 'cool-two';
  }

  const element = document.querySelector('.test');

  return new MyBlock({ element });
}

function test7() {
  // * 7) Block implicit name * //

  beforeEach();

  class MyBlock extends Block {
  }

  const element = document.querySelector('.test');

  return new MyBlock({ element });
}

function test8() {
  // * 8) View explicit constructor name * //

  beforeEach();

  class MyView extends View {
    static block = 'cool-view';
  }

  const element = document.querySelector('.test');

  return new MyView({ element });
}

function test9() {
  // * 9) View implicit name * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  return new MyView({ element });
}

function test10() {
  // * 10) Block block getter * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ block: 'block-getter', element });

  return testBlock.block;
}

function test11() {
  // * 11) View block getter * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  return myView.block;
}

function test12() {
  // * 12) Block element getter * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  return testBlock.element;
}

function test13() {
  // * 13) View element getter * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  return myView.element;
}

function test14() {
  // * 14) Block elem method * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  const results = {
    empty: testBlock.elem(),
    noClassName: testBlock.elem('test'),
    yesClassName: testBlock.elem('test', true)
  };

  return results;
}

function test15() {
  // * 15) View elem method * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  const results = {
    empty: myView.elem(),
    noClassName: myView.elem('test'),
    yesClassName: myView.elem('test', true)
  };

  return results;
}

function test16() {
  // * 16) Block getName method * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  return testBlock.getName();
}

function test17() {
  // * 17) View getName method * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  return myView.getName();
}

function test18() {
  // * 18) Block getParams method * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  return testBlock.getParams();
}

function test19() {
  // * 19) Block getParam method * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  const result = {
    empty: testBlock.getParam(),
    nonEmpty: testBlock.getParam('my-param'),
  };

  return result;
}

function test20() {
  // * 20) Block params getter * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  return testBlock.params;
}

function test21() {
  // * 21) View getParams method * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  return myView.getParams();
}

function test22() {
  // * 22) View getParam method * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  const result = {
    empty: myView.getParam(),
    nonEmpty: myView.getParam('my-param'),
  };

  return result;
}

function test23() {
  // * 23) View params getter * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  return myView.params;
}

function test24() {
  // * 24) Block setParams method * //

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
    two: 2
  });

  const secondCase = {
    all: testBlock.getParams(),
    one: testBlock.getParam('one')
  };

  return { firstCase, secondCase };
}

function test25() {
  // * 25) Block setParam method * //

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

  return { firstCase, secondCase };
}

function test26() {
  // * 26) View setParams method * //

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
    two: 2
  });

  const secondCase = {
    all: myView.getParams(),
    one: myView.getParam('one')
  };

  return { firstCase, secondCase };
}

function test27() {
  // * 27) View setParam method * //

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

  return { firstCase, secondCase };
}

function test28() {
  // * 28) Block getMods method * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  return testBlock.getMods();
}

function test29() {
  // * 29) Block getMod method * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  const result = {
    empty: testBlock.getMod(),
    nonEmpty: testBlock.getMod('my-mod'),
  };

  return result;
}

function test30() {
  // * 30) View getMods method * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  return myView.getMods();
}

function test31() {
  // * 31) View getMod method * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  const result = {
    empty: myView.getMod(),
    nonEmpty: myView.getMod('my-mod'),
  };

  return result;
}

function test32() {
  // * 32) Block setMods method * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  testBlock.setMods({
    open: 'yes',
    expanded: true,
    size: 12,
    destructing: false,
    empty: undefined,
    whatever: null
  });

  const firstCase = {
    all: testBlock.getMods(),
    one: testBlock.getMod('open')
  };

  testBlock.setMods({
    open: false,
    visible: true,
    size: 'xs'
  });

  const secondCase = {
    all: testBlock.getMods(),
    one: testBlock.getMod('visible'),
    another: testBlock.getMod('open')
  };

  return { firstCase, secondCase };
}

function test33() {
  // * 33) Block setMod method * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  testBlock.setMod('open');
  testBlock.setMod('visible', true);
  testBlock.setMod('size', 'xs');

  const firstCase = {
    all: testBlock.getMods(),
    one: testBlock.getMod('size')
  };

  testBlock.setMod('size', null);

  const secondCase = {
    all: testBlock.getMods(),
    one: testBlock.getMod('size')
  };

  return { firstCase, secondCase };
}

function test34() {
  // * 34) View setMods method * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  myView.setMods({
    open: 'yes',
    expanded: true,
    size: 12,
    destructing: false,
    empty: undefined,
    whatever: null
  });

  const firstCase = {
    all: myView.getMods(),
    one: myView.getMod('open')
  };

  myView.setMods({
    open: false,
    visible: true,
    size: 'xs'
  });

  const secondCase = {
    all: myView.getMods(),
    one: myView.getMod('visible'),
    another: myView.getMod('open')
  };

  return { firstCase, secondCase };
}

function test35() {
  // * 35) View setMod method * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  myView.setMod('open');
  myView.setMod('visible', true);
  myView.setMod('size', 'xs');

  const firstCase = {
    all: myView.getMods(),
    one: myView.getMod('size')
  };

  myView.setMod('size', null);

  const secondCase = {
    all: myView.getMods(),
    one: myView.getMod('size')
  };

  return { firstCase, secondCase };
}

function test36() {
  // * 36) Block toggleMod method * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  testBlock.toggleMod('open');

  const firstCase = testBlock.getMod('open');

  testBlock.toggleMod('open');

  const secondCase = testBlock.getMod('open');

  testBlock.toggleMod('open', 'yes');

  const thirdCase = testBlock.getMod('open');

  return { firstCase, secondCase, thirdCase };
}

function test37() {
  // * 37) View toggleMod method * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  myView.toggleMod('open');

  const firstCase = myView.getMod('open');

  myView.toggleMod('open');

  const secondCase = myView.getMod('open');

  myView.toggleMod('open', 'yes');

  const thirdCase = myView.getMod('open');

  return { firstCase, secondCase, thirdCase };
}

function test38() {
  // * 38) View getElemMods method * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  return myView.getElemMods('title');
}

function test39() {
  // * 39) View getElemMod method * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  const result = {
    empty: myView.getElemMod('title'),
    nonEmpty: myView.getElemMod('title', 'size')
  };

  return result;
}

function test40() {
  // * 40) View setElemMods method * //

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
    destructing: false,
    empty: undefined,
    whatever: null
  });

  const firstCase = {
    all: myView.getElemMods('title'),
    one: myView.getElemMod('title', 'open')
  };

  myView.setElemMods('title', {
    open: false,
    visible: true,
    size: 'xs'
  });

  const secondCase = {
    all: myView.getElemMods('title'),
    one: myView.getElemMod('title', 'visible'),
    another: myView.getElemMod('title', 'open')
  };

  return { firstCase, secondCase };
}

function test41() {
  // * 41) View setElemMod method * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  element.innerHTML = '<span class="my-view__title">content</span>';

  const myView = new MyView({ element });

  myView.setElemMod('title', 'open');
  myView.setElemMod('title', 'visible', true);
  myView.setElemMod('title', 'size', 'xs');

  const firstCase = {
    all: myView.getElemMods('title'),
    one: myView.getElemMod('title', 'size')
  };

  myView.setElemMod('title', 'size', null);

  const secondCase = {
    all: myView.getElemMods('title'),
    one: myView.getElemMod('title', 'size')
  };

  return { firstCase, secondCase };
}

function test42() {
  // * 42) View toggleElemMod method * //

  beforeEach();

  class MyView extends View {
  }

  const element = document.querySelector('.test');

  element.innerHTML = '<span class="my-view__title">content</span>';

  const myView = new MyView({ element });

  myView.toggleElemMod('title', 'open');

  const firstCase = myView.getElemMod('title', 'open');

  myView.toggleElemMod('title', 'open');

  const secondCase = myView.getElemMod('title', 'open');

  myView.toggleElemMod('title', 'open', 'yes');

  const thirdCase = myView.getElemMod('title', 'open');

  return { firstCase, secondCase, thirdCase };
}

function test43() {
  // * 43) View triggers onSetMod * //

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

  myOtherView.setMods({ visible: '1', open: '2' });
  myOtherView.setMod('visible', 2);
  myOtherView.setMod('open', 2);
  myOtherView.toggleMod('visible');
  myOtherView.toggleMod('visible');
  myOtherView.toggleMod('open');
  myOtherView.toggleMod('open');
}

function test44() {
  // * 44) Block removes element and unbinds from it * //

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

  return testBlock;
}

function test45() {
  // * 45) View removes element and unbinds from it * //

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

  return myView;
}

function test46() {
  // * 46) View removes and unbinds blocks * //

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

  return myView;
}

function test47() {
  // * 47) View doesn't cause memory leaks * //

  // * WARN: add every instance of new Block to WeakSet and inspect

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
}

function test48() {
  // * 48) View elemify method * //

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
    instanceCheck: [firstCase, secondCase, thirdCase].every(
      (value) => value instanceof Block
    )
  }

  return result;
}

function test49() {
  // * 49) View find method * //

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

  return result;
}

function test50() {
  // * 50) View findAll method * //

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

  return result;
}

function test51() {
  // * 51) View findOn method * //

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

function test52() {
  // * 52) Block on method * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  function boundClick(target, event) {
    console.log('block bound click', { target, event });
  }

  testBlock.on('click', (target, event) => {
    console.log('block click', { target, event });
  });

  testBlock.on('click', boundClick, testBlock);

  return testBlock;
}

function test53() {
  // * 53) Block off method * //

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

function test54() {
  // * 54) View on method * //

  beforeEach();

  class MyView extends View {
    constructor(options) {
      super(options);
      this.on('click', this.onClick);
    }

    onClick(target, event) {
      console.log('view click', { target, event });
    }
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  return myView;
}

function test55() {
  // * 55) View off method * //

  beforeEach();

  class MyView extends View {
    constructor(options) {
      super(options);
      this.on('click', this.onClick);
      this.off('click', this.onClick);
    }

    onClick(target, event) {
      console.log('view click', { target, event });
    }
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  return myView;
}

function test56() {
  // * 56) View on elem method * //

  beforeEach();

  class MyView extends View {
    constructor(options) {
      super(options);

      this.element.innerHTML = `<span class="${this.elem('title')}">content</span>`;

      this.on('title', 'click', this.onClick);
    }

    onClick(target, event) {
      console.log('view elem click', { target, event });
    }
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  return myView;
}

function test57() {
  // * 57) View off elem method * //

  beforeEach();

  class MyView extends View {
    constructor(options) {
      super(options);

      this.element.innerHTML = `<span class="${this.elem('title')}">content</span>`;

      this.on('title', 'click', this.onClick);
      this.off('title', 'click', this.onClick);
    }

    onClick(target, event) {
      console.log('view elem click', { target, event });
    }
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  return myView;
}

function test58() {
  // * 58) View delegate method * //

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
      console.log('item clicked', { hidden: item.getMod('hidden'), target: item, event });
    }
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  return myView;
}

function test59() {
  // * 59) Block trigger method * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  testBlock.on('my-event', (_target, event) => {
    console.log('my-event', { event, detail: event.detail });
  });

  testBlock.trigger('my-event', { name: 'Tom', age: 12 });

  return testBlock;
}

function test60() {
  // * 60) View trigger method * //

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

    blockListener(target, event) {
      console.log('blockListener', { target, event, detail: event.detail });
    }

    elemListener(target, event) {
      console.log('elemListener', { target, event, detail: event.detail });
    }

    delegatedListener(target, event) {
      console.log('delegatedListener', { target, event, detail: event.detail });
    }
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });
  const title = myView.find('title');
  const item = myView.find('item', { hidden: true });

  myView.trigger('my-event', { type: 'view-dispatch' });
  myView.trigger('my-event', 'title', { type: 'view-elem-dispatch' });
  title.trigger('my-event', { type: 'block-dispatch' });
  myView.trigger('my-event', 'item', { type: 'view-elem-dispatch-2' });
  item.trigger('my-event', { type: 'block-dispatch-2' });

  return myView;
}

function test61() {
  // * 61) Block once method * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  testBlock.once('click', (target, event) => {
    console.log('clicked block once', { target, event });
  });

  testBlock.once('click', (target, event) => {
    console.log('clicked block once with error', { target, event });
    throw new Error('test error');
  });

  return testBlock;
}

function test62() {
  // * 62) View once method * //

  beforeEach();

  class MyView extends View {
    constructor(options) {
      super(options);

      this.element.innerHTML = `<span class="${this.elem('title')}">content</span>`;

      this.once('click', (target, event) => {
        console.log('clicked view once', { target, event });
      });

      this.once('title', 'click', (target, event) => {
        console.log('clicked view title once', { target, event });
      });
    }
  }

  const element = document.querySelector('.test');

  const myView = new MyView({ element });

  return myView;
}

function test63() {
  // * 63) Block on context * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  const customContext = { name: 'Tom', age: 12 };

  testBlock.on('click', function(target, event) {
    console.log('on handler', {
      target,
      event,
      context: this,
      check: this === testBlock
    });
  });

  testBlock.once('click', function(target, event) {
    console.log('once handler', {
      target,
      event,
      context: this,
      check: this === testBlock
    });
  });

  testBlock.on('click', function(target, event) {
    console.log('on handler custom context', {
      target,
      event,
      context: this,
      check: this === customContext
    });
  }, customContext);

  testBlock.once('click', function(target, event) {
    console.log('once handler custom context', {
      target,
      event,
      context: this,
      check: this === customContext
    });
  }, customContext);

  return testBlock;
}

function test64() {
  // * 64) View on context * //

  beforeEach();

  const element = document.querySelector('.test');

  class MyView extends View {
    constructor(options) {
      super(options);

      this.element.innerHTML = `<span class="${this.elem('title')}">content</span>`;

      this.on('click', function(target, event) {
        console.log('on handler', {
          target,
          event,
          context: this,
          check: this === myView
        });
      });

      this.once('click', function(target, event) {
        console.log('once handler', {
          target,
          event,
          context: this,
          check: this === myView
        });
      });

      this.on('title', 'click', function(target, event) {
        console.log('on elem handler', {
          target,
          event,
          context: this,
          check: this === myView
        });
      });

      this.once('title', 'click', function(target, event) {
        console.log('once elem handler', {
          target,
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
