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
    await this.createCards();
  }

  update() {
    // Component update logic (can be async)
  }

  async createCards() {
    for(let i = 0; i < 20; i++) {
      let card = document.createElement('div');
      card.textContent = `Cool${i}`;
      card.classList.add('card');

      card.addEventListener('click', () => {
        if (this.selectedCard) {
          this.selectedCard.classList.remove('selected');
        }
        this.selectedCard = card;
        card.classList.add('selected');

        this.onClickCallback();
      });

      this.$namesContainer.appendChild(card);
    }
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
