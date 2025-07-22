import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './tab-bar';
import type { TabBar, Tab } from './tab-bar';
import './navigation-bar';
import type { NavigationBar } from './navigation-bar';
import './panel-menu';
import './context-menu';
import type { ContextMenu, ContextMenuItem } from './context-menu';

@customElement('firefox-window')
export class FirefoxWindow extends LitElement {
  @state()
  private isFullscreen = false;

  @state()
  activeMenu: string | null = null;

  @state()
  private activeTabTitle = 'Wikipedia, the free encyclopedia';

  @state()
  private currentTheme: 'dark' | 'light' = 'dark';

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
      background: var(--firefox-toolbar-bg);
      -webkit-app-region: drag;
      flex-shrink: 0;
      position: relative;
    }

    .tab-bar {
      height: var(--tab-height);
      background: var(--firefox-bg);
      display: flex;
      align-items: center;
      padding: 0 8px;
      gap: 4px;
      flex-shrink: 0;
    }

    .toolbar {
      height: var(--toolbar-height);
      background: var(--firefox-toolbar-bg);
      border-bottom: 1px solid var(--firefox-border);
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
      background: var(--firefox-content-bg, #f9f9fb);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: var(--firefox-content-text, #15141a);
    }

    /* Menu styles */
    .menu-item {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      cursor: pointer;
      transition: background 0.15s;
      gap: 12px;
      color: var(--firefox-text);
      text-decoration: none;
      font-size: 13px;
      min-height: 32px;
    }

    .menu-item:hover {
      background: var(--firefox-hover);
    }

    .menu-item.has-submenu::after {
      content: '>';
      margin-left: auto;
      opacity: 0.6;
    }

    .menu-item-icon {
      width: 16px;
      height: 16px;
      opacity: 0.8;
      flex-shrink: 0;
    }

    .menu-item-label {
      flex: 1;
    }

    .menu-item-shortcut {
      opacity: 0.6;
      font-size: 11px;
      margin-left: auto;
    }

    .menu-separator {
      height: 1px;
      background: var(--firefox-border);
      margin: 4px 0;
    }

    .menu-section-label {
      padding: 8px 16px 4px 16px;
      font-size: 11px;
      opacity: 0.6;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .theme-indicator {
      position: absolute;
      bottom: 8px;
      right: 8px;
      font-size: 10px;
      color: var(--firefox-text-secondary);
      background: var(--firefox-toolbar-bg);
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s;
      z-index: 100;
    }

    .theme-indicator:hover {
      background: var(--firefox-hover);
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
        <tab-bar
          @menu-clicked=${() => this.toggleMenu('tab-menu')}
          @tab-activated=${this.handleTabActivated}
        ></tab-bar>
      </div>
      <div class="toolbar">
        <navigation-bar @menu-clicked=${() => this.toggleMenu('hamburger')}></navigation-bar>
      </div>
      <div class="content-area">
        <div class="main-content">${this.activeTabTitle}</div>
      </div>

      <!-- Placeholder menus -->
      ${this.renderMenus()}

      <!-- Context menu -->
      <context-menu></context-menu>

      <!-- Theme indicator -->
      <button
        class="theme-indicator"
        @click=${this.toggleTheme}
        title="Press Alt+Shift+T to toggle theme"
      >
        Theme: ${this.currentTheme}
      </button>
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
        style="top: 100px; right: 8px; width: 320px;"
      >
        ${this.renderHamburgerMenuContent()}
      </panel-menu>
    `;
  }

  private toggleMenu(menuId: string) {
    this.activeMenu = this.activeMenu === menuId ? null : menuId;
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this.handleDocumentClick);
    this.addEventListener('contextmenu', this.handleContextMenu);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this.handleDocumentClick);
    this.removeEventListener('contextmenu', this.handleContextMenu);
    document.removeEventListener('keydown', this.handleKeyDown);
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

  private handleKeyDown = (e: KeyboardEvent) => {
    // Alt + Shift + T to toggle theme
    if (e.key === 'T' && e.shiftKey && e.altKey) {
      e.preventDefault();
      this.toggleTheme();
      return;
    }

    // Alt + T for new tab
    if (e.key === 't' && e.altKey && !e.shiftKey) {
      e.preventDefault();
      this.handleNewTab();
      return;
    }

    // Alt + W to close tab
    if (e.key === 'w' && e.altKey) {
      e.preventDefault();
      this.handleCloseCurrentTab();
      return;
    }

    // Alt + L to focus URL bar
    if (e.key === 'l' && e.altKey) {
      e.preventDefault();
      this.focusUrlBar();
      return;
    }

    // Alt + Number to switch tabs (1-9)
    if (e.altKey && e.key >= '1' && e.key <= '9') {
      e.preventDefault();
      const tabIndex = parseInt(e.key) - 1;
      this.switchToTabByIndex(tabIndex);
      return;
    }
  };

  private toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    console.log(`Switched to ${this.currentTheme} theme`);
  }

  private handleTabActivated(e: CustomEvent<{ tabId: string }>) {
    const tabBar = this.shadowRoot?.querySelector('tab-bar') as TabBar;
    if (tabBar && tabBar.tabs) {
      const activeTab = tabBar.tabs.find((tab: Tab) => tab.id === e.detail.tabId);
      if (activeTab) {
        this.activeTabTitle = activeTab.title;
      }
    }
  }

  private handleContextMenu = (e: MouseEvent) => {
    // Check if the click is in the content area
    const target = e.composedPath()[0] as HTMLElement;
    const contentArea = target.closest('.main-content');

    // If clicking in content area, allow default browser context menu
    if (contentArea) {
      return;
    }

    // Otherwise, show our custom context menu for chrome UI
    e.preventDefault();
    e.stopPropagation();

    const contextMenu = this.shadowRoot?.querySelector('context-menu') as ContextMenu;
    if (!contextMenu) return;

    const items = this.getContextMenuItems(target);
    contextMenu.show(e.clientX, e.clientY, items);
  };

  private getContextMenuItems(target: HTMLElement): ContextMenuItem[] {
    // Check if clicked on tab bar
    const tabBar = target.closest('tab-bar');
    if (tabBar) {
      return [
        { label: 'New Tab', action: () => console.log('New tab') },
        { label: 'Reload Tab', action: () => console.log('Reload tab') },
        { label: 'Duplicate Tab', action: () => console.log('Duplicate tab') },
        { label: 'Pin Tab', action: () => console.log('Pin tab') },
        { separator: true },
        { label: 'Close Tab', action: () => console.log('Close tab') },
        { label: 'Close Other Tabs', action: () => console.log('Close other tabs') },
        { label: 'Close Tabs to the Right', action: () => console.log('Close tabs to right') },
        { separator: true },
        { label: 'Undo Close Tab', action: () => console.log('Undo close tab') },
      ];
    }

    // Check if clicked on navigation bar
    const navBar = target.closest('navigation-bar');
    if (navBar) {
      return [
        { label: 'Back', action: () => console.log('Back'), disabled: true },
        { label: 'Forward', action: () => console.log('Forward'), disabled: true },
        { label: 'Reload', action: () => console.log('Reload') },
        { separator: true },
        { label: 'Bookmark This Page', action: () => console.log('Bookmark page') },
        { separator: true },
        { label: 'View Page Source', action: () => console.log('View source') },
        { label: 'Inspect Element', action: () => console.log('Inspect') },
      ];
    }

    // Default context menu for chrome area
    return [
      { label: 'Customize Toolbar...', action: () => console.log('Customize toolbar') },
      { label: 'Manage Extension', action: () => console.log('Manage extensions') },
      { separator: true },
      { label: 'Bookmarks Toolbar', submenu: [] },
      { label: 'Full Screen', action: () => console.log('Full screen') },
      { separator: true },
      { label: 'Settings', action: () => console.log('Settings') },
    ];
  }

  private handleNewTab() {
    const tabBar = this.shadowRoot?.querySelector('tab-bar') as TabBar;
    if (tabBar) {
      tabBar.handleNewTab();
    }
  }

  private handleCloseCurrentTab() {
    const tabBar = this.shadowRoot?.querySelector('tab-bar') as TabBar;
    if (tabBar && tabBar.tabs.length > 1) {
      const activeTab = tabBar.tabs.find((tab) => tab.active);
      if (activeTab && activeTab.id !== 'firefox-view') {
        tabBar.handleCloseTab(new Event('click'), activeTab.id);
      }
    }
  }

  private focusUrlBar() {
    const navBar = this.shadowRoot?.querySelector('navigation-bar') as NavigationBar;
    if (navBar && navBar.shadowRoot) {
      const urlInput = navBar.shadowRoot.querySelector('.urlbar-input') as HTMLInputElement;
      if (urlInput) {
        urlInput.focus();
        urlInput.select();
      }
    }
  }

  private switchToTabByIndex(index: number) {
    const tabBar = this.shadowRoot?.querySelector('tab-bar') as TabBar;
    if (tabBar && tabBar.tabs[index]) {
      tabBar.handleTabClick(tabBar.tabs[index].id);
    }
  }

  private renderHamburgerMenuContent() {
    return html`
      <!-- New Tab -->
      <div class="menu-item">
        <img
          class="menu-item-icon"
          src="/src/assets/browser/themes/shared/icons/new-tab.svg"
          alt=""
        />
        <span class="menu-item-label">New Tab</span>
        <span class="menu-item-shortcut">⌘T</span>
      </div>
      <div class="menu-item">
        <img
          class="menu-item-icon"
          src="/src/assets/browser/themes/shared/icons/window.svg"
          alt=""
        />
        <span class="menu-item-label">New Window</span>
        <span class="menu-item-shortcut">⌘N</span>
      </div>
      <div class="menu-item">
        <img
          class="menu-item-icon"
          src="/src/assets/browser/themes/shared/icons/privateBrowsing.svg"
          alt=""
        />
        <span class="menu-item-label">New Private Window</span>
        <span class="menu-item-shortcut">⇧⌘P</span>
      </div>
      <div class="menu-separator"></div>

      <!-- Bookmarks & History -->
      <div class="menu-item has-submenu">
        <img
          class="menu-item-icon"
          src="/src/assets/browser/themes/shared/icons/bookmark.svg"
          alt=""
        />
        <span class="menu-item-label">Bookmarks</span>
      </div>
      <div class="menu-item has-submenu">
        <img
          class="menu-item-icon"
          src="/src/assets/browser/themes/shared/icons/history.svg"
          alt=""
        />
        <span class="menu-item-label">History</span>
        <span class="menu-item-shortcut">⌘Y</span>
      </div>
      <div class="menu-item">
        <img
          class="menu-item-icon"
          src="/src/assets/browser/themes/shared/downloads/downloads.svg"
          alt=""
        />
        <span class="menu-item-label">Downloads</span>
        <span class="menu-item-shortcut">⇧⌘J</span>
      </div>
      <div class="menu-item">
        <img
          class="menu-item-icon"
          src="/src/assets/browser/themes/shared/icons/login.svg"
          alt=""
        />
        <span class="menu-item-label">Passwords</span>
      </div>
      <div class="menu-separator"></div>

      <!-- Extensions & Themes -->
      <div class="menu-item">
        <img
          class="menu-item-icon"
          src="/src/assets/toolkit/themes/shared/extensions/extension.svg"
          alt=""
        />
        <span class="menu-item-label">Extensions and themes</span>
      </div>
      <div class="menu-separator"></div>

      <!-- Print & Save -->
      <div class="menu-item">
        <img
          class="menu-item-icon"
          src="/src/assets/toolkit/themes/shared/icons/print.svg"
          alt=""
        />
        <span class="menu-item-label">Print…</span>
        <span class="menu-item-shortcut">⌘P</span>
      </div>
      <div class="menu-item">
        <img class="menu-item-icon" src="/src/assets/browser/themes/shared/icons/save.svg" alt="" />
        <span class="menu-item-label">Save page as…</span>
        <span class="menu-item-shortcut">⌘S</span>
      </div>
      <div class="menu-item">
        <img
          class="menu-item-icon"
          src="/src/assets/toolkit/themes/shared/icons/search-glass.svg"
          alt=""
        />
        <span class="menu-item-label">Find in page…</span>
        <span class="menu-item-shortcut">⌘F</span>
      </div>
      <div class="menu-separator"></div>

      <!-- Translation & Zoom -->
      <div class="menu-item">
        <img
          class="menu-item-icon"
          src="/src/assets/browser/themes/shared/icons/translations.svg"
          alt=""
        />
        <span class="menu-item-label">Translate page…</span>
      </div>
      <div class="menu-item">
        <span style="width: 16px;"></span>
        <span class="menu-item-label">Zoom</span>
        <span class="menu-item-shortcut">100%</span>
      </div>
      <div class="menu-separator"></div>

      <!-- Settings & More -->
      <div class="menu-item">
        <img
          class="menu-item-icon"
          src="/src/assets/toolkit/themes/shared/icons/settings.svg"
          alt=""
        />
        <span class="menu-item-label">Settings</span>
      </div>
      <div class="menu-item has-submenu">
        <img
          class="menu-item-icon"
          src="/src/assets/toolkit/themes/shared/icons/developer.svg"
          alt=""
        />
        <span class="menu-item-label">More tools</span>
      </div>
      <div class="menu-separator"></div>

      <!-- Help -->
      <div class="menu-item has-submenu">
        <img class="menu-item-icon" src="/src/assets/toolkit/themes/shared/icons/help.svg" alt="" />
        <span class="menu-item-label">Help</span>
      </div>
    `;
  }
}
