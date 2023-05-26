// -------------------------------- Lib ---------------------------------

function bind(value, {kind, name, addInitializer}) {
  if (kind !== 'method') {
    return value;
  }

  addInitializer(function () {
    this[name] = this[name].bind(this);
  });
}

function singleton(value, {kind}) {
  if (kind !== 'class') {
    return value;
  }

  let instance = null;

  return class extends value {
    constructor(...args) {
      if (instance !== null) {
        return instance;
      }

      super(...args);

      instance = this;
    }
  }
}

class StringUtils {
  static isUpperCase(value) {
    if (typeof value !== 'string') {
      return false;
    }

    return this.toUpperCase(value) === value;
  }

  static isLowerCase(value) {
    if (typeof value !== 'string') {
      return false;
    }

    return this.toLowerCase(value) === value;
  }

  static toLowerCase(value) {
    if (typeof value !== 'string') {
      return '';
    }

    return value.toLowerCase();
  }

  static toUpperCase(value) {
    if (typeof value !== 'string') {
      return '';
    }

    return value.toUpperCase();
  }

  static toKebabCase(value) {
    let result = '';

    for (const character of value) {
      if (this.isUpperCase(character)) {
        result += `${this.toLowerCase(character)}-`;
      }
    }

    if (result.endsWith('-')) {
      result = result.slice(0, -1);
    }

    return result;
  }
}

class ObjectUtils {
  static isObject(value) {
    if (typeof value === 'object' && value !== null) {
      if (typeof Object.getPrototypeOf === 'function') {
        const prototype = Object.getPrototypeOf(value);
        return prototype === Object.prototype || prototype === null;
      }

      return Object.prototype.toString.call(value) === '[object Object]';
    }

    return false;
  }

  static getKeys(obj) {
    const RESERVED_KEYS = [
      '__proto__',
      'constructor',
      'prototype'
    ];

    return Object.keys(obj).filter((keyName) => !RESERVED_KEYS.includes(keyName));
  }

  static getKeysCount(obj) {
    return this.getKeys(obj).length;
  }

  static isEqual(obj1, obj2) {
    if (this.getKeysCount(obj1) !== this.getKeysCount(obj2)) {
      return false;
    }

    return this.isLeftIntersect(obj1, obj2);
  }

  static includesLeft(obj1, obj2) {
    for (const keyName of this.getKeys(obj1)) {
      if (obj1[keyName] !== obj2[keyName]) {
        return false;
      }
    }

    return true;
  }

  static includesRight(obj1, obj2) {
    return this.includesLeft(obj2, obj1);
  }

  static deepMerge(...objs) {
    return objs.reduce((result, current) => {
      this.getKeys(current).forEach((keyName) => {
        if (this.isObject(result[keyName]) && this.isObject(current[keyName])) {
          result[keyName] = this.deepMerge(result[keyName], current[keyName]);
        } else {
          result[keyName] = current[keyName];
        }
      });

      return result;
    });
  }

  static filter(obj, callback) {
    return Object.fromEntries(Object.entries(obj).filter(
      ([keyName, keyValue], index) => callback(keyValue, keyName, index)
    ));
  }

  static map(obj, callback) {
    return Object.fromEntries(Object.entries(obj).map(
      ([keyName, keyValue], index) => [keyName, callback(keyValue, keyName, index)]
    ));
  }

  static mapKeys(obj, callback) {
    return Object.fromEntries(Object.entries(obj).map(
      ([keyName, keyValue], index) => [callback(keyName, keyValue, index), keyValue]
    ));
  }
}

class BlockUtils {
  static getBlockName(BlockClass) {
    if (BlockClass.block && typeof BlockClass.block === 'string') {
      return BlockClass.block;
    }

    if (typeof BlockClass.name === 'string') {
      return StringUtils.toKebabCase(BlockClass.name);
    }

    return '';
  }

  static parseClassName(blockName, element) {
    const result = {
      block: null,
      elementName: null,
      mods: []
    };

    for (const className of element.classList) {
      if (!className.startsWith(blockName)) {
        continue;
      }

      if (className === blockName) {
        result.block = className;
        continue;
      }

      const parts = className.split('__');
      let elementName;
      let modName;
      let modValue;

      if (parts.length === 1) {
        ([, modName, modValue = true] = parts[0].split('_'));
      }

      if (parts.length === 2) {
        ([elementName, modName, modValue = true] = parts[1].split('_'));
      }

      if (elementName) {
        result.elementName = elementName;
      }

      if (modName) {
        result.mods.push({modName, modValue, className});
      }
    }

    return result;
  }
}

class ViewUtils {
  static triggerModHandler(view, modName, modValue = true) {
    if (!view.onSetMod) {
      return;
    }

    const setModHandler = view.onSetMod[modName];

    if (typeof setModHandler !== 'function') {
      return;
    }

    setModHandler.call(view, modValue);
  }
}

class Block {
  static block = null;

  constructor({block: blockOption, element: elementOption}) {
    let block;
    let element;

    if (blockOption && typeof blockOption === 'string') {
      block = blockOption;
    } else {
      block = BlockUtils.getBlockName(this.constructor);
    }

    if (elementOption instanceof Element) {
      element = elementOption;
    }

    if (typeof elementOption === 'string') {
      element = document.getElementById(elementOption);
    }

    this.state = {
      block,
      element,
      listeners: new Map()
    };
  }

  get block() {
    return this.state.block;
  }

  get element() {
    return this.state.element;
  }

  get params() {
    return this.params;
  }

  elem(element = '', className = false) {
    const result = `${this.block}__${element}`;

    if (className) {
      return `.${result}`;
    }

    return result;
  }

  getName() {
    return this.block;
  }

  getMods() {
    const {mods} = BlockUtils.parseClassName(this.block, this.element);

    return mods.reduce((acc, {modName, modValue}) => {
      acc[modName] = modValue;

      return acc;
    }, {});
  }

  getMod(modName) {
    return this.getMods()[modName];
  }

  setMods(mods) {
    Object.keys(this.getMods()).forEach((modName) => {
      if (modName in mods) {
        return;
      }

      this.setMod(modName, false);
    });

    Object.entries(mods).forEach(([modName, modValue]) => {
      this.setMod(modName, modValue);
    });
  }

  setMod(modName, modValue = true) {
    const {block, elementName, mods} = BlockUtils.parseClassName(this.block, this.element);

    if (!block) {
      return;
    }

    if (modValue === false) {
      mods.forEach((mod) => {
        if (mod.modName !== modName) {
          return;
        }
        this.element.classList.remove(mod.className);
      });
    } else if (modValue) {
      let newClassName = elementName ? this.elem(elementName) : this.block;

      newClassName = `${newClassName}_${modName}`;

      if (modValue !== true) {
        newClassName = `${newClassName}_${modValue}`;
      }

      this.element.classList.add(newClassName);
    }
  }

  toggleMod(modName, modValue) {
    const hasMod = Boolean(this.getMod(modName));

    if (hasMod) {
      this.setMod(modName, false);
    } else {
      this.setMod(modName, modValue);
    }
  }

  getParams() {
    const datasetAttribute = this.element.dataset;

    if (!datasetAttribute) {
      return {};
    }

    const paramsAttribute = datasetAttribute.params;

    if (!paramsAttribute) {
      return {};
    }

    return JSON.parse(paramsAttribute);
  }

  getParam(paramName) {
    return this.getParams()[paramName];
  }

  setParams(params) {
    this.element.dataset.params = JSON.stringify(params);
  }

  setParam(paramName, paramValue) {
    const params = this.getParams();

    if (paramValue === null || paramValue === undefined) {
      delete params[paramName];
    } else {
      params[paramName] = paramValue;
    }

    this.setParams(params);
  }

  on(eventName, handler, context) {
    const boundHandler = handler.bind(context || this);
    const events = this.state.listeners.get(this.element) || {};
    const listeners = events[eventName] || [];

    listeners.push({handler, boundHandler});

    events[eventName] = listeners;

    this.state.listeners.set(this.element, events);

    this.element.addEventListener(eventName, boundHandler);
  }

  off(eventName, handler) {
    const events = this.state.listeners.get(this.element);

    if (!events) {
      return;
    }

    const listeners = events[eventName];

    if (!Array.isArray(listeners)) {
      return;
    }

    events[eventName] = listeners.filter(({
      eventName: listenerEventName,
      handler: listenerHandler,
      boundHandler
    }) => {
      if (
        listenerEventName === eventName && (
          listenerHandler === handler || boundHandler === handler)
      ) {
        this.element.removeEventListener(eventName, boundHandler);

        return false;
      }

      return true;
    });
  }

  trigger(eventName, detail) {
    this.element.dispatchEvent(
      new CustomEvent(eventName, {
        bubbles: true,
        cancelable: true,
        detail
      })
    );
  }

  destruct() {
    const events = this.state.listeners.get(this.element);

    this.state.listeners.delete(this.element);

    if (!events) {
      return;
    }

    Object.entries(events).forEach(([eventName, listeners]) => {
      listeners.forEach(({boundHandler}) => {
        this.element.removeEventListener(eventName, boundHandler);
      });
    });
  }

  remove() {
    this.destruct();
    this.element.remove();
  }
}

class View extends Block {
  static block = null;

  static bemjson = {
    onBlock() {
      /* empty */
    },
    onElem: {}
  };

  static get onBlock() {
    return this.bemjson.onBlock;
  }

  static set onBlock(value) {
    if (typeof value !== 'function') {
      return;
    }

    this.bemjson.onBlock = value;
  }

  static get onElem() {
    return this.bemjson.onElem;
  }

  static set onElem(data) {
    Object.assign(this.bemjson.onElem, ObjectUtils.filter(
      data, (value) => typeof value === 'function'
    ));
  }

  static init() {
    const block = BlockUtils.getBlockName(this);

    document.querySelectorAll(`.${block}`).forEach((element) => {
      new this({element});
    });
  }

  constructor({element}) {
    super({element});

    this.state = Object.assign({}, this.state, {
      appState: null,
      modHanders: {},
      setters: {}
    });
  }

  get onSetMod() {
    return this.state.modHanders;
  }

  set onSetMod(modHanders) {
    if (!ObjectUtils.isObject(modHanders)) {
      return;
    }

    Object.assign(this.onSetMod, modHanders);
  }

  get setters() {
    return this.state.setters;
  }

  on(...args) {
    if (args.length < 2) {
      return;
    }

    if (args.length === 2) {
      const [eventName, handler] = args;
      super.on(eventName, handler);
      return;
    }

    const [targetElement, eventName, handler] = args;
    const target = this.find(targetElement);

    if (!target) {
      return;
    }

    target.on(eventName, handler, this);
  }

  off(...args) {
    if (args.length < 2) {
      return;
    }

    if (args.length === 2) {
      const [eventName, handler] = args;
      super.off(eventName, handler);
      return;
    }

    const [targetElement, eventName, handler] = args;
    const target = this.find(targetElement);

    if (!target) {
      return;
    }

    target.off(eventName, handler);
  }

  trigger(...args) {
    if (args.length < 2) {
      return;
    }

    if (args.length === 2) {
      const [eventName, detail] = args;
      super.trigger(eventName, detail);
      return;
    }

    const [targetElement, eventName, detail] = args;
    const target = this.find(targetElement);

    if (!target) {
      return;
    }

    target.trigger(eventName, detail);
  }

  delegate(targetElement, eventName, eventHandler) {
    const handleDelegate = (event) => {
      const target = event.target.closest(this.elem(targetElement, true));

      if (!target) {
        return;
      }

      eventHandler.call(this, this.elemify(target), event);
    };

    this.on(eventName, handleDelegate);
  }

  elemify(targetElement) {
    if (targetElement instanceof Block) {
      return targetElement;
    }

    const block = new Block({block: this.block, element: targetElement});

    block.state.listeners = this.state.listeners;

    return block;
  }

  find(targetElement, mods) {
    let target;

    if (!targetElement) {
      target = this.element;
    }

    if (targetElement instanceof Element) {
      target = targetElement;
    }

    if (typeof targetElement === 'string' && !mods) {
      target = this.element.querySelector(this.elem(targetElement, true));
    }

    if (typeof targetElement === 'string' && mods) {
      target = this.findAll(targetElement, mods)[0];
    }

    if (!target) {
      return;
    }

    return this.elemify(target);
  }

  findAll(targetElement, mods) {
    if (typeof targetElement !== 'string') {
      return [];
    }

    let blocks = Array.from(this.element.querySelectorAll(this.elem(targetElement, true)))
      .map((element) => new Block({block: this.block, element}));

    if (mods) {
      blocks = blocks.filter((block) => ObjectUtils.includesLeft(mods, block.getMods()));
    }

    return blocks;
  }

  findOn(targetElement, elementName) {
    const target = this.find(targetElement);

    if (!target) {
      return;
    }

    let result = target.element.querySelector(this.elem(elementName, true));

    if (!result) {
      result = target.element.closest(this.elem(elementName, true));
    }

    return this.elemify(result);
  }

  findBlock() {
  }

  getElemMod(targetElement, modName) {
    return this.find(targetElement).getMod(modName);
  }

  setMods(mods) {
    Object.entries(mods).forEach(([modName, modValue]) => {
      ViewUtils.triggerModHandler(this, modName, modValue);
    });

    super.setMods(mods);
  }

  setElemMods(targetElement, mods) {
    this.find(targetElement).setMods(mods);
  }

  setMod(modName, modValue) {
    ViewUtils.triggerModHandler(this, modName, modValue);

    super.setMod(modName, modValue);
  }

  setElemMod(targetElement, modName, modValue) {
    this.find(targetElement).setMod(modName, modValue);
  }

  toggleElemMod(targetElement, modName, modValue) {
    this.find(targetElement).toggleMod(modName, modValue);
  }

  destruct() {
    Array.from(this.state.listeners.entries()).forEach(([element, events]) => {
      Object.entries(events).forEach(([eventName, listeners]) => {
        listeners.forEach(({boundHandler}) => {
          element.removeEventListener(eventName, boundHandler);
        });
      });

      this.state.listeners.delete(element);
    });
  }

  remove() {
    this.destruct();
    this.state.element.remove();
  }
}

// ----------------------------------------------------------------------

// -------------------------- Business Logic -----------------------------

class Accordion extends View {
  constructor(options) {
    super(options);
    this.delegate('title', 'click', this.onTitleClick);
  }

  onTitleClick(title) {
    this.findOn(title, 'item').toggleMod('expanded');
  }
}

Accordion.init();

// ----------------------------------------------------------------------

// ------------------------------- Test ---------------------------------

function beforeEach() {
  const element = document.createElement('div');
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

  const element = document.querySelector('.test');

  return new Block({ block: 'cool', element });
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

  const testBlock = new Block({ block: 'block-getter', element });

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
    onSetMod = {
      visible: function(value) {
        console.log('triggered visible', {value});
      }
    };
  }

  class MyOtherView extends MyView {
    onSetMod = {
      open: function(value) {
        console.log('triggered open', {value});
      }
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

      this.delegate('item', 'click', () => {
        console.log('view title delegate click');
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

      this.delegate('item', 'click', () => {
        console.log('view title delegate click');
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

function test53() {
  // * 53) View on method * //

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

function test54() {
  // * 54) View off method * //

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

function test55() {
  // * 55) View on elem method * //

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

function test56() {
  // * 56) View off elem method * //

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

function test57() {
  // * 57) View delegate method * //

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

function test58() {
  // * 58) Block trigger method * //

  beforeEach();

  const element = document.querySelector('.test');

  const testBlock = new Block({ element });

  testBlock.on('my-event', (_target, event) => {
    console.log('my-event', { event, detail: event.detail });
  });

  testBlock.trigger('my-event', { name: 'Tom', age: 12 });

  return testBlock;
}

function test59() {
  // * 59) View trigger method * //

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

// ----------------------------------------------------------------------
