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

    const cardEditor = await slice.build('CardEditor', {onClickCallback:()=>{cardList.update()}});

    const cardList = await slice.build('CardList', {
      onClickCallback: (word) => {
        cardEditor.selectedCardId = 10;
        cardEditor.update(word);
      }
    });

    this.$cardListContainer.appendChild(cardList);

    const addCardBody = document.createElement('div');
    addCardBody.classList.add('add-card-body');

    const addCardEditor = await slice.build('CardEditor', {onClickCallback:()=>{cardList.update()}});

    const addCardBodyTitle = document.createElement('h3');
    addCardBodyTitle.textContent = 'Add card';

    addCardBody.appendChild(addCardBodyTitle);
    addCardBody.appendChild(addCardEditor);

    const addCardDialog = await slice.build('Dialog', {
      bodyElement: addCardBody      
    });
    addCardDialog.classList.add('add-card-dialog');

    this.appendChild(addCardDialog);

    const addCardButton = await slice.build('Button', {
      value: 'Add card',
      icon: {
        name: 'circle-plus'
      },
      onClickCallback: () => {
        addCardDialog.open = true;
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
