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
    this.$cardEditorContainer = this.querySelector('.card-editor-container');
    this.$addCardButtonContainer = this.querySelector('.add-card-button-container');

    const cardEditor = await slice.build('CardEditor', {});

    const cardList = await slice.build('CardList', {
      onClickCallback: () => {
        cardEditor.selectedCardId = 10;
        cardEditor.update();
      }
    });

    this.$cardListContainer.appendChild(cardList);

    const addCardButton = await slice.build('Button', {
      value: 'Add card',
      icon: {
        name: 'circle-plus'
      }
    });
    this.$addCardButtonContainer.appendChild(addCardButton);

    this.$cardEditorContainer.appendChild(cardEditor);

  }

  update() {
    // Component update logic (can be async)
  }

  // Add your custom methods here
}

customElements.define("slice-deckedit", DeckEdit);
