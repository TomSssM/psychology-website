function init(Block, ...args) {
  if (!Block.block) {
    new Block(...args);
  } else {
    for (const rootElem of document.getElementsByClassName(Block.block)) {
      new Block(rootElem, ...args);
    }
  }
}

class Accordion {
  static block = 'accordion';

  static TITLE_CLASSNAME = 'accordion__title';

  static ITEM_CLASSNAME = 'accordion__item';

  static ITEM_EXPANDED_CLASSNAME = 'accordion__item_expanded';

  constructor(rootElem) {
    this.onClick = this.onClick.bind(this);

    rootElem.addEventListener('click', this.onClick);
  }

  onClick(event) {
    const title = event.target.closest(`.${Accordion.TITLE_CLASSNAME}`);

    if (!title) {
      return;
    }

    const item = event.target.closest(`.${Accordion.ITEM_CLASSNAME}`);

    item.classList.toggle(Accordion.ITEM_EXPANDED_CLASSNAME);
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

class Paranja {
}

class Slider {
  static block = 'slider';

  static PRESSED_BUTTON_CLASSNAME = 'slider__button_pressed';

  static BUTTON_CLASSNAME = 'slider__button';

  static SLIDES_CLASSNAME = 'slider__slides';

  static SLIDE_CLASSNAME = 'slider__slide';

  static SLIDER_VIEW_CLASSNAME = 'slider__view';

  static SLIDE_INTERVAL = 4000;

  constructor(rootElem, slideshowEnabled = true, paranja) {
    this.onClick = this.onClick.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerLeave = this.onPointerLeave.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);

    this.slider = rootElem;
    this.slides = this.slider.getElementsByClassName(Slider.SLIDES_CLASSNAME)[0];
    this.sliderView = this.slider.getElementsByClassName(Slider.SLIDER_VIEW_CLASSNAME)[0];
    this.buttons = Array.from(this.slider.getElementsByClassName(Slider.BUTTON_CLASSNAME));
    this.slidesCount =  Array.from(this.slider.getElementsByClassName(Slider.SLIDE_CLASSNAME)).length;
    this.slideshowEnabled = slideshowEnabled;
    this.intervalId = null;

    this.buttons.forEach((button, index) => {
      button.dataset.index = String(index);
    });

    this.slider.addEventListener('click', this.onClick);
    this.sliderView.addEventListener('pointerdown', this.onPointerDown);
    this.sliderView.addEventListener('pointerup', this.onPointerUp);
    this.sliderView.addEventListener('pointerleave', this.onPointerLeave);

    this.currentSlide = 0;
    this.startSlideShow();
  }

  set currentSlide(slideIndex) {
    const prevPressedButton = this.buttons[this.currentSlide];
    const currentPressedButton = this.buttons[slideIndex];

    if (prevPressedButton) {
      prevPressedButton.classList.remove(Slider.PRESSED_BUTTON_CLASSNAME);
    }

    if (currentPressedButton) {
      currentPressedButton.classList.add(Slider.PRESSED_BUTTON_CLASSNAME);
    }

    this.slider.dataset.currentSlide = String(slideIndex);
    this.slides.style.transform = `translateX(${-100 * slideIndex}%)`;
  }

  get currentSlide() {
    const currentSlide = Number(this.slider.dataset.currentSlide);

    if (Number.isNaN(currentSlide)) {
      return 0;
    }

    return currentSlide;
  }

  onClick(event) {
    const sliderButton = event.target.closest(`.${Slider.BUTTON_CLASSNAME}`);

    if (sliderButton) {
      this.onButtonClick(sliderButton);
    }
  }

  onPointerDown() {
    this.stopSlideShow();
  }

  onPointerUp() {
    this.startSlideShow();
  }

  onPointerLeave() {
    this.startSlideShow();
  }

  onButtonClick(sliderButton) {
    const slideIndex = Number(sliderButton.dataset.index);

    if (Number.isNaN(slideIndex)) {
      return;
    }

    this.currentSlide = slideIndex;
  }

  startSlideShow() {
    if (!this.slideshowEnabled || this.intervalId !== null) {
      return;
    }

    this.intervalId = setInterval(this.nextSlide.bind(this), Slider.SLIDE_INTERVAL);
  }

  stopSlideShow() {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slidesCount;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1) % this.slidesCount;
  }
}

init(Accordion);
init(ContactButton);
init(Slider, true, new Paranja());
