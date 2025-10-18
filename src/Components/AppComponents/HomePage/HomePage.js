export default class HomePage extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);

    this.$examplesContainer = this.querySelector('.examples-container');
    this.$homePageContainer = this.querySelector('.home-page-container');
    this.$deckListContainer = this.querySelector('.deck-list-container');

    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
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

    this.$homePageContainer.appendChild(modesDialog);

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

    await this.createDecks();      

    // Crear features section con un enfoque diferente (sin usar Cards)
    await this.createFeatures();
    
    // Crear ejemplos de componentes
    await this.createComponentExamples();
    
    // Configurar la sección de código de inicio
    await this.setupGettingStartedSection();
    
    // Añadir la barra de navegación al inicio del componente
    this.insertBefore(navbar, this.firstChild);
  }

  async createDecks() {
    const decks = [
      {
        value: 'French',
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
  }

  async createFeatures() {
    // Definir características
    const features = [
        {
          title: 'Component-Based',
          description: 'Build your app using modular, reusable components following web standards.'
        },
        {
          title: 'Zero Dependencies',
          description: 'Built with vanilla JavaScript. No external libraries required.'
        },
        {
          title: 'Easy Routing',
          description: 'Simple and powerful routing system for single page applications.'
        },
        {
          title: 'Theme System',
          description: 'Built-in theme support with easy customization through CSS variables.'
        },
        {
          title: 'Developer Tools',
          description: 'Integrated debugging and logging for faster development.'
        },
        {
          title: 'Performance Focused',
          description: 'Lightweight and optimized for fast loading and execution.'
        }
    ];
    
    const featureGrid = this.querySelector('.feature-grid');
    
    // Crear y añadir cada feature como un elemento HTML simple
    for (const feature of features) {
        const featureElement = document.createElement('div');
        featureElement.classList.add('feature-item');
        
        const featureTitle = document.createElement('h3');
        featureTitle.textContent = feature.title;
        featureTitle.classList.add('feature-title');
        
        const featureDescription = document.createElement('p');
        featureDescription.textContent = feature.description;
        featureDescription.classList.add('feature-description');
        
        featureElement.appendChild(featureTitle);
        featureElement.appendChild(featureDescription);
        
        featureGrid.appendChild(featureElement);
    }
  }
  
  async createComponentExamples() {
    // Crear ejemplos para demostrar componentes
    const inputExample = await slice.build('Input', {
        placeholder: 'Try typing here...',
        type: 'text'
    });
    
    const switchExample = await slice.build('Switch', {
        label: 'Toggle me',
        checked: true
    });
    
    const checkboxExample = await slice.build('Checkbox', {
        label: 'Check me',
        labelPlacement: 'right'
    });
    
    const detailsExample = await slice.build('Details', {
        title: 'Click to expand',
        text: 'This is a collapsible details component that can contain any content.'
    });
    
    // Crear sección para cada ejemplo
    const exampleSections = [
        { title: 'Input Component', component: inputExample },
        { title: 'Switch Component', component: switchExample },
        { title: 'Checkbox Component', component: checkboxExample },
        { title: 'Details Component', component: detailsExample }
    ];
    
    // Añadir cada ejemplo a la sección de ejemplos
    for (const section of exampleSections) {
        const container = document.createElement('div');
        container.classList.add('example-item');
        
        const title = document.createElement('h3');
        title.textContent = section.title;
        
        container.appendChild(title);
        container.appendChild(section.component);
        
        this.$examplesContainer.appendChild(container);
    }
  }
  
  async setupGettingStartedSection() {
    // Opcionalmente podríamos mejorar esta sección usando el CodeVisualizer component
    // en lugar del código HTML estático en el template
    const codeVisualizer = await slice.build('CodeVisualizer', {
        value: `// Initialize a new Slice.js project
npm run slice:init

// Create a new component
npm run slice:create

// Start your application
npm run slice:start`,
        language: 'bash'
    });
    
    const codeSample = this.querySelector('.code-sample');
    codeSample.innerHTML = ''; // Clear the static code sample
    codeSample.appendChild(codeVisualizer);
  }
}

customElements.define('slice-home-page', HomePage);