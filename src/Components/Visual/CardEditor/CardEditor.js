import { adduWord } from "../../../App/indexedDB.js";

export default class CardEditor extends HTMLElement {

  static props = {
    "selectedCardId": { 
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
    this.$frontNameContainer = this.querySelector('.front-name-container');
    this.$frontDescriptionContainer = this.querySelector('.front-description-container');
    this.$backNameContainer = this.querySelector('.back-name-container');
    this.$backDescriptionContainer = this.querySelector('.back-description-container');
    this.$difficultyContainer = this.querySelector('.difficulty-container');

    this.$applyChangesButtonContainer = this.querySelector('.apply-changes-button-container');

    this.frontNameInput = await slice.build('Input', {});
    this.$frontNameContainer.appendChild(this.frontNameInput);

    this.frontDescriptionInput = await slice.build('Input', {});
    this.$frontDescriptionContainer.appendChild(this.frontDescriptionInput);

    this.backNameInput = await slice.build('Input', {});
    this.$backNameContainer.appendChild(this.backNameInput);

    this.backDescriptionInput = await slice.build('Input', {});
    this.$backDescriptionContainer.appendChild(this.backDescriptionInput);

    this.difficultySelector = await slice.build('StarRating', {});
    this.$difficultyContainer.appendChild(this.difficultySelector);

    let ls = await slice.build('LocalStorageManager');

    const applyChangesButton = await slice.build('Button', {
      value: 'Save',
      icon: {
        name: 'file-check'
      },
      onClickCallback: () =>{
        if (
          this.frontNameInput.value !='' && 
          this.backNameInput.value!='' &&  
          this.difficultySelector.value!=0 && 
          this.frontDescriptionInput.value!='' && 
          this.backDescriptionInput.value!=''){
          let deck = ls.getItem('deck');
          adduWord(deck.lang, deck.deck, this.frontNameInput.value, this.backNameInput.value, this.difficultySelector.value, this.frontDescriptionInput.value, this.backDescriptionInput.value)
        } else {
          console.log('All inputs must be filled and the star rating must be selected')
        }
      }
    });
    this.$applyChangesButtonContainer.appendChild(applyChangesButton);
  }

  update() {
    if (!this.selectedCardId) return;

    this.frontNameInput.value = 'Cool';
    this.frontDescriptionInput.value = 'Something really cool';
    this.backNameInput.value = '格好いい';
    this.backDescriptionInput.value = '絶対に、このアプリは超格好いいよ！！！ OwO';
  }

  // --- Getters/Setters ---

  get selectedCardId() {
    return this._selectedCardId;
  }

  set selectedCardId(val) {
    this._selectedCardId = val;
  }
}

customElements.define("slice-cardeditor", CardEditor);