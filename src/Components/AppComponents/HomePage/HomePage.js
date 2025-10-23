import { getLanguages, getLanguagesAndDecks } from "../../../App/indexedDB.js";

export default class HomePage extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);

    this.$homePageContainer = this.querySelector('.home-page-container');
    this.$deckListContainer = this.querySelector('.deck-list-container');
    this.$homeFooterCopyright = this.querySelector('.home-footer-copyright');

    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    await this.createDecks();      
  }

  async createDecks() {
    let languages = await getLanguagesAndDecks();

    const decks = []
    languages.forEach((lang) =>{
      //console.log(value);
      let items = []
      Object.entries(lang.deck).forEach(async ([key, value]) =>{
        const deckComponent = await slice.build('Deck', {name: key});
        let item = {
          value: deckComponent,
          onClickCallback: () => { console.log(`Opening deck ${key} from ${lang.id}`); }
        }
        items.push(item);
      })
      const deck ={
        value: lang.id,
        items:items
      }
      decks.push(deck);
    })

    const decksList = await slice.build('TreeView', {
      items: decks
    });

    this.$deckListContainer.appendChild(decksList);

    const githubLink = document.createElement('a');
    githubLink.href = 'https://github.com/Kaucrow/konpo';
    githubLink.classList.add('github-link');

    const githubButton = await slice.build('Button', {
      value: 'Github',
      variant: 'ghost',
      icon: {
        name: 'github'
      }
    });

    githubLink.appendChild(githubButton);

    this.$homeFooterCopyright.appendChild(githubLink);
  }
}

customElements.define('slice-home-page', HomePage);