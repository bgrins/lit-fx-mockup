import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './tab-bar';
import './navigation-bar';
import './panel-menu';

@customElement('firefox-window')
export class FirefoxWindow extends LitElement {
  @state()
  private isFullscreen = false;

  @state()
  activeMenu: string | null = null;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      background: var(--firefox-bg);
      color: var(--firefox-text);
      position: relative;
    }

    .window-controls {
      position: absolute;
      top: 6px;
      left: 8px;
      display: flex;
      gap: 8px;
      z-index: 1000;
    }

    .window-control {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .window-control:hover {
      opacity: 0.8;
    }

    .close {
      background: var(--mac-close);
    }

    .minimize {
      background: var(--mac-minimize);
    }

    .maximize {
      background: var(--mac-maximize);
    }

    .titlebar {
      height: 28px;
      background: #38383d;
      -webkit-app-region: drag;
      flex-shrink: 0;
      position: relative;
    }

    .tab-bar {
      height: var(--tab-height);
      background: #1c1b22;
      display: flex;
      align-items: center;
      padding: 0 8px;
      gap: 4px;
      flex-shrink: 0;
    }

    .toolbar {
      height: var(--toolbar-height);
      background: #2b2a33;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      padding: 0 8px;
      gap: 8px;
      flex-shrink: 0;
    }

    .content-area {
      flex: 1;
      display: flex;
      overflow: hidden;
    }

    .main-content {
      flex: 1;
      background: #f9f9fb;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: #15141a;
    }

    /* Menu styles */
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

    .menu-separator {
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
      margin: 8px 0;
    }
  `;

  render() {
    return html`
      <div class="titlebar">
        <div class="window-controls">
          <button class="window-control close" @click=${this.handleClose}></button>
          <button class="window-control minimize" @click=${this.handleMinimize}></button>
          <button class="window-control maximize" @click=${this.handleMaximize}></button>
        </div>
      </div>
      <div class="tab-bar">
        <tab-bar @menu-clicked=${() => this.toggleMenu('tab-menu')}></tab-bar>
      </div>
      <div class="toolbar">
        <navigation-bar @menu-clicked=${() => this.toggleMenu('hamburger')}></navigation-bar>
      </div>
      <div class="content-area">
        <div class="main-content">New Tab</div>
      </div>

      <!-- Placeholder menus -->
      ${this.renderMenus()}
    `;
  }

  private renderMenus() {
    return html`
      <panel-menu
        .open=${this.activeMenu === 'tab-menu'}
        style="top: 64px; right: 8px;"
        title="All Tabs"
      >
        <div class="menu-item">Search Tabs...</div>
        <div class="menu-separator"></div>
        <div class="menu-item">Close Tab</div>
        <div class="menu-item">Close Other Tabs</div>
        <div class="menu-item">Close Tabs to the Right</div>
        <div class="menu-separator"></div>
        <div class="menu-item">Move Tab</div>
        <div class="menu-item">Reopen Closed Tab</div>
      </panel-menu>

      <panel-menu
        .open=${this.activeMenu === 'hamburger'}
        style="top: 100px; right: 8px;"
        title="Firefox"
      >
        <div class="menu-item">New Window</div>
        <div class="menu-item">New Private Window</div>
        <div class="menu-separator"></div>
        <div class="menu-item">Bookmarks</div>
        <div class="menu-item">History</div>
        <div class="menu-item">Downloads</div>
        <div class="menu-separator"></div>
        <div class="menu-item">Add-ons and Themes</div>
        <div class="menu-item">Settings</div>
        <div class="menu-separator"></div>
        <div class="menu-item">More Tools</div>
        <div class="menu-item">Help</div>
      </panel-menu>
    `;
  }

  private toggleMenu(menuId: string) {
    this.activeMenu = this.activeMenu === menuId ? null : menuId;
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.handleDocumentClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleDocumentClick);
  }

  private handleDocumentClick = (e: MouseEvent) => {
    const path = e.composedPath();
    const isMenuClick = path.some(
      (el) =>
        el instanceof HTMLElement &&
        (el.classList?.contains('menu-button') || el.tagName?.toLowerCase() === 'panel-menu')
    );

    if (!isMenuClick && this.activeMenu) {
      this.activeMenu = null;
    }
  };

  private handleClose() {
    console.log('Close window');
  }

  private handleMinimize() {
    console.log('Minimize window');
  }

  private handleMaximize() {
    this.isFullscreen = !this.isFullscreen;
    console.log('Maximize window');
  }
}
