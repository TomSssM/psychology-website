function init(Block) {
  for (const rootElem of document.getElementsByClassName(Block.block)) {
    new Block(rootElem);
  }
}

class Accordion {
  static block = 'accordion';

  constructor(rootElem) {
    this.onClick = this.onClick.bind(this);

    rootElem.addEventListener('click', this.onClick);
  }

  onClick(event) {
    const title = event.target.closest('.accordion__title');

    if (!title) {
      return;
    }

    const item = event.target.closest('.accordion__item');

    item.classList.toggle('accordion__item_expanded');
  }
}

init(Accordion);
