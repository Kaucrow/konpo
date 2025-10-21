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

    this.$applyChangesButtonContainer = this.querySelector('.apply-changes-button-container');

    this.frontNameInput = await slice.build('Input', {});
    this.$frontNameContainer.appendChild(this.frontNameInput);

    this.frontDescriptionInput = await slice.build('Input', {});
    this.$frontDescriptionContainer.appendChild(this.frontDescriptionInput);

    this.backNameInput = await slice.build('Input', {});
    this.$backNameContainer.appendChild(this.backNameInput);

    this.backDescriptionInput = await slice.build('Input', {});
    this.$backDescriptionContainer.appendChild(this.backDescriptionInput);

    const applyChangesButton = await slice.build('Button', {
      value: 'Save',
      icon: {
        name: 'file-check'
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