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

class View {
  static block = null;

  static init() {
    if (this.block === null) {
      this.block = this.name.toLowerCase();
    }

    document.querySelectorAll(`.${this.block}`).forEach((element) => {
      new this({element});
    });
  }

  constructor({element: elementOption}) {
    const element = elementOption instanceof Element
      ? elementOption
      : typeof elementOption === 'string'
      ? document.getElementById(elementOption)
      : null;

    if (!element) {
      throw new Error(`Cannot find element for ${this.constructor.name}`);
    }

    if (this.constructor.block === null) {
      this.constructor.block = this.constructor.name.toLowerCase();
    }

    this.block = this.constructor.block;

    if (!element.classList.contains(this.block)) {
      element.classList.add(this.block);
    }

    this.state = {
      element,
      listeners: new Map()
    };
  }

  on(...args) {
    if (args.length < 2) {
      return;
    }

    if (args.length === 2) {
      const [eventName, handler] = args;
      return this.on(this.state.element, eventName, handler);
    }

    const [targetElement, eventName, handlerOption] = args;

    const handler = handlerOption.bind(this);
    const target = this.find(targetElement);

    if (target === null) {
      return;
    }

    target.addEventListener(eventName, handler);

    const listeners = this.state.listeners.get(eventName) ?? [];
    listeners.push({target, handler});
    this.state.listeners.set(eventName, listeners);
  }

  delegate(targetElement, eventName, eventHandler) {
    const handleDelegate = (event) => {
      const target = event.target.closest(this.elem(targetElement));
      if (!target) {
        return;
      }
      eventHandler.call(this, target, event);
    };

    this.on(this.state.element, eventName, handleDelegate);
  }

  elem(element = '', className = true) {
    const result = `${this.block}__${element}`;

    if (className) {
      return `.${result}`;
    }

    return result;
  }

  find(targetElement) {
    if (!targetElement) {
      return this.element;
    }

    if (targetElement instanceof Element) {
      return targetElement;
    }

    return this.state.element.querySelector(this.elem(targetElement));
  }

  findAll(targetElement) {
    if (!targetElement) {
      return [];
    }

    return Array.from(this.state.element.querySelectorAll(this.elem(targetElement)));
  }

  findOn(targetElement, elementName) {
    const target = this.find(targetElement);

    if (target === null) {
      return null;
    }

    const result = target.querySelector(this.elem(elementName));

    if (result) {
      return result;
    }

    return target.closest(this.elem(elementName));
  }

  getMod(...args) {
    if (args.length < 1) {
      return;
    }

    if (args.length === 1) {
      const [modName] = args;
      return this.getMod(this.state.element, modName);
    }

    const [targetElement, modName] = args;
    const target = this.find(targetElement);
    const {mods} = this.parseClassName(target);
    const mod = mods.find((mod) => mod.modName === modName);

    if (mod) {
      return mod.modValue;
    }
  }

  getElemMod(targetElement, modName) {
    return this.getMod(this.find(targetElement), modName);
  }

  setMod(...args) {
    if (args.length < 1) {
      return;
    }

    if (args.length === 1 || args.length === 2) {
      const [modName, modValue] = args;

      if (modName instanceof Element) {
        return this.setMod(modName, modValue, true);
      }

      return this.setMod(this.state.element, modName, modValue);
    }

    const [targetElement, modName, modValue = true] = args;
    const target = this.find(targetElement);
    const {elementName, mods} = this.parseClassName(target);

    if (this.state.element === target) {
      this.onSetMod?.[modName]?.call(this, modValue);
    }

    if (modValue === false) {
      mods.forEach((mod) => {
        if (mod.modName !== modName) {
          return;
        }
        target.classList.remove(mod.className);
      });
    } else {
      let newClassName = elementName ? this.elem(elementName, false) : this.block;

      newClassName = `${newClassName}_${modName}`;

      if (modValue !== true) {
        newClassName = `${newClassName}_${modValue}`;
      }

      target.classList.add(newClassName);
    }
  }

  setElemMod(targetElement, modName, modValue = true) {
    this.setMod(this.find(targetElement), modName, modValue);
  }

  toggleMod(...args) {
    if (args.length < 1) {
      return;
    }

    if (args.length === 1 || args.length === 2) {
      const [modName, modValue] = args;

      if (modName instanceof Element) {
        return this.toggleMod(modName, modValue, true);
      }

      return this.toggleMod(this.state.element, modName, modValue);
    }

    const [targetElement, modName, modValue = true] = args;
    const hasMod = Boolean(this.getMod(targetElement, modName));

    if (hasMod) {
      this.setMod(targetElement, modName, false);
    } else {
      this.setMod(targetElement, modName, modValue);
    }
  }

  toggleElemMod(targetElement, modName, modValue = true) {
    this.toggleMod(this.find(targetElement), modName, modValue);
  }

  parseClassName(target) {
    const result = {
      elementName: '',
      mods: []
    };

    for (const className of target.classList) {
      if (!className.startsWith(this.block)) {
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

  getParams(targetElement) {
    const target = targetElement ? this.find(targetElement) : this.state.element;
    const paramsAttribute = target.dataset?.params;

    if (!paramsAttribute) {
      return {};
    }

    return JSON.parse(paramsAttribute);
  }

  getParam(...args) {
    if (args.length < 1) {
      return;
    }

    if (args.length === 1) {
      const [paramName] = args;
      return this.getParam(this.state.element, paramName);
    }

    const [targetElement, paramName] = args;

    return this.getParams(targetElement)[paramName];
  }

  setParams(...args) {
    if (args.length < 1) {
      return;
    }

    if (args.length === 1) {
      const [params] = args;
      return this.setParams(this.state.element, params);
    }

    const [targetElement, params] = args;
    const target = targetElement ? this.find(targetElement) : this.state.element;

    target.dataset.params = JSON.stringify(params);
  }

  setParam(...args) {
    if (args.length < 2) {
      return;
    }

    if (args.length === 2) {
      const [paramName, paramValue] = args;
      return this.setParam(this.state.element, paramName, paramValue);
    }

    const [targetElement, paramName, paramValue] = args;
    const target = this.find(targetElement);
    const params = this.getParams(target);

    if (paramValue === null) {
      delete params[paramName];
    } else {
      params[paramName] = paramValue;
    }

    this.setParams(target, params);
  }

  destruct() {
    Array.from(this.state.listeners.entries()).forEach(([eventName, listeners]) => {
      listeners.forEach(({target, handler}) => {
        target.removeEventListener(eventName, handler);
      });
    });
  }
}

// ----------------------------------------------------------------------

// -------------------------- Business Logic -----------------------------

class Accordion extends View {
  constructor(options) {
    super(options);
    this.delegate('title', 'click', this.onClick);
  }

  onClick(target) {
    const item = this.findOn(target, 'item');
    this.toggleElemMod(item, 'expanded');
  }
}

Accordion.init();

// ----------------------------------------------------------------------
