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
      favicon: '/assets/sites/wikipedia.ico',
      active: true,
    },
    {
      id: '2',
      title: 'The Wild Story of th...',
      favicon: '/assets/sites/pocket.ico',
      active: false,
    },
  ];

  @property({ type: String })
  activeTabId = '1';

  @state()
  hasOverflow = false;

  static styles = css`
    :host {
      display: flex;
      align-items: stretch;
      height: 100%;
      flex: 1;
      min-width: 0;
    }

    .tabs-container {
      display: flex;
      align-items: stretch;
      flex: 1;
      height: 100%;
      padding: 2px 0;
      min-width: 0; /* Allow container to shrink */
      overflow: hidden; /* Critical: prevent tabs from pushing other elements off screen */
      position: relative;
    }

    .tabs-scroll-container {
      display: flex;
      align-items: stretch;
      overflow-x: hidden; /* Hide overflow for now */
      overflow-y: hidden;
      min-width: 0; /* Allow container to shrink */
    }

    .tabs-and-new-tab {
      display: flex;
      align-items: stretch;
      min-width: 0;
    }

    .tab {
      display: flex;
      align-items: center;
      height: calc(100% - 8px);
      width: 180px;
      flex-shrink: 0; /* Prevent tabs from shrinking */
      flex-grow: 0;
      padding: 0 12px;
      background: transparent;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      transition: background 0.2s;
      gap: 8px;
      border: 1px solid transparent;
      border-bottom: none;
      margin-right: 2px;
      margin-bottom: 4px;
    }

    .tab.firefox-view {
      width: 16px;
      margin-inline-start: 24px;
      margin-inline-end: 16px;
      flex-shrink: 0;
      gap: 0;
      justify-content: center;
    }

    .tab:hover:not(.active) {
      background: var(--firefox-hover);
    }

    .tab.active {
      background: var(--firefox-content-bg);
      border: 1px solid var(--firefox-border);
      border-bottom: none;
      z-index: 10;
      position: relative;
      box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
    }

    .tab-favicon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      -moz-context-properties: fill;
      fill: currentColor;
    }

    /* Icon mask approach for better theme support */
    .icon-mask {
      width: 16px;
      height: 16px;
      display: inline-block;
      background-color: currentColor;
      -webkit-mask-size: 16px;
      mask-size: 16px;
      -webkit-mask-repeat: no-repeat;
      mask-repeat: no-repeat;
      -webkit-mask-position: center;
      mask-position: center;
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
      flex-shrink: 0;
    }

    .new-tab.inline {
      margin-left: 4px;
    }

    .new-tab.overflow {
      position: absolute;
      right: 40px; /* Next to the menu button */
      top: 50%;
      transform: translateY(-50%);
    }

    .new-tab:hover {
      background: var(--firefox-hover);
      color: var(--firefox-icon-hover);
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

    .firefox-view-icon {
      width: 16px;
      height: 16px;
      color: var(--firefox-icon-secondary);
    }

    /* Special handling for Firefox View tab */
    .tab.firefox-view .icon-mask {
      color: var(--firefox-icon-secondary);
    }

    .tab.firefox-view.active .icon-mask {
      color: var(--firefox-icon-primary);
    }
  `;

  render() {
    return html`
      <div class="tabs-container">
        <div class="tabs-and-new-tab">
          <div class="tabs-scroll-container">
            ${this.tabs.map(
              (tab) => html`
                <div
                  class="tab ${tab.active ? 'active' : ''} ${tab.id === 'firefox-view'
                    ? 'firefox-view'
                    : ''}"
                  @click=${() => this.handleTabClick(tab.id)}
                >
                  ${tab.id === 'firefox-view'
                    ? html`<span
                        class="icon-mask tab-favicon"
                        style="mask-image: url(/assets/browser/themes/shared/icons/firefox-view.svg);"
                        role="img"
                        aria-label="Firefox View"
                      ></span>`
                    : tab.favicon
                      ? html`<img class="tab-favicon" src=${tab.favicon} alt="" />`
                      : ''}
                  ${tab.id !== 'firefox-view'
                    ? html`<span class="tab-title">${tab.title}</span>`
                    : ''}
                  ${tab.id !== 'firefox-view'
                    ? html`<button
                        class="tab-close"
                        @click=${(e: Event) => this.handleCloseTab(e, tab.id)}
                      ></button>`
                    : ''}
                </div>
              `
            )}
          </div>
          ${!this.hasOverflow
            ? html`
                <button class="new-tab inline" @click=${this.handleNewTab}>
                  <span
                    class="icon-mask"
                    style="mask-image: url(/assets/browser/themes/shared/icons/new-tab.svg);"
                    role="img"
                    aria-label="New Tab"
                  ></span>
                </button>
              `
            : ''}
        </div>
        ${this.hasOverflow
          ? html`
              <button class="new-tab overflow" @click=${this.handleNewTab}>
                <span
                  class="icon-mask"
                  style="mask-image: url(/assets/browser/themes/shared/icons/new-tab.svg);"
                  role="img"
                  aria-label="New Tab"
                ></span>
              </button>
            `
          : ''}
      </div>
      <div class="toolbar-end">
        <button class="menu-button" @click=${this.handleMenu} title="List all tabs">
          <span
            class="icon-mask"
            style="mask-image: url(/assets/toolkit/themes/shared/icons/sort-arrow.svg);"
            role="img"
            aria-label="Tab Menu"
          ></span>
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

    const activeTab = this.tabs.find((tab) => tab.id === tabId);
    this.dispatchEvent(
      new CustomEvent('tab-activated', {
        detail: { tabId, tab: activeTab },
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

    // Count non-Firefox-view tabs
    const nonFirefoxViewTabs = this.tabs.filter((tab) => tab.id !== 'firefox-view');

    // Prevent closing the last non-Firefox-view tab
    if (nonFirefoxViewTabs.length === 1) {
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

    // Check for overflow after adding tab
    this.checkOverflow();

    this.dispatchEvent(
      new CustomEvent('new-tab', {
        detail: { tabId: newTab.id },
        bubbles: true,
        composed: true,
      })
    );
  }

  private checkOverflow() {
    requestAnimationFrame(() => {
      const container = this.shadowRoot?.querySelector('.tabs-container');
      const tabsAndNewTab = this.shadowRoot?.querySelector('.tabs-and-new-tab');

      if (container && tabsAndNewTab) {
        const containerWidth = container.clientWidth;
        const tabsWidth = tabsAndNewTab.scrollWidth;
        const menuButtonWidth = 40; // Account for menu button width

        this.hasOverflow = tabsWidth > containerWidth - menuButtonWidth;
      }
    });
  }

  private handleMenu() {
    this.dispatchEvent(
      new CustomEvent('menu-clicked', {
        bubbles: true,
        composed: true,
      })
    );
  }

  connectedCallback() {
    super.connectedCallback();

    // Check for overflow on initial render and window resize
    window.addEventListener('resize', this.handleResize);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('resize', this.handleResize);
  }

  firstUpdated() {
    this.checkOverflow();
  }

  private handleResize = () => {
    this.checkOverflow();
  };
}
