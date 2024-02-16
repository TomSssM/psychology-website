function init(Block, ...args) {
  if (!Block.block) {
    new Block(...args);
  } else {
    for (const rootElem of document.getElementsByClassName(Block.block)) {
      new Block(rootElem, ...args);
    }
  }
}

class Utils {
  static copyText(value) {
    if (!navigator.clipboard) {
      return Promise.reject(new Error('weak copy to clipboard support'));
    }

    return navigator.clipboard.writeText(value);
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
  static block = 'paranja';

  static NEXT_BUTTON_CLASSNAME = 'paranja__button_type_next';

  static PREV_BUTTON_CLASSNAME = 'paranja__button_type_prev';

  static CLOSE_BUTTON_CLASSNAME = 'paranja__close';

  static SLIDE_CLASSNAME = 'paranja__slide';

  constructor(rootElem, slider) {
    this.onNextButtonClick = this.onNextButtonClick.bind(this);
    this.onPrevButtonClick = this.onPrevButtonClick.bind(this);
    this.onSlideClick = this.onSlideClick.bind(this);
    this.onCloseButtonClick = this.onCloseButtonClick.bind(this);
    this.onSlideChange = this.onSlideChange.bind(this);

    this.paranja = rootElem;
    this.nextButton = this.paranja.getElementsByClassName(Paranja.NEXT_BUTTON_CLASSNAME)[0];
    this.prevButton = this.paranja.getElementsByClassName(Paranja.PREV_BUTTON_CLASSNAME)[0];
    this.closeButton = this.paranja.getElementsByClassName(Paranja.CLOSE_BUTTON_CLASSNAME)[0];
    this.slide = this.paranja.getElementsByClassName(Paranja.SLIDE_CLASSNAME)[0];
    this.slider = slider;

    this.nextButton.addEventListener('click', this.onNextButtonClick);
    this.prevButton.addEventListener('click', this.onPrevButtonClick);
    this.slide.addEventListener('click', this.onSlideClick);
    this.closeButton.addEventListener('click', this.onCloseButtonClick);
    this.slider.addEventListener('slidechange', this.onSlideChange);
  }

  set image(image) {
    this.slide.style.backgroundImage = `url(${image})`;
  }

  addEventListener(eventName, handler) {
    this.paranja.addEventListener(eventName, handler);
  }

  dispatchEvent(eventName, detail) {
    this.paranja.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  onNextButtonClick() {
    this.dispatchEvent('next');
  }

  onPrevButtonClick() {
    this.dispatchEvent('prev');
  }

  onSlideClick() {
    this.hide();
  }

  onCloseButtonClick() {
    this.hide();
  }

  onSlideChange(event) {
    const { image } = event.detail;

    this.image = image;
  }

  show(image) {
    if (image) {
      this.image = image;
    }

    this.paranja.style.display = 'block';
    this.isShown = true;
    this.dispatchEvent('show');
  }

  hide() {
    this.paranja.style.display = null;
    this.isShown = false;
    this.dispatchEvent('hide');
  }
}

class Slider {
  static block = 'slider';

  static PRESSED_BUTTON_CLASSNAME = 'slider__button_pressed';

  static BUTTON_CLASSNAME = 'slider__button';

  static SLIDES_CLASSNAME = 'slider__slides';

  static SLIDE_CLASSNAME = 'slider__slide';

  static SLIDER_VIEW_CLASSNAME = 'slider__view';

  static SLIDE_INTERVAL = 4000;

  constructor(rootElem, slideshowEnabled = true) {
    this.onClick = this.onClick.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onPointerLeave = this.onPointerLeave.bind(this);
    this.onPointerUp = this.onPointerUp.bind(this);
    this.onParanjaShow = this.onParanjaShow.bind(this);
    this.onParanjaHide = this.onParanjaHide.bind(this);
    this.onParanjaNext = this.onParanjaNext.bind(this);
    this.onParanjaPrev = this.onParanjaPrev.bind(this);

    this.slider = rootElem;
    this.slides = this.slider.getElementsByClassName(Slider.SLIDES_CLASSNAME)[0];
    this.sliderView = this.slider.getElementsByClassName(Slider.SLIDER_VIEW_CLASSNAME)[0];
    this.buttons = Array.from(this.slider.getElementsByClassName(Slider.BUTTON_CLASSNAME));
    this.slidesCount =  this.getSlides().length;
    this.slideshowEnabled = slideshowEnabled;
    this.intervalId = null;
    this.paranja = new Paranja(document.getElementById('js-paranja'), this);

    this.slider.addEventListener('click', this.onClick);
    this.sliderView.addEventListener('pointerdown', this.onPointerDown);
    this.sliderView.addEventListener('pointerup', this.onPointerUp);
    this.sliderView.addEventListener('pointerleave', this.onPointerLeave);
    this.paranja.addEventListener('show', this.onParanjaShow);
    this.paranja.addEventListener('hide', this.onParanjaHide);
    this.paranja.addEventListener('next', this.onParanjaNext);
    this.paranja.addEventListener('prev', this.onParanjaPrev);

    this.currentSlide = 0;
    this.init();
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

    this.dispatchEvent('slidechange', {
      slideIndex,
      image: this.getSlide(slideIndex).dataset.image
    });
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
    const slide = event.target.closest(`.${Slider.SLIDE_CLASSNAME}`);

    if (sliderButton) {
      this.onButtonClick(sliderButton);
    }

    if (slide) {
      this.onSlideClick(slide);
    }
  }

  onSlideClick(slide) {
    const image = slide.dataset.image;

    this.paranja.show(image);
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

  onParanjaShow() {
    this.stopSlideShow();
  }

  onParanjaHide() {
    this.startSlideShow();
  }

  onParanjaNext() {
    this.nextSlide();
  }

  onParanjaPrev() {
    this.prevSlide();
  }

  addEventListener(eventName, handler) {
    this.slider.addEventListener(eventName, handler);
  }

  dispatchEvent(eventName, detail) {
    this.slider.dispatchEvent(new CustomEvent(eventName, { detail }));
  }

  getSlide(slideIndex) {
    return this.getSlides()[slideIndex];
  }

  getSlides() {
    return Array.from(this.slider.getElementsByClassName(Slider.SLIDE_CLASSNAME));
  }

  startSlideShow() {
    if (!this.slideshowEnabled) {
      return;
    }

    if (this.paranja.isShown) {
      return;
    }

    if (this.intervalId !== null) {
      return;
    }

    this.intervalId = setInterval(this.nextSlide.bind(this), Slider.SLIDE_INTERVAL);
  }

  stopSlideShow() {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  nextSlide() {
    const newIndex = (this.currentSlide + 1) % this.slidesCount;

    this.currentSlide = newIndex;
  }

  prevSlide() {
    let newIndex = this.currentSlide - 1;

    if (newIndex < 0) {
      newIndex = this.slidesCount - 1;
    }

    this.currentSlide = newIndex;
  }

  init() {
    this.initButtons();
    this.initSlides();
  }

  initButtons() {
    this.buttons.forEach((button, index) => {
      button.dataset.index = String(index);
    });
  }

  initSlides() {
    this.getSlides().forEach((slide) => {
      slide.style.backgroundImage = `url(${slide.dataset.image})`;
    });
  }
}

class CopyButton {
  static block = 'copy-button';

  static TOOLTIP_CLASSNAME = 'copy-button__tooltip';

  constructor(rootElem) {
    this.onClick = this.onClick.bind(this);
    this.onTooltipAnimationEnd = this.onTooltipAnimationEnd.bind(this);

    this.button = rootElem;
    this.tooltip = this.button.getElementsByClassName(CopyButton.TOOLTIP_CLASSNAME)[0];

    this.button.addEventListener('click', this.onClick);
    this.tooltip.addEventListener('animationend', this.onTooltipAnimationEnd);
  }

  onClick() {
    Utils.copyText('+79161057526').catch((error) => {
      console.error('copy to clipboard error', error);
    });

    this.showTooltip();
  }

  onTooltipAnimationEnd() {
    this.hideTooltip();
  }

  showTooltip() {
    this.tooltip.style.display = 'block';
  }

  hideTooltip() {
    this.tooltip.style.display = null;
  }
}

class Gallery {
  static block = 'gallery';

  static IMAGE_CLASSNAME = 'gallery__image';

  constructor(rootElem) {
    this.image = rootElem.getElementsByClassName(Gallery.IMAGE_CLASSNAME)[0];

    this.image.style.backgroundImage = `url(${rootElem.dataset.image})`;
  }
}

init(Accordion);
init(ContactButton);
init(Slider);
init(CopyButton);
init(Gallery);
