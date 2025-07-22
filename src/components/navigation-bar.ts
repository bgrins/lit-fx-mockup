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
      color: var(--firefox-text-secondary);
      transition: background 0.2s;
      position: relative;
    }

    .nav-button:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
    }

    .nav-button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .nav-button svg {
      width: 16px;
      height: 16px;
    }

    .urlbar-container {
      flex: 1;
      height: var(--urlbar-height);
      background: #42414d;
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
      outline-color: #00ddff;
      background: #52515e;
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
        <svg viewBox="0 0 16 16" fill="currentColor">
          <path d="M11 14L5 8l6-6v12z" />
        </svg>
      </button>
      <button class="nav-button" @click=${this.handleForward} disabled>
        <svg viewBox="0 0 16 16" fill="currentColor">
          <path d="M5 2l6 6-6 6V2z" />
        </svg>
      </button>
      <button class="nav-button" @click=${this.handleRefresh}>
        <svg viewBox="0 0 16 16" fill="currentColor">
          <path
            d="M13.65 2.35A8 8 0 102.35 13.65 8 8 0 0013.65 2.35zm-1.4 9.9A6 6 0 118 2a6 6 0 014.25 10.25z"
          />
          <path d="M8 1v4l3-3-3-3z" />
        </svg>
      </button>
      <button class="nav-button" @click=${this.handleHome}>
        <svg viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 1L1 7v8h5v-5h4v5h5V7z" />
        </svg>
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
          <svg viewBox="0 0 16 16" fill="currentColor">
            <path
              d="M6 2a2 2 0 00-2 2v1H3a1 1 0 00-1 1v3h2v1a2 2 0 004 0V9h1a2 2 0 000-4H8V4a2 2 0 00-2-2z"
            />
            <path
              d="M10 7v1a2 2 0 00-2 2v1H7a2 2 0 000 4h1v1a2 2 0 004 0v-1h1a1 1 0 001-1v-3h-2V9a2 2 0 00-2-2z"
            />
          </svg>
        </button>
        <div class="separator"></div>
        <button class="nav-button" title="Account">
          <svg viewBox="0 0 16 16" fill="currentColor">
            <circle cx="8" cy="6" r="3" />
            <path d="M8 9c-3 0-5 1.5-5 4v1h10v-1c0-2.5-2-4-5-4z" />
          </svg>
        </button>
        <button class="nav-button" title="Open application menu" @click=${this.handleMenuClick}>
          <svg viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 3h12v2H2V3zm0 4h12v2H2V7zm0 4h12v2H2v-2z" />
          </svg>
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
