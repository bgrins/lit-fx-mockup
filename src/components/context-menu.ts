import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface ContextMenuItem {
  label?: string;
  action?: () => void;
  separator?: boolean;
  disabled?: boolean;
  icon?: string;
  submenu?: ContextMenuItem[];
}

@customElement('context-menu')
export class ContextMenu extends LitElement {
  static styles = css`
    :host {
      position: fixed;
      z-index: 10000;
      display: none;
    }

    :host([open]) {
      display: block;
    }

    .menu {
      position: fixed;
      background: #fff;
      border: 1px solid #e1e1e2;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      padding: 4px 0;
      min-width: 200px;
      max-width: 300px;
      font-size: 13px;
      color: #0c0c0d;
    }

    .menu-item {
      padding: 4px 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      user-select: none;
    }

    .menu-item:hover:not(.disabled) {
      background-color: #0060df;
      color: white;
    }

    .menu-item.disabled {
      color: #999;
      cursor: default;
    }

    .separator {
      height: 1px;
      background-color: #e1e1e2;
      margin: 4px 0;
    }

    .icon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    .label {
      flex: 1;
    }

    .submenu-arrow {
      width: 16px;
      height: 16px;
      margin-left: auto;
    }
  `;

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: Number })
  x = 0;

  @property({ type: Number })
  y = 0;

  @property({ type: Array })
  items: ContextMenuItem[] = [];

  render() {
    return html`
      <div class="menu" style="left: ${this.x}px; top: ${this.y}px;">
        ${this.items.map((item) =>
          item.separator
            ? html`<div class="separator"></div>`
            : html`
                <div
                  class="menu-item ${item.disabled ? 'disabled' : ''}"
                  @click=${() => this.handleItemClick(item)}
                >
                  ${item.icon ? html`<img class="icon" src="${item.icon}" alt="" />` : ''}
                  <span class="label">${item.label || ''}</span>
                  ${item.submenu ? html`<span class="submenu-arrow">▶</span>` : ''}
                </div>
              `
        )}
      </div>
    `;
  }

  private handleItemClick(item: ContextMenuItem) {
    if (item.disabled || item.submenu) return;

    if (item.action) {
      item.action();
    }

    this.close();
  }

  show(x: number, y: number, items: ContextMenuItem[]) {
    // Set initial position at cursor
    this.x = x;
    this.y = y;
    this.items = items;
    this.open = true;

    // Adjust position only if menu would go off screen
    requestAnimationFrame(() => {
      const menu = this.shadowRoot?.querySelector('.menu') as HTMLElement;
      if (menu) {
        const rect = menu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Only adjust if menu would overflow viewport
        if (rect.right > viewportWidth) {
          this.x = x - rect.width; // Flip to left side of cursor
        }

        if (rect.bottom > viewportHeight) {
          this.y = y - rect.height; // Flip to top side of cursor
        }

        // Ensure menu doesn't go off the left or top edge
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
      }
    });
  }

  close() {
    this.open = false;
    this.items = [];
  }

  connectedCallback() {
    super.connectedCallback();
    // Close on any click outside
    document.addEventListener('click', this.handleDocumentClick);
    document.addEventListener('contextmenu', this.handleDocumentClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleDocumentClick);
    document.removeEventListener('contextmenu', this.handleDocumentClick);
  }

  private handleDocumentClick = (e: Event) => {
    // Close if click is outside the menu
    if (this.open && !this.contains(e.target as Node)) {
      this.close();
    }
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'context-menu': ContextMenu;
  }
}
