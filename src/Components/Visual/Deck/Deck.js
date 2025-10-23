export default class Deck extends HTMLElement {
  static props = {
    "name": { 
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
    this.$name = this.querySelector('.deck-name');
    this.$button = this.querySelector('.deck-button');

    const name = await slice.build('Button', {
      value: this.name,
      variant: 'ghost',
      onClickCallback: () => {
        slice.router.navigate(`/decks/${this.name.toLowerCase().replace(/\s+/g, '-')}`);
      }
    });

    this.$name.appendChild(name);

    const editDialog = await this.createEditDialog();

    const editButton = await slice.build('Button', {
      variant: 'ghost',
      icon: {
        name: 'edit',
        size: 'large'
      },
      onClickCallback: () => { editDialog.open = true; }
    });

    this.appendChild(editDialog);
    this.$button.appendChild(editButton);
  }

  async createEditDialog() {
    const editDialogBodyContainer = document.createElement('div');

    const editDialogTitle = document.createElement('h3');
    editDialogTitle.textContent = this.name;

    editDialogBodyContainer.appendChild(editDialogTitle);

    const editDialogButtonsContainer = document.createElement('div');
    editDialogButtonsContainer.classList.add('edit-dialog-buttons-container');

    const exportButton = await slice.build('Button', {
      value: 'Export'
    });

    const editButton = await slice.build('Button', {
      value: 'Edit',
      onClickCallback: () => {
        editDialog.open = false;
        slice.router.navigate(`/deck-edit/${this.name.toLowerCase().replace(/\s+/g, '-')}`);
      }
    });

    editDialogButtonsContainer.appendChild(exportButton);
    editDialogButtonsContainer.appendChild(editButton);

    editDialogBodyContainer.appendChild(editDialogButtonsContainer);

    const editDialog = await slice.build('Dialog', {
        bodyElement: editDialogBodyContainer
      }
    );

    return editDialog;
  }

  // --- Getters/Setters ---

  get name() {
    return this._name;
  }

  set name(val) {
    this._name = val;
  }
}

customElements.define("slice-deck", Deck);