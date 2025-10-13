export default class RadioGroup extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    this.$container = this.querySelector('.radio-group-container');
    this.currentValue = this.initialValue || null; 
    
    this.childRadios = []; 
    
    slice.controller.setComponentProps(this, props);
  }
  
  async init() {
    if (!this.$container || !this.options || this.options.length === 0) {
      console.error("RadioGroup: Cannot initialize. Container or options are missing.");
      return;
    }

    this.$container.innerHTML = '';
    this.childRadios = [];  // Reset the list
    
    for (const option of this.options) {
      const isChecked = option.value === this.currentValue;
      
      const radioBtn = await slice.build('RadioButton', {
        value: option.value,
        label: option.label,
        checked: isChecked,
        
        // Pass the group's change handler to each button
        onChange: this._handleChildChange 
      });
      
      this.$container.appendChild(radioBtn);
      this.childRadios.push(radioBtn);
    }
  }

  _handleChildChange = (selectedValue) => {
    this.currentValue = selectedValue;
    
    this._enforceSingleSelection(selectedValue);
    
    // Execute the group's external onChange callback
    if (this.onChange) {
      this.onChange(selectedValue);
    }
  }

  /**
   * Iterates over all child radio components and sets their 'checked' property
   * based on the selectedValue.
   */
  _enforceSingleSelection(selectedValue) {
    this.childRadios.forEach(radio => {
      // Check if the current radio's value matches the selected one
      const shouldBeChecked = radio.value === selectedValue;

      // Programmatically update the child's state
      // This calls the 'set checked' method on the child component instance.
      if (radio.checked !== shouldBeChecked) {
        radio.checked = shouldBeChecked;
      }
    });
  }

  // --- Getters/Setters

  get options() { return this._options; }
  set options(arr) { this._options = arr; }
  
  get name() { return this._name; }
  set name(val) { this._name = val; }
  
  get initialValue() { return this._initialValue; }
  set initialValue(val) { this._initialValue = val; }
  
  get onChange() { return this._onChange; }
  set onChange(func) { this._onChange = func; }
}

customElements.define('slice-radio-group', RadioGroup);