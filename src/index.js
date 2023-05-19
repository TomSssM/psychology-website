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

class Block {
  static block = null;

  constructor({block: blockOption, element: elementOption}) {
    let block;
    let element;

    if (blockOption && typeof blockOption === 'string') {
      block = blockOption;
    }

    if (this.constructor.block && typeof this.constructor.block === 'string') {
      block = this.constructor.block;
    } else {
      block = StringUtils.toKebabCase(this.constructor.name);
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

  parseClassName() {
    const result = {
      block: null,
      elementName: null,
      mods: []
    };

    for (const className of this.element.classList) {
      if (!className.startsWith(this.block)) {
        continue;
      }

      if (className === this.block) {
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

  getMod(modName) {
    const {mods} = this.parseClassName();
    const mod = mods.find((mod) => mod.modName === modName);

    if (mod) {
      return mod.modValue;
    }
  }

  setMod(modName, modValue = true) {
    const {block, elementName, mods} = this.parseClassName();

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
    const paramsAttribute = this.element.dataset?.params;

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
    const boundHandler = handler.bind(context ?? this);
    const listeners = this.state.listeners.get(this.element) ?? [];

    listeners.push({eventName, handler, boundHandler});

    this.state.listeners.set(this.element, listeners);

    this.element.addEventListener(eventName, boundHandler);
  }

  off(eventName, handler) {
    const listeners = this.state.listeners.get(this.element) ?? [];

    this.state.listeners.set(this.element, listeners.filter(({
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
    }));
  }

  destruct() {
    const listeners = this.state.listeners.get(this.element);

    this.state.listeners.delete(this.element);

    if (!Array.isArray(listeners)) {
      return;
    }

    listeners.forEach(({eventName, handler}) => {
      this.element.removeEventListener(eventName, handler);
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
    const block = this.block ? this.block : StringUtils.toKebabCase(this.name);

    document.querySelectorAll(`.${block}`).forEach((element) => {
      new this({element});
    });
  }

  constructor({element}) {
    super({element});

    this.state = Object.assign({}, this.state, {
      appState: null
    });
  }

  setMod(modName, modValue = true) {
    this.onSetMod?.[modName]?.call(this, modValue);
    super.setMod(modName, modValue);
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

  find(targetElement) {
    let target;

    if (!targetElement) {
      target = this.element;
    }

    if (targetElement instanceof Element) {
      target = targetElement;
    }

    if (typeof targetElement === 'string') {
      target = this.element.querySelector(this.elem(targetElement, true));
    }

    if (!target) {
      return;
    }

    return this.elemify(target);
  }

  findAll(targetElement) {
    if (typeof targetElement !== 'string') {
      return [];
    }

    return Array.from(this.element.querySelectorAll(this.elem(targetElement, true)))
      .map((element) => new Block({block: this.block, element}));
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

  setElemMod(targetElement, modName, modValue) {
    this.find(targetElement).setMod(modName, modValue);
  }

  toggleElemMod(targetElement, modName, modValue) {
    this.find(targetElement).toggleMod(modName, modValue);
  }

  destruct() {
    Array.from(this.state.listeners.entries()).forEach(([element, listeners]) => {
      listeners.forEach(({eventName, boundHandler}) => {
        element.removeEventListener(eventName, boundHandler);
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
