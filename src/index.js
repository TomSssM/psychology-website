function init(Block) {
  if (!Block.block) {
    new Block();
  } else {
    for (const rootElem of document.getElementsByClassName(Block.block)) {
      new Block(rootElem);
    }
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

class ContactButton {
  static HIDDEN_CLASSNAME = 'header__contact-button_hidden';

  constructor() {
    this.onClick = this.onClick.bind(this);

    this.contactButton = document.getElementById('js-contact-button');
    this.contactSection = document.getElementById('js-contact-section');
    this.header = document.getElementById('js-header');

    this.contactButton.addEventListener('click', this.onClick);
  }

  onClick() {
    const { top: contactSectionTop } = this.contactSection.getBoundingClientRect();
    const { height: headerHeight } = this.header.getBoundingClientRect();
    const scrollBy = contactSectionTop - headerHeight;

    this.contactButton.classList.add(ContactButton.HIDDEN_CLASSNAME);

    window.scrollBy({
      top: scrollBy,
      behavior: 'smooth'
    });

    setTimeout(() => {
      this.contactButton.classList.remove(ContactButton.HIDDEN_CLASSNAME);
    }, 2500);
  }
}

init(Accordion);
init(ContactButton);
