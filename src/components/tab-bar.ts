import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export interface Tab {
  id: string;
  title: string;
  favicon?: string;
  active: boolean;
}

@customElement('tab-bar')
export class TabBar extends LitElement {
  @state()
  tabs: Tab[] = [
    {
      id: 'firefox-view',
      title: 'Firefox View',
      favicon: 'firefox-view', // Special case for Firefox View icon
      active: false,
    },
    {
      id: '1',
      title: 'Wikipedia, the free encyclopedia',
      favicon: '/src/assets/sites/wikipedia.ico',
      active: true,
    },
    {
      id: '2',
      title: 'The Wild Story of th...',
      favicon: '/src/assets/sites/pocket.ico',
      active: false,
    },
  ];

  @property({ type: String })
  activeTabId = '1';

  static styles = css`
    :host {
      display: flex;
      align-items: stretch;
      height: 100%;
      flex: 1;
    }

    .tabs-container {
      display: flex;
      align-items: stretch;
      flex: 1;
      height: 100%;
      padding-top: 4px;
    }

    .tab {
      display: flex;
      align-items: center;
      height: 100%;
      min-width: 50px;
      max-width: 240px;
      padding: 0 12px;
      background: var(--firefox-toolbar-bg);
      border-radius: 4px 4px 0 0;
      cursor: pointer;
      position: relative;
      transition: background 0.2s;
      gap: 8px;
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-bottom: none;
      margin-right: 1px;
    }

    .tab.firefox-view {
      min-width: 40px;
      max-width: 40px;
      padding: 0 8px;
      gap: 0;
      justify-content: center;
      margin-right: 8px;
    }

    .tab:hover {
      background: var(--firefox-hover);
    }

    .tab.active {
      background: var(--firefox-tab-bg);
      border-color: var(--firefox-border);
      z-index: 1;
      position: relative;
    }

    .tab.active::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--firefox-tab-bg);
    }

    .tab-favicon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      -moz-context-properties: fill;
      fill: currentColor;
    }

    .tab-title {
      flex: 1;
      font-size: 12px;
      color: var(--firefox-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 16px;
    }

    .tab-close {
      position: absolute;
      right: 6px;
      width: 16px;
      height: 16px;
      border: none;
      background: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 2px;
      color: var(--firefox-icon-secondary);
      opacity: 0;
      transition:
        opacity 0.2s,
        background 0.2s,
        color 0.2s;
    }

    .tab:hover .tab-close,
    .tab.active .tab-close {
      opacity: 1;
    }

    .tab-close:hover {
      background: var(--firefox-hover);
      color: var(--firefox-icon-hover);
    }

    .tab-close::before {
      content: '×';
      font-size: 16px;
      line-height: 1;
    }

    .new-tab {
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
      margin-left: 2px;
      align-self: center;
    }

    .new-tab:hover {
      background: var(--firefox-hover);
      color: var(--firefox-icon-hover);
    }

    .new-tab img {
      width: 16px;
      height: 16px;
      -moz-context-properties: fill;
      fill: currentColor;
    }

    .toolbar-end {
      display: flex;
      align-items: center;
      margin-left: auto;
      padding: 0 8px;
      align-self: center;
    }

    .menu-button {
      width: 32px;
      height: 32px;
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
    }

    .menu-button:hover {
      background: var(--firefox-hover);
      color: var(--firefox-icon-hover);
    }

    .menu-button svg,
    .menu-button img {
      width: 16px;
      height: 16px;
      -moz-context-properties: fill;
      fill: currentColor;
    }

    .firefox-view-icon {
      width: 16px;
      height: 16px;
      color: var(--firefox-icon-secondary);
    }
  `;

  render() {
    return html`
      <div class="tabs-container">
        ${this.tabs.map(
          (tab) => html`
            <div
              class="tab ${tab.active ? 'active' : ''} ${tab.id === 'firefox-view'
                ? 'firefox-view'
                : ''}"
              @click=${() => this.handleTabClick(tab.id)}
            >
              ${tab.id === 'firefox-view'
                ? html`<img
                    class="tab-favicon"
                    src="/src/assets/browser/themes/shared/icons/firefox-view.svg"
                    alt="Firefox View"
                  />`
                : tab.favicon
                  ? html`<img class="tab-favicon" src=${tab.favicon} alt="" />`
                  : ''}
              ${tab.id !== 'firefox-view' ? html`<span class="tab-title">${tab.title}</span>` : ''}
              ${tab.id !== 'firefox-view'
                ? html`<button
                    class="tab-close"
                    @click=${(e: Event) => this.handleCloseTab(e, tab.id)}
                  ></button>`
                : ''}
            </div>
          `
        )}
        <button class="new-tab" @click=${this.handleNewTab}>
          <img src="/src/assets/browser/themes/shared/icons/new-tab.svg" alt="New Tab" />
        </button>
      </div>
      <div class="toolbar-end">
        <button class="menu-button" @click=${this.handleMenu} title="List all tabs">
          <img src="/src/assets/toolkit/themes/shared/icons/sort-arrow.svg" alt="Tab Menu" />
        </button>
      </div>
    `;
  }

  handleTabClick(tabId: string) {
    this.tabs = this.tabs.map((tab) => ({
      ...tab,
      active: tab.id === tabId,
    }));
    this.activeTabId = tabId;
    this.dispatchEvent(
      new CustomEvent('tab-activated', {
        detail: { tabId },
        bubbles: true,
        composed: true,
      })
    );
  }

  handleCloseTab(e: Event, tabId: string) {
    e.stopPropagation();

    // Prevent closing Firefox View tab
    if (tabId === 'firefox-view') {
      return;
    }

    if (this.tabs.length === 1) {
      return;
    }

    const tabIndex = this.tabs.findIndex((tab) => tab.id === tabId);
    const wasActive = this.tabs[tabIndex].active;

    this.tabs = this.tabs.filter((tab) => tab.id !== tabId);

    if (wasActive && this.tabs.length > 0) {
      const newActiveIndex = Math.min(tabIndex, this.tabs.length - 1);
      this.tabs[newActiveIndex].active = true;
      this.activeTabId = this.tabs[newActiveIndex].id;
    }

    this.dispatchEvent(
      new CustomEvent('tab-closed', {
        detail: { tabId },
        bubbles: true,
        composed: true,
      })
    );
  }

  handleNewTab() {
    const newTab: Tab = {
      id: `tab-${Date.now()}`,
      title: 'New Tab',
      active: true,
    };

    this.tabs = this.tabs.map((tab) => ({ ...tab, active: false }));
    this.tabs.push(newTab);
    this.activeTabId = newTab.id;

    this.dispatchEvent(
      new CustomEvent('new-tab', {
        detail: { tabId: newTab.id },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleMenu() {
    this.dispatchEvent(
      new CustomEvent('menu-clicked', {
        bubbles: true,
        composed: true,
      })
    );
  }
}
