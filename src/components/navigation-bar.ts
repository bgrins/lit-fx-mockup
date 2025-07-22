import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('navigation-bar')
export class NavigationBar extends LitElement {
  @property({ type: String })
  url = 'wikipedia.org';

  @state()
  private inputValue = '';

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      height: 100%;
      gap: 8px;
      width: 100%;
    }

    .nav-button {
      width: 28px;
      height: 28px;
      border: none;
      background: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      color: var(--firefox-icon-secondary);
      transition:
        background 0.2s,
        color 0.2s;
      position: relative;
    }

    .nav-button:hover:not(:disabled) {
      background: var(--firefox-hover);
      color: var(--firefox-icon-hover);
    }

    .nav-button:disabled {
      color: var(--firefox-icon-disabled);
      cursor: not-allowed;
    }

    .nav-button svg,
    .nav-button img {
      width: 16px;
      height: 16px;
      -moz-context-properties: fill;
      fill: currentColor;
    }

    /* Icon mask approach for better theme support */
    .icon-mask {
      width: 16px;
      height: 16px;
      display: inline-block;
      background-color: currentColor;
      mask-size: 16px;
      mask-repeat: no-repeat;
      mask-position: center;
    }

    .urlbar-container {
      flex: 1;
      height: var(--urlbar-height);
      background: var(--firefox-tab-bg);
      border-radius: 4px;
      display: flex;
      align-items: center;
      padding: 0 8px;
      gap: 8px;
      transition: outline 0.2s;
      outline: 2px solid transparent;
      outline-offset: -2px;
    }

    .urlbar-container:focus-within {
      outline-color: var(--firefox-accent);
      background: var(--firefox-tab-active-bg);
    }

    .urlbar-input {
      flex: 1;
      border: none;
      background: none;
      color: var(--firefox-text);
      font-size: 14px;
      outline: none;
      font-family: inherit;
    }

    .urlbar-input::placeholder {
      color: var(--firefox-text-secondary);
    }

    .lock-icon {
      width: 14px;
      height: 14px;
      color: #30e60b;
    }

    .nav-end {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .separator {
      width: 1px;
      height: 20px;
      background: rgba(255, 255, 255, 0.2);
      margin: 0 4px;
    }
  `;

  render() {
    return html`
      <!-- Navigation buttons -->
      <button class="nav-button" @click=${this.handleBack} disabled>
        <span
          class="icon-mask"
          style="mask-image: url(/assets/browser/themes/shared/icons/back.svg);"
          role="img"
          aria-label="Back"
        ></span>
      </button>
      <button class="nav-button" @click=${this.handleForward} disabled>
        <span
          class="icon-mask"
          style="mask-image: url(/assets/browser/themes/shared/icons/forward.svg);"
          role="img"
          aria-label="Forward"
        ></span>
      </button>
      <button class="nav-button" @click=${this.handleRefresh}>
        <span
          class="icon-mask"
          style="mask-image: url(/assets/toolkit/themes/shared/icons/reload.svg);"
          role="img"
          aria-label="Refresh"
        ></span>
      </button>
      <button class="nav-button" @click=${this.handleHome}>
        <span
          class="icon-mask"
          style="mask-image: url(/assets/browser/themes/shared/icons/home.svg);"
          role="img"
          aria-label="Home"
        ></span>
      </button>

      <!-- URL Bar -->
      <div class="urlbar-container">
        <svg class="lock-icon" viewBox="0 0 16 16" fill="currentColor">
          <path d="M11 6V4a3 3 0 00-6 0v2H4v8h8V6h-1zM7 4a1 1 0 012 0v2H7V4z" />
        </svg>
        <input
          class="urlbar-input"
          type="text"
          .value=${this.inputValue || this.url}
          @input=${this.handleInput}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur}
          @keydown=${this.handleKeyDown}
          placeholder="Search with Google or enter address"
        />
      </div>

      <!-- End buttons -->
      <div class="nav-end">
        <button class="nav-button" title="Extensions">
          <span
            class="icon-mask"
            style="mask-image: url(/assets/toolkit/themes/shared/extensions/extension.svg);"
            role="img"
            aria-label="Extensions"
          ></span>
        </button>
        <div class="separator"></div>
        <button class="nav-button" title="Account">
          <span
            class="icon-mask"
            style="mask-image: url(/assets/browser/themes/shared/fxa/avatar.svg);"
            role="img"
            aria-label="Account"
          ></span>
        </button>
        <button
          class="nav-button menu-button"
          title="Open application menu"
          @click=${this.handleMenuClick}
        >
          <span
            class="icon-mask"
            style="mask-image: url(/assets/browser/themes/shared/icons/menu.svg);"
            role="img"
            aria-label="Menu"
          ></span>
        </button>
      </div>
    `;
  }

  private handleBack() {
    this.dispatchEvent(new CustomEvent('navigate-back', { bubbles: true, composed: true }));
  }

  private handleForward() {
    this.dispatchEvent(new CustomEvent('navigate-forward', { bubbles: true, composed: true }));
  }

  private handleRefresh() {
    this.dispatchEvent(new CustomEvent('refresh', { bubbles: true, composed: true }));
  }

  private handleHome() {
    this.dispatchEvent(new CustomEvent('navigate-home', { bubbles: true, composed: true }));
  }

  private handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.inputValue = input.value;
  }

  private handleFocus() {
    // Focus handling
  }

  private handleBlur() {
    // Blur handling
  }

  private handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.dispatchEvent(
        new CustomEvent('navigate', {
          detail: { url: this.inputValue || this.url },
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  private handleMenuClick() {
    this.dispatchEvent(
      new CustomEvent('menu-clicked', {
        bubbles: true,
        composed: true,
      })
    );
  }
}
