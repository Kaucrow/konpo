export default class Dialog extends HTMLElement {

  // Define properties for the component
  static props = {
    // boolean to control the visibility of the dialog
    open: {
      type: 'boolean',
      default: false,
      required: false
    },
    openerElement: {
      type: 'object',
      default: null
    },
    bodyElement: {
      type: 'object',
      default: null
    },
    // function to be called when the dialog is opened
    onOpenCallback: {
      type: 'function',
      default: null
    },
    // function to be called when the dialog is closed
    onCloseCallback: {
      type: 'function',
      default: null
    }
  };

  constructor(props) {
    super();
    slice.attachTemplate(this);

    this.$content = this.querySelector('.slice_dialog_content');
    this.$bodySlot = this.querySelector('.slice_dialog_body_slot');

    this._transitionTimeout = null;

    slice.controller.setComponentProps(this, props);
  }

  async init() {
    // --- DOM references ---
    this.$container = this.querySelector('.slice_dialog');
    this.$overlay = this.querySelector('.slice_dialog_overlay');
    this.$content = this.querySelector('.slice_dialog_content');
    this.$openerSlot = this.querySelector('.slice_dialog_opener_slot');
    this.$closeButtonContainer = this.querySelector('.slice_dialog_close_button_container');

    // --- Properties ---
    this.$content.inert = true;
    this.$container.style.display = 'none';

    // --- Element children ---
    if (this.$closeButtonContainer) {
      const closeButtonIcon = await slice.build('Icon', {
        name: 'close-circle',
        size: 'medium',
        color: 'var(--primary-color)'
      });
      closeButtonIcon.classList = 'slice_dialog_close_button';
      this.$closeButtonContainer.appendChild(closeButtonIcon);
    } else {
      console.error("Dialog: Could not find close button container.");
    }

    // --- Event listeners ---
    this.$closeButtonContainer.addEventListener('click', () => this.close());
    this.$overlay.addEventListener('click', () => this.close());
  }

  update() {
    // Component update logic (can be async)
  }

  _handleOpenerClick = () => {
    this.open = true;
  }

  // --- Public methods ---
  open() {
    this.open = true;
  }

  close() {
    this.open = false;
  }

  // --- Getters/Setters ---
  get open() {
    return this._open;
  }

  set open(val) {
    // Clear any existing timeouts
    clearTimeout(this._transitionTimeout);
    
    // Only proceed if the state is actually changing
    if (this._open === !!val) return;
    
    this._open = !!val;

    if (this._open) {
      // Make the container visible but transparent
      this.$container.style.display = 'block';

      // Force reflow
      this.$container.offsetHeight;

      // Set the data-state (trigger the transition)
      this.setAttribute('data-state', 'open');

      // Enable interaction and focus
      this.$content.inert = false;
      this.$content.focus();

      document.body.style.overflow = 'hidden';
      this.onOpenCallback?.();
    } else {
      // Remove data-state to trigger closing transition
      this.removeAttribute('data-state');

      // Wait for transition to complete before hiding
      this._transitionTimeout = setTimeout(() => {
        this.$container.style.display = 'none';
        this.$content.inert = true;
        document.body.style.overflow = '';
        this.onCloseCallback?.();
        this._openerElement?.focus();
      }, 200);
    }
  } 

  get openerElement() {
    return this._openerElement;
  }

  set openerElement(element) {
    if (!element) return;

    this._openerElement = element;

    element.setAttribute('slot', 'opener');

    this.appendChild(element);

    this._openerElement.addEventListener('click', this._handleOpenerClick);
  }

  get bodyElement() {
    return this._bodyElement;
  }

  set bodyElement(element) {
    if (!element) return;

    this._bodyElement = element;

    element.setAttribute('slot', 'body');

    this.$bodySlot.appendChild(element);
  }
}

customElements.define("slice-dialog", Dialog);