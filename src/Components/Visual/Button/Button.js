export default class Button extends HTMLElement {

   static props = {
      value: { 
         type: 'string', 
         default: null, 
         required: false 
      },
      onClickCallback: { 
         type: 'function', 
         default: null 
      },
      icon: { 
         type: 'object', 
         default: null 
      },
      variant: {
        type: 'string',
        default: 'default',
        required: false,
        validator: (val) => ['default', 'ghost'].includes(val.toLowerCase()) 
      },
      styleOverrides: {
        type: 'object',
        default: null
      }
   };

   constructor(props) {
      super();
      slice.attachTemplate(this);
      this.$value = this.querySelector('.slice_button_value');
      this.$button = this.querySelector('.slice_button');
      this.$container = this.querySelector('.slice_button_container');
      
      if (props.onClickCallback) {
         this.onClickCallback = props.onClickCallback;
         this.$container.addEventListener('click', async () => await this.onClickCallback());
      }

      this._variant = 'default';

      slice.controller.setComponentProps(this, props);
   }

   async init() {
      if (this.icon) {
         this.$icon = await slice.build('Icon', {
            name: this.icon.name,           // ✅ CORREGIDO: usar this.icon.name
            iconStyle: this.icon.iconStyle, // ✅ AÑADIDO: pasar también iconStyle
            size: this.icon.size || '20px',
            color: 'currentColor',
         });
         this.$button.insertBefore(this.$icon, this.$value);
         this.$icon.classList.add('slice_button_icon');
      }
   }

  _handleAnimItem() {
    const existingAnim = this.$button.querySelector('.slice_button_anim_item');
    
    if (this._variant === 'ghost') {
      // If it's a ghost button and the anim element doesn't exist, create it.
      if (!existingAnim) {
        const animItem = document.createElement('div');
        animItem.classList.add('slice_button_anim_item');
        this.$button.appendChild(animItem);
      }
    } else {
      // If it's not a ghost button and the anim element exists, remove it.
      if (existingAnim) {
        this.$button.removeChild(existingAnim);
      }
    }
  }

  // --- Getters/Setters ---

  get icon() {
    return this._icon;
  }

  set icon(value) {
    if (!value) return;

    this._icon = value;
    if (!this.$icon) return;
    this.$icon.name = value.name;
    this.$icon.iconStyle = value.iconStyle;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    if (!value) return;

    console.log(value);
    this._value = value;
    this.$value.textContent = value;
  }

  get variant() {
    return this._variant;
  }

  set variant(val) {
    if (!val) return;

    if (this._variant && this.$button) {
      this.$button.classList.remove(`variant-${this._variant}`);
    }
    
    this._variant = val;

    if (this.$button) {
      this.$button.classList.add(`variant-${this._variant}`);
      this._handleAnimItem();
    }
  }

  set styleOverrides(overrides) {
    if (!overrides || !this.$button) return;

    Object.entries(overrides).forEach(([property, value]) => {
      const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
      this.$button.style.setProperty(cssProperty, value);
    });
  }
}

customElements.define('slice-button', Button);