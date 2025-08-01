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
      background: #2b2a33;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 6px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
      min-width: 280px;
      max-width: 400px;
      opacity: 0;
      transform: translateY(-10px);
      transition:
        opacity 0.15s,
        transform 0.15s;
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
      padding: 12px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      font-weight: 500;
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
    }

    .panel-content {
      padding: 4px 0;
      max-height: 600px;
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
      margin: 4px 0;
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
