import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

interface Tab {
  id: string;
  title: string;
  favicon?: string;
  active: boolean;
}

@customElement('tab-bar')
export class TabBar extends LitElement {
  @state()
  private tabs: Tab[] = [
    {
      id: '1',
      title: 'Wikipedia, the free encyclopedia',
      favicon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAHWSURBVDiNpZOxaxRBFMZ/b2ZnZw+5XBQDQRAVIYVYiIUgFoJY2NjYWNraWFjY2Pr3WFiIYCFYCDYiNiIWgiBYeIiCF0RJvNzN7e7M7FtYmL3b3IsJPpjmzbz3fd+8N/OElJKttLKysqfb7R4HMUsp20BHKT2rlLquFB0AKSVbSQjxVEq5L2Lt+35SSjlVLBavB0FwxXXde0mSPLFt+5VhGLvquu5EEAQnoihaBaZM09yf2UII8SyO48PZYtu2J4IguAAwMjKCaZqkaUoYhlwsl7murheq1Wqr0+kM5XK5bQP0PO8cgFLqBTALMDs7q9M0ZXFxEaUUhmFQKpWuViqVl0B9YCsRQrwD9gDMzMxMDw0NfQD2ZnXf9xFCMDo6SrFYBOgC9QzEMAy01iil8H0f3/dpt9tMTk7+7263SxRFrK+v43kebrf7DfgMbM8+oJQiCAJWV1dRSpEkCV999zvQ2AxumiZxHBPHMVrrXhBjY2OUSiWazSaNRgOtNWEYsnNuM7jWmiiKCMOQJEl6FIIgoFAokMvlsCyLdruN1ponrutOAM8BfN/fpZQaT5KkCOyPkySJ4jgeyfZqrclms7jdbr/q+34K0ADx/WC9uq7Xxn9q6w/8BuLkuaAe2mPDAAAAAElFTkSuQmCC',
      active: true,
    },
    {
      id: '2',
      title: 'The Wild Story of th...',
      favicon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAHWSURBVDiNpZOxaxRBFMZ/b2ZnZw+5XBQDQRAVIYVYiIUgFoJY2NjYWNraWFjY2Pr3WFiIYCFYCDYiNiIWgiBYeIiCF0RJvNzN7e7M7FtYmL3b3IsJPpjmzbz3fd+8N/OElJKttLKysqfb7R4HMUsp20BHKT2rlLquFB0AKSVbSQjxVEq5L2Lt+35SSjlVLBavB0FwxXXde0mSPLFt+5VhGLvquu5EEAQnoihaBaZM09yf2UII8SyO48PZYtu2J4IguAAwMjKCaZqkaUoYhlwsl7murheq1Wqr0+kM5XK5bQP0PO8cgFLqBTALMDs7q9M0ZXFxEaUUhmFQKpWuViqVl0B9YCsRQrwD9gDMzMxMDw0NfQD2ZnXf9xFCMDo6SrFYBOgC9QzEMAy01iil8H0f3/dpt9tMTk7+7263SxRFrK+v43kebrf7DfgMbM8+oJQiCAJWV1dRSpEkCV999zvQ2AxumiZxHBPHMVrrXhBjY2OUSiWazSaNRgOtNWEYsnNuM7jWmiiKCMOQJEl6FIIgoFAokMvlsCyLdruN1ponrutOAM8BfN/fpZQaT5KkCOyPkySJ4jgeyfZqrclms7jdbr/q+34K0ADx/WC9uq7Xxn9q6w/8BuLkuaAe2mPDAAAAAElFTkSuQmCC',
      active: false,
    },
  ];

  @property({ type: String })
  activeTabId = '1';

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      height: 100%;
      gap: 4px;
      flex: 1;
    }

    .tabs-container {
      display: flex;
      align-items: center;
      gap: 1px;
      flex: 1;
      height: 100%;
      padding-top: 4px;
    }

    .tab {
      display: flex;
      align-items: center;
      height: calc(100% - 4px);
      min-width: 50px;
      max-width: 240px;
      padding: 0 12px;
      background: #42414d;
      border-radius: 4px 4px 0 0;
      cursor: pointer;
      position: relative;
      transition: background 0.2s;
      gap: 8px;
      border: 1px solid transparent;
      border-bottom: none;
      margin: 0 -1px;
    }

    .tab:hover {
      background: #52515e;
    }

    .tab.active {
      background: #2b2a33;
      border-color: rgba(255, 255, 255, 0.1);
      z-index: 1;
    }

    .tab-favicon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
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
      color: var(--firefox-text-secondary);
      opacity: 0;
      transition: opacity 0.2s, background 0.2s;
    }

    .tab:hover .tab-close,
    .tab.active .tab-close {
      opacity: 1;
    }

    .tab-close:hover {
      background: rgba(255, 255, 255, 0.1);
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
      color: var(--firefox-text-secondary);
      transition: background 0.2s;
      margin: 0 4px;
    }

    .new-tab:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .new-tab::before {
      content: '+';
      font-size: 20px;
      font-weight: 300;
    }

    .toolbar-end {
      display: flex;
      align-items: center;
      margin-left: auto;
      padding: 0 8px;
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
      color: var(--firefox-text-secondary);
      transition: background 0.2s;
    }

    .menu-button:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .menu-dots {
      display: flex;
      gap: 2px;
    }

    .menu-dot {
      width: 4px;
      height: 4px;
      background: currentColor;
      border-radius: 50%;
    }
  `;

  render() {
    return html`
      <div class="tabs-container">
        ${this.tabs.map(
          (tab) => html`
            <div
              class="tab ${tab.active ? 'active' : ''}"
              @click=${() => this.handleTabClick(tab.id)}
            >
              ${tab.favicon
                ? html`<img class="tab-favicon" src=${tab.favicon} alt="" />`
                : ''}
              <span class="tab-title">${tab.title}</span>
              <button
                class="tab-close"
                @click=${(e: Event) => this.handleCloseTab(e, tab.id)}
              ></button>
            </div>
          `
        )}
        <button class="new-tab" @click=${this.handleNewTab}></button>
      </div>
      <div class="toolbar-end">
        <button class="menu-button" @click=${this.handleMenu}>
          <div class="menu-dots">
            <div class="menu-dot"></div>
            <div class="menu-dot"></div>
            <div class="menu-dot"></div>
          </div>
        </button>
      </div>
    `;
  }

  private handleTabClick(tabId: string) {
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

  private handleCloseTab(e: Event, tabId: string) {
    e.stopPropagation();
    
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

  private handleNewTab() {
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