import { getWords } from "../../../App/indexedDB.js";

export default class FreeReview extends HTMLElement {

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
    this.$freeReviewContainer = this.querySelector('.freereview-container');
    this.ls = await slice.build('LocalStorageManager');
    let selectedOption = this.ls.getItem('playingDeck');

    let words = await getWords(selectedOption.lang, selectedOption.deck);

    let keys = Object.keys(words);
    let randomKey = keys[Math.floor(Math.random() * keys.length)];

    this.flashcard = await slice.build('Flashcard', {
      frontName: randomKey,
      frontDescription: words[randomKey].example,
      backName: words[randomKey].translation,
      backDescription: words[randomKey].notes,
      width: '60vw',
      height: '60vh',
      styleOverrides: {
        '--flashcard-font-size': '2em'
      }
    });

    this.flashcardFlipButton = await slice.build('Button', {
      value: 'Flip',
      styleOverrides: {
        '--button-default-padding': '1em 4em'
      },
      onClickCallback: () => {
        this.flashcard.toggle();
      }
    });
    this.flashcardFlipButton.classList.add('flashcard-flip-button');

    this.$freeReviewContainer.appendChild(this.flashcard);
    this.$freeReviewContainer.appendChild(this.flashcardFlipButton);
  }

  update() {
    this.$freeReviewContainer.innerHTML = ''
    this.init();
  }

  // Add your custom methods here
}

customElements.define("slice-freereview", FreeReview);
