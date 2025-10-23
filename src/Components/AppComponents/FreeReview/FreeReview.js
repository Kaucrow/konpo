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

    this.flashcard = await slice.build('Flashcard', {
      frontName: 'Cool',
      frontDescription: 'Something really cool',
      backName: '格好いい',
      backDescription: '絶対に、このアプリは緒格好いいよ！！！ OwO',
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
    // Component update logic (can be async)
  }

  // Add your custom methods here
}

customElements.define("slice-freereview", FreeReview);
