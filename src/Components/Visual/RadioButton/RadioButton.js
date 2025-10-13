export default class RadioButton extends HTMLElement {
  static props = {
    // The value submitted when the form is used
    value: {
      type: 'string',
      default: '',
      required: true
    },
    // The display label
    label: {
      type: 'string',
      default: 'Option',
      required: false
    },
    // The checked state (boolean)
    checked: {
      type: 'boolean',
      default: false,
      required: false
    },
    // Callback function when the state changes
    onChange: {
      type: 'function',
      default: null
    }
  };

  constructor(props) {
    super();
    slice.attachTemplate(this);
    
    // Element references
    this.$container = this.querySelector('.slice_radio_container');
    this.$input = this.querySelector('.slice_radio_input');
    this.$label = this.querySelector('.slice_radio_label');
    
    // Event listener for state changes (using the visual container for click area)
    this.$container.addEventListener('click', this._handleClick);

    slice.controller.setComponentProps(this, props);
  }
  
  // Custom click handler to prevent default radio behavior 
  // and correctly set the state before dispatching the change
  _handleClick = () => {
    // Only toggle if currently unchecked
    if (!this.checked) {
      this.checked = true; 
      
      // Notify the parent group and pass the new value
      // The parent group will now coordinate the unchecking of siblings
      if (this.onChange) {
        this.onChange(this.value); 
      }
    }
  }
  
  // --- Getters/Setters ---

  get value() { return this._value; }
  set value(val) {
    this._value = val;
    this.$input.value = val;
  }

  get label() { return this._label; }
  set label(val) {
    this._label = val;
    this.$label.textContent = val;
  }

  get checked() { return this._checked; }
  set checked(val) {
    this._checked = !!val;
    this.$input.checked = this._checked;
    
    // Update visual state using a class or attribute
    if (this._checked) {
      this.setAttribute('data-checked', 'true');
    } else {
      this.removeAttribute('data-checked');
    }
  }
}

customElements.define('slice-radio-button', RadioButton);