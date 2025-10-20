export default class Navbar extends HTMLElement {

  static props = {
    sections: {
      type: 'array',
      default: [],
      required: false
    },
    position: { 
      type: 'string', 
      default: 'static', 
      required: false 
    },
    direction: {
      type: 'string', 
      default: 'normal', 
      required: false 
    }
  };

constructor(props) {
  super();
  slice.attachTemplate(this);

  this.$header = this.querySelector('.slice_nav_header');
  this.$navBar = this.querySelector('.slice_nav_bar');
  this.$wideSectionsContainer = this.querySelector('.nav_bar_sections_wide');
  this.$mobileSectionsContainer = this.querySelector('.nav_bar_sections_mobile');
  this.$navBarExpanded = this.querySelector('.slice_nav_bar_expanded');

  this.$mobileButton = this.querySelector('.mobile_menu_button');
  this.$closeMenu = this.querySelector('.mobile_close_menu');

  this.$mobileButton.addEventListener('click', () => {
    document.body.classList.add('navbar-expanded');
    this.$navBarExpanded.classList.add('show');
    this.$closeMenu.classList.add('show');
    this.$mobileButton.classList.add('hide');
  });

  this.$closeMenu.addEventListener('click', () => {
    document.body.classList.remove('navbar-expanded');
    this.$navBarExpanded.classList.remove('show');
    this.$closeMenu.classList.remove('show');
    this.$mobileButton.classList.remove('hide');
  });

  slice.controller.setComponentProps(this, props);
}

  async init() {
    if (this.sections && this.sections.length > 0) {
      await this.renderSections();
    }
  }

  async renderSections() {
    if (this._sectionsRendered) return;

    if (!this.$wideSectionsContainer || !this.$mobileSectionsContainer) {
      console.error('Sections container(s) not found');
      return;
    }

    this.$wideSectionsContainer.innerHTML = '';

    for (const sectionGroup of this.sections) {
      if (Array.isArray(sectionGroup)) {
        await this.createSectionGroup(sectionGroup);
      }
    }

    this._sectionsRendered = true;
  }

  async createSectionGroup(elements) {
    const sectionGroup = document.createElement('div');
    sectionGroup.classList.add('nav-section-group');

    // Track which elements should go to mobile
    const mobileNavbarElements = [];
    const expandedNavbarElements = [];

    for (const elementConfig of elements) {
      const element = await this.createElement(elementConfig);
      if (element) {
        sectionGroup.appendChild(element);
        
        // If element should be in mobile navbar, add to mobile elements array
        if (elementConfig.mobileNavbar === true) {
          mobileNavbarElements.push(elementConfig);
        }
        
        if (elementConfig.expandedNavbar === true) {
          expandedNavbarElements.push(elementConfig);
        }
      }
    }

    this.$wideSectionsContainer.appendChild(sectionGroup);
    
    // If there are mobile elements, create a corresponding mobile section group
    if (mobileNavbarElements.length > 0) {
      await this.createMobileNavbarSectionGroup(mobileNavbarElements);
    }

    if (expandedNavbarElements.length > 0) {
      await this.createExpandedNavbarSectionGroup(expandedNavbarElements);
    }
  }

  async createMobileNavbarSectionGroup(elements) {
    if (!this.$mobileSectionsContainer) return;

    const mobileSectionGroup = document.createElement('div');
    mobileSectionGroup.classList.add('mobile-nav-section-group');

    for (const elementConfig of elements) {
      const mobileElement = await this.createElement(elementConfig);
      if (mobileElement) {
        mobileElement.classList.add('mobile-nav-item');
        mobileSectionGroup.appendChild(mobileElement);
      }
    }

    this.$mobileSectionsContainer.appendChild(mobileSectionGroup);
  }

  async createExpandedNavbarSectionGroup(elements) {
    if (!this.$navBarExpanded) return;

    const expandedSectionGroup = document.createElement('div');
    expandedSectionGroup.classList.add('expanded-nav-section-group');

    for (const elementConfig of elements) {
      const expandedElement = await this.createElement(elementConfig);
      if (expandedElement) {
        expandedElement.classList.add('expanded-nav-item');
        expandedSectionGroup.appendChild(expandedElement);
      }
    }

    this.$navBarExpanded.appendChild(expandedSectionGroup);
  }

  // --- Element creation functions ---

  async createElement(config) {
    if (!config || typeof config !== 'object') {
      console.warn(`Invalid element configuration: ${config}`);
      return null;
    }

    switch (config.type) {
      case 'logo': return await this.createLogo(config);
      case 'link': return await this.createLink(config);
      case 'dropdown': return await this.createDropdown(config);
      case 'button': return await this.createButton(config);
      case 'custom': return await this.createCustomElement(config);
      default: return await this.handleGenericElement(config);
    }
  }

  async createLogo(config) {
    const logoContainer = document.createElement('div');
    logoContainer.classList.add('logo-container');

    const logoLink = document.createElement('a');
    logoLink.classList.add('logo-link');
    logoLink.href = config.path || '/';

    const img = document.createElement('img');
    img.classList.add('logo-img');
    img.src = config.src;
    img.alt = config.alt || 'Logo';

    logoLink.appendChild(img);
    logoContainer.appendChild(logoLink);
    return logoContainer;
  }

  async createTextLink(config) {
    const link = await slice.build('Link', {
      text: config.text,
      path: config.path,
      classes: 'item nav-link',
    });

    const listItem = document.createElement('li');
    listItem.appendChild(link);

    const hover = document.createElement('div');
    hover.classList.add('anim-item');
    listItem.appendChild(hover);

    return listItem;
  }

  async createDropdown(config) {
    const dropdown = await slice.build('DropDown', {
      label: config.text,
      options: config.options
    });
    dropdown.classList.add('item', 'nav-dropdown');

    const listItem = document.createElement('li');
    listItem.appendChild(dropdown);

    const hover = document.createElement('div');
    hover.classList.add('anim-item');
    listItem.appendChild(hover);

    return listItem;
  }

  async createButton(config) {
    const button = await slice.build('Button', {
      value: config.value,
      variant: config.variant,
      icon: config.icon,
      onClickCallback: config.onClickCallback,
      styleOverrides: config.style
    });
    button.classList.add('nav-button');

    return button;
  }

  async createCustomElement(config) {
    if (config.html) {
      const container = document.createElement('div');
      container.innerHTML = config.html;
      return container.firstElementChild;
    }

    if (config.component) {
      return await slice.build(config.component, config.props || {});
    }

    return null;
  }

  async handleGenericElement(config) {
    if (config.text && config.path) {
      return await this.createTextLink(config);
    }

    if (config.value) {
      return await this.createButton(config);
    }

    console.warn('Unknown element configuration: ', config);
    return null;
  }

  // --- Getters/Setters ---

  get sections() {
    return this._sections;
  }

  set sections(value) {
    if (JSON.stringify(this._sections) !== JSON.stringify(value)) {
      this._sections = value;
      this._sectionsRendered = false;

      if (this.$sectionsContainer && this.isConnected) {
        this.renderSections(this.sections, this.$sectionsContainer, 'main');
        this._sectionsRendered = true;
      }
    }
  }

  get position() {
    return this._position;
  }

  set position(value) {
    this._position = value;
    if (value === 'fixed') {
      this.classList.add('nav_bar_fixed');
    }
  }

  get direction() {
    return this._direction;
  }

  set direction(value) {
    this._direction = value;
    if (value === 'reverse') {
      this.$header.classList.add('direction-row-reverse');
    }
  }
}

window.customElements.define('slice-nav-bar', Navbar);