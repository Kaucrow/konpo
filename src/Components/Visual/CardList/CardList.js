import { getWords } from "../../../App/indexedDB.js";

export default class CardList extends HTMLElement {

  static props = {
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
    this.$namesContainer = this.querySelector('.names-container');
    this.ls = await slice.build('LocalStorageManager')
    await this.createCards();
  }

  update() {
    // Component update logic (can be async)
    this.$namesContainer.innerHTML = ''
    this.createCards();
  }

  async createCards() {
    let deck = this.ls.getItem('deck')
    let words = await getWords(deck.lang, deck.deck);
    console.log(words);
    Object.keys(words).forEach(key =>{
      let card = document.createElement('div');
      card.textContent = `${key}`;
      card.classList.add('card');

      card.addEventListener('click', () => {
        if (this.selectedCard) {
          this.selectedCard.classList.remove('selected');
        }
        this.selectedCard = card;
        card.classList.add('selected');

        this.onClickCallback(card.textContent);
      });

      this.$namesContainer.appendChild(card);
    })
  }

  // --- Getters/Setters ---

  get selectedCardId() {
    return this._selectedCardId;
  }

  set selectedCardId(val) {
    if (!val) return;
    this._selectedCardId = val;
  }
}

customElements.define("slice-cardlist", CardList);
