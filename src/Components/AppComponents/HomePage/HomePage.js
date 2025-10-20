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
    const testDeck = await slice.build('Deck', { name: 'Deck 1' });

    const decks = [
      {
        value: 'French',
        items: [
          {
            value: testDeck,
            onClickCallback: () => { console.log('Opening French deck 1...'); }
          },
          {
            value: 'Deck 2',
            onClickCallback: () => { console.log('Opening French deck 2...'); }
          }
        ]
      },
      {
        value: 'Japanese',
        items: [
          {
            value: 'Deck 1',
            onClickCallback: () => { console.log('Opening French deck 1...'); }
          },
          {
            value: 'Deck 2',
            onClickCallback: () => { console.log('Opening French deck 2...'); }
          }
        ]
      }
    ];

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