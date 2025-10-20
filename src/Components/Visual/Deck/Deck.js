export default class Deck extends HTMLElement {
  static props = {
    "name": { 
      type: 'string', 
      default: null, 
      required: false 
    },
  }

  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
  }

  async init() {
    this.$name = this.querySelector('.deck-name');
    this.$button = this.querySelector('.deck-button');

    const name = await slice.build('Button', {
      value: this.name,
      variant: 'ghost',
      onClickCallback: () => {
        slice.router.navigate('/elatla');
      }
    });

    this.$name.appendChild(name);

    const button = await slice.build('Button', {
      value: '',
      variant: 'ghost',
      icon: {
        name: 'edit',
        size: 'large'
      }
    });

    this.$button.appendChild(button);
  }

  // --- Getters/Setters ---

  get name() {
    return this._name;
  }

  set name(val) {
    this._name = val;
  }
}

customElements.define("slice-deck", Deck);