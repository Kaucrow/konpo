export default class DeckEdit extends HTMLElement {

  static props = {
    // Define your component props here
    // Example: 
    /*
    "value": { 
         type: 'string', 
         default: 'Button', 
         required: false 
      },
    */
  }

  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
  }

  async init() {
    this.$cardListContainer = this.querySelector('.card-list-container');

    const cardList = await slice.build('CardList', {});

    this.$cardListContainer.appendChild(cardList);
  }

  update() {
    // Component update logic (can be async)
  }

  // Add your custom methods here
}

customElements.define("slice-deckedit", DeckEdit);
