import { adduDeck, adduLanguage, getDecks, getLanguages } from "../../../App/indexedDB.js";

export default class App extends HTMLElement {

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
    this.$app = this.querySelector('.app');

    // Create modes dialog
    const modesDialog = await this.createModesDialog();

    // Create add deck dialog
    const addDeckDialog = await this.createAddDeckDialog();

    // Create the navbar
    const navbar = await slice.build('Navbar', {
      position: 'fixed',
      sections: [
        [
          {
            mobileNavbar: true,
            type: 'logo',
            src: '/images/logo.png',
            path: '/'
          }
        ],
        [
          {
            expandedNavbar: true,
            type: 'button',
            value: 'Mode',
            variant: 'ghost',
            style: {
              '--button-primary-color': 'var(--primary-color-contrast)'
            },
            onClickCallback: () => {
              modesDialog.open = true;
            }
          },
          {
            expandedNavbar: true,
            type: 'button',
            value: 'Add a deck',
            variant: 'ghost',
            style: {
              '--button-primary-color': 'var(--primary-color-contrast)'
            },
            onClickCallback: () => {
              addDeckDialog.open = true;
            }
          }
        ],
        [
          {
            expandedNavbar: true,
            type: 'custom',
            component: 'Switch',
            props: {
              label: 'Dark Mode',
              customColor: 'var(--primary-color-contrast)',
              toggle: async (val) => {
                const currentTheme = slice.stylesManager.themeManager.currentTheme;
                if (currentTheme === 'Light') {
                  await slice.setTheme('Dark');
                } else {
                  await slice.setTheme('Light');
                }
              }
            }
          }
        ],
      ]
    });
  
    // Add the navbar at the start of the page
    this.insertBefore(navbar, this.firstChild);

    const multiRoute = await slice.build('MultiRoute', {
      routes: [
        { path: '/', component: 'HomePage' },
        { path: '/deck-edit', component: 'DeckEdit' }
      ]
    });

    this.$app.appendChild(multiRoute);
  }

  update() {
    // Component update logic (can be async)
  }

  async createModesDialog() {
    const modesDialogBody = document.createElement('div');

    const modesRadioOptions = [
      { label: 'Free mode: Browse all flashcards.', value: '0' },
      { label: 'Training mode: Study flashcards marked as "hard".', value: '1' },
      { label: 'Specific category mode: Study flashcards by category.', value: '2' },
    ];

    const modesRadio = await slice.build('RadioGroup', {
      options: modesRadioOptions,
      name: 'modes',
      initialValue: '0',
      onChange: (selectedVal) => {
        console.log(`Selected mode: ${selectedVal}`);
      }
    });

    const modesDialogTitle = document.createElement('h3');
    modesDialogTitle.textContent = 'Select a mode';
    modesDialogTitle.style = 'margin-left: 1em;';

    modesDialogBody.appendChild(modesDialogTitle);
    modesDialogBody.appendChild(modesRadio);

    const modesDialog = await slice.build('Dialog', {
      bodyElement: modesDialogBody
    });

    this.$app.appendChild(modesDialog);

    return modesDialog;
  }

  async createAddDeckDialog() {
    const addDeckDialog = await slice.build('Dialog', {});

    const addDeck1 = document.createElement('div');
    addDeck1.classList.add('add-deck-1');

    const addDeck1Title = document.createElement('h3');
    addDeck1Title.textContent = 'Add a deck';
    addDeck1Title.style = 'margin-left: 1em;';

    const addDeck1ButtonsContainer = document.createElement('div');
    addDeck1ButtonsContainer.classList.add('add-deck-1-buttons-container');

    const importDeckButton = await slice.build('Button', {
      value: "Import"
    });

    const createDeckButton = await slice.build('Button', {
      value: "Create new",
      onClickCallback: async () => {
        const createDeckContainer = await this.selectLanguage(addDeckDialog);
        addDeckDialog.bodyElement = createDeckContainer;
      }
    });

    addDeck1ButtonsContainer.appendChild(importDeckButton);
    addDeck1ButtonsContainer.appendChild(createDeckButton);

    addDeck1.appendChild(addDeck1Title);
    addDeck1.appendChild(addDeck1ButtonsContainer);
    
    addDeckDialog.bodyElement = addDeck1;

    addDeckDialog.onCloseCallback = () => {
      addDeckDialog.bodyElement = addDeck1;
    };

    this.$app.appendChild(addDeckDialog);

    return addDeckDialog;
  }

  async createDeck(addDeckDialog, language){
    const createDeckContainer = document.createElement('div');

    // Title
    const createDeckTitle = document.createElement('h3');
    createDeckTitle.textContent = 'Create a new deck';
    createDeckTitle.style = 'margin-left: 1em;';

    //Decks
    let decks = await getDecks(language);
    let items = []
    console.log('hola')
    console.log(decks);
    Object.keys(decks).forEach(val =>{
      let item = {value: val, path:""}
      items.push(item);
    })

    const treeview = await slice.build("TreeView", {
      items: items,
      onClickCallback: async (item) => {
          console.log("Clicked:", item.value);
      }
    });


    const createDeckContent = document.createElement('div');
    createDeckContent.classList.add('create-deck-content');

    const createDeckInput = await slice.build('Input', {
      placeholder: 'Deck name'
    });
    createDeckInput.style = 'min-width: 70%;';

    const submitDeckNameButton = await slice.build('Button', {
      value: 'Create deck',
      onClickCallback: () => {
        adduDeck(language, createDeckInput.value, 1);
        addDeckDialog.open = false;
      }
    });
    submitDeckNameButton.style = 'width: 100%';

    //apenddChilds

    createDeckContainer.appendChild(createDeckTitle);
    createDeckContainer.appendChild(treeview);

    createDeckContent.appendChild(createDeckInput);
    createDeckContent.appendChild(submitDeckNameButton);

    createDeckContainer.appendChild(createDeckContent);
    return createDeckContainer;
  }

  async selectLanguage (addDeckDialog) {
    const selectLanguageContainer = document.createElement('div');

    //title
    const title = document.createElement('h3');
    title.textContent = 'Select a Language';
    title.style = 'margin-left: 1em;';
    selectLanguageContainer.appendChild(title);

    // content
    const createLanguageContent = document.createElement('div');
    createLanguageContent.classList.add('create-deck-content');

    //Languages
    let languages = await getLanguages();
    let items = []
    Object.values(languages).forEach(val =>{
      let item = {value: val.id, path:""}
      items.push(item);
    })

    const treeview = await slice.build("TreeView", {
      items: items,
      onClickCallback: async (item) => {
          console.log("Clicked:", item.value);
          let decks = await this.createDeck(addDeckDialog, item.value);
          addDeckDialog.bodyElement = decks;
      }
    });
    selectLanguageContainer.appendChild(treeview);
    /*Object.values(languages).forEach(val=>{
      let languageName = document.createElement('h4');
      languageName.textContent = val.name;
      languageName.style = 'margin-left: 1em;';
      selectLanguageContainer.appendChild(languageName);
    })*/

    // Input
    const addLanguageInput = await slice.build('Input', {
      placeholder: 'New Language :D'
    });
    addLanguageInput.style = 'min-width: 70%;';

    const submitNewLanguage = await slice.build('Button', {
      value: 'Add Language',
      onClickCallback: async () => {
        await adduLanguage(addLanguageInput.value);
        let decks = await this.createDeck(addDeckDialog, addLanguageInput.value);
        addDeckDialog.bodyElement = decks;
      }
    });

    // apendChilds
    createLanguageContent.appendChild(addLanguageInput);
    createLanguageContent.appendChild(submitNewLanguage);

    selectLanguageContainer.appendChild(createLanguageContent);
    return selectLanguageContainer;
  }
}

customElements.define("slice-app", App);