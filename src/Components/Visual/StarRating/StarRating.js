export default class StarRating extends HTMLElement {

  static props = {
    value: { 
      type: 'number',
      default: 0, 
      required: false 
    },
    onChangeCallback: { 
      type: 'function',
      default: null 
    },
    size: {
      type: 'string',
      default: '24px',
      required: false
    },
    readOnly: {
      type: 'boolean',
      default: false,
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
    this.$stars = this.querySelector('.slice_starrating_stars');
    this.$container = this.querySelector('.slice_starrating_container');
    
    this._value = 0;
    this._readOnly = false;

    slice.controller.setComponentProps(this, props);
    
    this._createStars();
  }

  _createStars() {
    // Clear existing stars
    this.$stars.innerHTML = '';
    
    // Create 5 stars
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.classList.add('slice_starrating_star');
      star.innerHTML = '★';
      star.dataset.value = i;
      
      if (!this._readOnly) {
        star.addEventListener('click', () => this._handleStarClick(i));
      }
      
      this.$stars.appendChild(star);
    }
    
    this._updateStars();
  }

  _handleStarClick(value) {
    if (this._readOnly) return;
    
    this.value = value;
    
    if (this.onChangeCallback) {
      this.onChangeCallback(value);
    }
  }

  _updateStars() {
    const stars = this.$stars.querySelectorAll('.slice_starrating_star');
    
    stars.forEach((star, index) => {
      if (index < this._value) {
        star.classList.add('active');
      } else {
        star.classList.remove('active');
      }
    });
  }

  // --- Getters/Setters ---

  get value() {
    return this._value;
  }

  set value(value) {
    if (value < 0 || value > 5) return;
    
    this._value = value;
    this._updateStars();
  }

  get readOnly() {
    return this._readOnly;
  }

  set readOnly(value) {
    this._readOnly = value;
    
    // Update cursor style and event listeners
    const stars = this.$stars.querySelectorAll('.slice_starrating_star');
    stars.forEach(star => {
      if (value) {
        star.style.cursor = 'default';
        star.removeEventListener('click', this._handleStarClick);
      } else {
        star.style.cursor = 'pointer';
        star.addEventListener('click', (e) => {
          this._handleStarClick(parseInt(e.currentTarget.dataset.value));
        });
      }
    });
  }

  get size() {
    return this._size;
  }

  set size(value) {
    if (!value) return;
    
    this._size = value;
    this.style.setProperty('--starrating-size', value);
  }

  set styleOverrides(overrides) {
    if (!overrides || !this.$stars) return;

    Object.entries(overrides).forEach(([property, value]) => {
      const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
      this.$stars.style.setProperty(cssProperty, value);
    });
  }
}

customElements.define('slice-starrating', StarRating);