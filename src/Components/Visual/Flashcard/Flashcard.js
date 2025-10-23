export default class Flashcard extends HTMLElement {

   static props = {
      flipped: { 
         type: 'boolean', 
         default: false, 
         required: false 
      },
      frontName: { 
         type: 'string', 
         default: '', 
         required: false 
      },
      frontDescription: { 
         type: 'string', 
         default: '', 
         required: false 
      },
      backName: { 
         type: 'string', 
         default: '', 
         required: false 
      },
      backDescription: { 
         type: 'string', 
         default: '', 
         required: false 
      },
      onClickCallback: { 
         type: 'function', 
         default: null 
      },
      width: {
        type: 'string',
        default: '300px',
        required: false
      },
      height: {
        type: 'string',
        default: '200px',
        required: false
      },
      styleOverrides: {
        type: 'object',
        default: null
      }
   };

   constructor(props) {
      super();
      slice.attachTemplate(this);
      this.$container = this.querySelector('.flashcard_container');
      this.$flashcard = this.querySelector('.flashcard');
      this.$frontName = this.querySelector('.flashcard_front .flashcard_name');
      this.$frontDescription = this.querySelector('.flashcard_front .flashcard_description');
      this.$backName = this.querySelector('.flashcard_back .flashcard_name');
      this.$backDescription = this.querySelector('.flashcard_back .flashcard_description');
      
      this._flipped = false;
      this._onClickCallback = null;

      slice.controller.setComponentProps(this, props);
   }

   async init() {
      // Set up event listeners after props are set
      if (this._onClickCallback) {
         this.$flashcard.addEventListener('click', async () => await this._onClickCallback());
      }
   }

  // --- Getters/Setters ---

  get flipped() {
    return this._flipped;
  }

  set flipped(value) {
    this._flipped = value;
    
    if (value) {
        this.$flashcard.classList.add('flipped');
    } else {
        this.$flashcard.classList.remove('flipped');
    }
  }

  get frontName() {
    return this._frontName;
  }

  set frontName(value) {
    this._frontName = value || '';
    this.$frontName.textContent = this._frontName;
  }

  get frontDescription() {
    return this._frontDescription;
  }

  set frontDescription(value) {
    this._frontDescription = value || '';
    this.$frontDescription.textContent = this._frontDescription;
  }

  get backName() {
    return this._backName;
  }

  set backName(value) {
    this._backName = value || '';
    this.$backName.textContent = this._backName;
  }

  get backDescription() {
    return this._backDescription;
  }

  set backDescription(value) {
    this._backDescription = value || '';
    this.$backDescription.textContent = this._backDescription;
  }

  get onClickCallback() {
    return this._onClickCallback;
  }

  set onClickCallback(value) {
    this._onClickCallback = value;
  }

  get width() {
    return this._width;
  }

  set width(value) {
    if (!value) return;
    
    this._width = value;
    this.style.setProperty('--flashcard-width', value);
  }

  get height() {
    return this._height;
  }

  set height(value) {
  if (!value) return;
  
  this._height = value;
  this.style.setProperty('--flashcard-height', value);
  }

  set styleOverrides(overrides) {
    if (!overrides || !this.$flashcard) return;

    Object.entries(overrides).forEach(([property, value]) => {
        const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
        this.$flashcard.style.setProperty(cssProperty, value);
    });
  }

  // Public method to toggle flip state
  toggle() {
    this.flipped = !this.flipped;
  }

  // Public method to flip to front
  flipToFront() {
    this.flipped = false;
  }

  // Public method to flip to back
  flipToBack() {
    this.flipped = true;
  }
}

customElements.define('slice-flashcard', Flashcard);