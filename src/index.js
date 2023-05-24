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
  static getKeys(obj) {
    return Object.keys(obj);
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

  elem(element = '', className = false) {
    const result = `${this.block}__${element}`;

    if (className) {
      return `.${result}`;
    }

    return result;
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
      accessorProps: {}
    });
  }

  get accessorProps() {
    return this.state.accessorProps;
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

  getBlock() {
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

  getElemMod(targetElement, modName) {
    return this.find(targetElement).getMod(modName);
  }

  setMods(mods) {
    Object.entries(mods).forEach(([modName, modValue]) => {
      ViewUtils.triggerModHandler(this, modName, modValue);
    });

    super.setMods(mods);
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
