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
        result += `-${this.toLowerCase(character)}`;
      } else {
        result += character;
      }
    }

    if (result.startsWith('-')) {
      result = result.slice(1);
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

  static getEntries(obj) {
    return Object.entries(obj);
  }

  static getKeysCount(obj) {
    return this.getKeys(obj).length;
  }

  static isEqual(obj1, obj2) {
    if (this.getKeysCount(obj1) !== this.getKeysCount(obj2)) {
      return false;
    }

    return this.includesLeft(obj1, obj2);
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

  static filter(obj, callback, context) {
    return Object.fromEntries(this.getEntries(obj).filter(
      function([keyName, keyValue], index) {
        return callback.call(this, keyValue, keyName, index);
      },
      context
    ));
  }

  static map(obj, callback, context) {
    return Object.fromEntries(this.getEntries(obj).map(
      function ([keyName, keyValue], index) {
        return [keyName, callback.call(this, keyValue, keyName, index)];
      },
      context
    ));
  }

  static mapKeys(obj, callback, context) {
    return Object.fromEntries(this.getEntries(obj).map(
      function ([keyName, keyValue], index) {
        return [callback.call(this, keyName, keyValue, index), keyValue];
      },
      context
    ));
  }

  static forEach(obj, callback, context) {
    return this.forEachKey(obj, callback, context);
  }

  static forEachKey(obj, callback, context) {
    this.getEntries(obj).forEach(function([keyName, keyValue]) {
      callback.call(this, keyName, keyValue);
    }, context);
  }

  static forEachValue(obj, callback, context) {
    this.getEntries(obj).forEach(function([keyName, keyValue]) {
      callback.call(this, keyValue, keyName);
    }, context);
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

  static getModArgs(args) {
    if (args.length === 0) {
      return {
        modName: null,
        modValue: false
      };
    }

    let modName;
    let modValue;

    modName = args[0];

    if (args.length === 1) {
      modValue = true;
    } else {
      modValue = args[1];
    }

    if (!modValue) {
      modValue = false;
    }

    return {
      modName,
      modValue
    };
  }
}

class ViewUtils {
  static triggerModHandler(view, modName, modValue) {
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
    return this.getParams();
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

    ObjectUtils.forEach(mods, function (modName, modValue) {
      this.setMod(modName, modValue);
    }, this);
  }

  setMod(...args) {
    const {modName, modValue} = BlockUtils.getModArgs(args);
    const {block, elementName, mods} = BlockUtils.parseClassName(this.block, this.element);

    if (!block || !modName) {
      return;
    }

    mods.forEach((mod) => {
      if (mod.modName !== modName) {
        return;
      }

      this.element.classList.remove(mod.className);
    });

    if (!modValue) {
      return;
    }

    let newClassName = elementName ? this.elem(elementName) : this.block;

    newClassName = `${newClassName}_${modName}`;

    if (modValue !== true) {
      newClassName = `${newClassName}_${modValue}`;
    }

    this.element.classList.add(newClassName);
  }

  toggleMod(...args) {
    const {modName, modValue} = BlockUtils.getModArgs(args);
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
      handler: listenerHandler,
      boundHandler
    }) => {
      if (listenerHandler === handler || boundHandler === handler) {
        this.element.removeEventListener(eventName, boundHandler);

        return false;
      }

      return true;
    });
  }

  once(eventName, handler, context) {
    if (!eventName || typeof handler !== 'function') {
      return;
    }

    const handleOnce = (...args) => {
      this.off(eventName, handleOnce);
      handler.apply(context || this, args);
    }

    this.on(eventName, handleOnce);
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

    ObjectUtils.forEach(events, function(eventName, listeners) {
      listeners.forEach(({boundHandler}) => {
        this.element.removeEventListener(eventName, boundHandler);
      });
    }, this);
  }

  remove() {
    this.destruct();
    this.element.remove();
    this.state.element = null;
  }
}

class View extends Block {
  static block = null;

  static onBlock() {
    return {};
  }

  static onElem = {};

  static init() {
    const block = BlockUtils.getBlockName(this);

    document.querySelectorAll(`.${block}`).forEach((element) => {
      new this({element});
    });
  }

  onSetMod = {};

  constructor({element}) {
    super({element});

    this.state = Object.assign({}, this.state, {
      appState: null,
      modHanders: {},
      setters: {}
    });

    Object.defineProperty(this, 'onSetMod', {
      configurable: false,
      enumerable: false,
      get() {
        return this.state.modHanders;
      },
      set(modHanders) {
        if (!ObjectUtils.isObject(modHanders)) {
          return;
        }

        Object.assign(this.onSetMod, modHanders);
      }
    });
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

  once(...args) {
    if (args.length < 2) {
      return;
    }

    if (args.length === 2) {
      const [eventName, handler] = args;
      super.once(eventName, handler);
      return;
    }

    const [targetElement, eventName, handler] = args;
    const target = this.find(targetElement);

    if (!target) {
      return;
    }

    target.once(eventName, handler, this);
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
    if (!targetElement) {
      return null;
    }

    if (targetElement instanceof Block) {
      return targetElement;
    }

    if (!(targetElement instanceof Element)) {
      return null;
    }

    const block = new Block({ block: this.block, element: targetElement });

    block.state.listeners = this.state.listeners;

    return block;
  }

  find(targetElement, mods) {
    let target;

    if (!targetElement) {
      target = this.element;
    }

    if (targetElement instanceof Element || targetElement instanceof Block) {
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

  getElemMods(targetElement) {
    return this.find(targetElement).getMods();
  }

  getElemMod(targetElement, modName) {
    return this.find(targetElement).getMod(modName);
  }

  setMods(mods) {
    super.setMods(mods);
  }

  setMod(...args) {
    const {modName, modValue} = BlockUtils.getModArgs(args);

    ViewUtils.triggerModHandler(this, modName, modValue);

    super.setMod(modName, modValue);
  }

  setElemMods(targetElement, mods) {
    this.find(targetElement).setMods(mods);
  }

  setElemMod(targetElement, ...args) {
    this.find(targetElement).setMod(...args);
  }

  toggleElemMod(targetElement, ...args) {
    this.find(targetElement).toggleMod(...args);
  }

  destruct() {
    Array.from(this.state.listeners.entries()).forEach(([element, events]) => {
      ObjectUtils.forEach(events, (eventName, listeners) => {
        listeners.forEach(({ boundHandler }) => {
          element.removeEventListener(eventName, boundHandler);
        });
      });

      this.state.listeners.delete(element);
    });
  }

  remove(...args) {
    if (args.length === 0) {
      super.remove();
    } else {
      const [targetElement] = args;

      this.find(targetElement).remove();
    }
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
