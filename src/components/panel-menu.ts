import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('panel-menu')
export class PanelMenu extends LitElement {
  @property({ type: Boolean })
  open = false;

  @property({ type: String })
  anchor = 'bottom-right'; // Position relative to trigger

  @property({ type: String })
  title = '';

  static styles = css`
    :host {
      position: absolute;
      z-index: 1000;
    }

    .panel {
      background: #42414d;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      min-width: 320px;
      max-width: 400px;
      opacity: 0;
      transform: translateY(-10px);
      transition:
        opacity 0.2s,
        transform 0.2s;
      pointer-events: none;
      display: none;
    }

    .panel.open {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
      display: block;
    }

    .panel-header {
      padding: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      font-weight: 600;
      font-size: 16px;
    }

    .panel-content {
      padding: 8px 0;
      max-height: 400px;
      overflow-y: auto;
    }

    .menu-item {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      cursor: pointer;
      transition: background 0.2s;
      gap: 12px;
      color: var(--firefox-text);
      text-decoration: none;
    }

    .menu-item:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .menu-item-icon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    .menu-separator {
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
      margin: 8px 0;
    }

    .submenu-indicator {
      margin-left: auto;
      width: 12px;
      height: 12px;
    }
  `;

  render() {
    return html`
      <div class="panel ${this.open ? 'open' : ''}">
        ${this.title ? html`<div class="panel-header">${this.title}</div>` : ''}
        <div class="panel-content">
          <slot></slot>
        </div>
      </div>
    `;
  }

  public renderMenuItem(options: {
    label: string;
    icon?: string;
    onClick?: () => void;
    hasSubmenu?: boolean;
  }) {
    return html`
      <div class="menu-item" @click=${options.onClick}>
        ${options.icon
          ? html`<img class="menu-item-icon" src=${options.icon} alt="" />`
          : html`<div class="menu-item-icon"></div>`}
        <span>${options.label}</span>
        ${options.hasSubmenu
          ? html`<svg class="submenu-indicator" viewBox="0 0 12 12" fill="currentColor">
              <path d="M4 3l4 3-4 3V3z" />
            </svg>`
          : ''}
      </div>
    `;
  }

  public renderSeparator() {
    return html`<div class="menu-separator"></div>`;
  }
}
