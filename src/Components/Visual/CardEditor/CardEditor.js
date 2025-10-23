import { adduWord, getWord } from "../../../App/indexedDB.js";

export default class CardEditor extends HTMLElement {

  static props = {
    "selectedCardId": { 
      type: 'string', 
      default: null, 
      required: false 
    },
    "onClickCallback": { 
      type: 'function', 
      default: 'null', 
      required: true 
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

    this.ls = await slice.build('LocalStorageManager');

    const applyChangesButton = await slice.build('Button', {
      value: 'Save',
      icon: {
        name: 'file-check'
      },
      onClickCallback: async () =>{
        if (
          this.frontNameInput.value !='' && 
          this.backNameInput.value!='' &&  
          this.difficultySelector.value!=0 && 
          this.frontDescriptionInput.value!='' && 
          this.backDescriptionInput.value!=''){
          let deck = this.ls.getItem('deck');
          await adduWord(deck.lang, deck.deck, this.frontNameInput.value, this.backNameInput.value, this.difficultySelector.value, this.frontDescriptionInput.value, this.backDescriptionInput.value);
          this.onClickCallback();
        } else {
          console.log('All inputs must be filled and the star rating must be selected')
        }
      }
    });
    this.$applyChangesButtonContainer.appendChild(applyChangesButton);
  }

  async update(word) {
    if (!this.selectedCardId) return;
    let deck = this.ls.getItem('deck');
    let wordInfo = await getWord(deck.lang, deck.deck, word);
    this.frontNameInput.value = word;
    this.frontDescriptionInput.value = wordInfo.example;
    this.backNameInput.value = wordInfo.translation;
    this.backDescriptionInput.value = wordInfo.notes;
    this.difficultySelector.value = wordInfo.difficulty;
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