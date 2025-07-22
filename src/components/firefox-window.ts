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
  private activeTab: Tab | null = null;

  @state()
  private currentTheme: 'dark' | 'light' = 'dark';

  @state()
  private shortcutPressed = '';

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
      /* Add shadow to create the floating effect */
      box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.2);
      position: relative;
      z-index: 2;
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
      /* Push the toolbar down slightly to create visual separation */
      position: relative;
      z-index: 1;
    }

    .content-area {
      flex: 1;
      display: flex;
      overflow: hidden;
    }

    .main-content {
      flex: 1;
      background: var(--firefox-content-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: var(--firefox-content-text);
      position: relative;
    }

    .tab-iframe {
      width: 100%;
      height: 100%;
      border: none;
      background: white;
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
      background: var(--firefox-tab-bg);
    }

    .shortcut-indicator {
      position: absolute;
      bottom: 48px;
      right: 8px;
      font-size: 12px;
      color: var(--firefox-text);
      background: var(--firefox-toolbar-bg);
      padding: 6px 12px;
      border-radius: 4px;
      border: 1px solid var(--firefox-border);
      opacity: 0;
      transition: opacity 0.2s;
      pointer-events: none;
    }

    .shortcut-indicator.active {
      opacity: 1;
    }

    .shortcuts-help {
      position: absolute;
      bottom: 8px;
      left: 8px;
      font-size: 11px;
      color: var(--firefox-text-secondary);
      background: var(--firefox-toolbar-bg);
      padding: 8px;
      border-radius: 4px;
      border: 1px solid var(--firefox-border);
      max-width: 300px;
      line-height: 1.5;
    }

    .shortcuts-help kbd {
      background: var(--firefox-tab-bg);
      padding: 2px 4px;
      border-radius: 3px;
      font-family: monospace;
      font-size: 10px;
      border: 1px solid var(--firefox-border);
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
        <div class="main-content">${this.renderContent()}</div>
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

      <!-- Shortcut indicator -->
      <div class="shortcut-indicator ${this.shortcutPressed ? 'active' : ''}">
        ${this.shortcutPressed}
      </div>

      <!-- Shortcuts help -->
      <div class="shortcuts-help">
        Keyboard shortcuts:
        <kbd>Alt+T</kbd> New tab, <kbd>Alt+L</kbd> Focus URL, <kbd>Alt+W</kbd> Close tab,
        <kbd>Alt+Shift+T</kbd> Toggle theme
      </div>
    `;
  }

  private renderContent() {
    if (!this.activeTab) {
      return 'New Tab';
    }

    // Map specific tab IDs to their pre-registered frames
    const frameMap: Record<string, string | null> = {
      '1': '/frames/wikipedia.html', // Wikipedia tab
      'firefox-view': null, // Firefox View doesn't use iframe
    };

    // Special handling for Firefox View
    if (this.activeTab.id === 'firefox-view') {
      return html`<div style="font-size: 24px; color: var(--firefox-text-secondary);">
        Firefox View
      </div>`;
    }

    // Check if we have a pre-registered frame for this tab
    const frameSrc = frameMap[this.activeTab.id];

    if (frameSrc) {
      // Load the pre-registered frame
      return html`<iframe
        class="tab-iframe"
        src="${frameSrc}"
        title="${this.activeTab.title}"
      ></iframe>`;
    } else {
      // Load the fallback frame with the tab title as a parameter
      const fallbackUrl = `/frames/fallback.html?title=${encodeURIComponent(this.activeTab.title)}`;
      return html`<iframe
        class="tab-iframe"
        src="${fallbackUrl}"
        title="${this.activeTab.title}"
      ></iframe>`;
    }
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

    // Initialize activeTab based on initial tabs
    requestAnimationFrame(() => {
      const tabBar = this.shadowRoot?.querySelector('tab-bar') as TabBar;
      if (tabBar && tabBar.tabs) {
        const initialActiveTab = tabBar.tabs.find((tab: Tab) => tab.active);
        if (initialActiveTab) {
          this.activeTab = initialActiveTab;
          this.updateUrlBar(initialActiveTab);
        }
      }
    });
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
    // Debug logging
    console.log('Key pressed:', {
      key: e.key,
      code: e.code,
      altKey: e.altKey,
      ctrlKey: e.ctrlKey,
      metaKey: e.metaKey,
      shiftKey: e.shiftKey,
      platform: navigator.platform,
    });

    // On Mac, use Cmd instead of Alt to avoid Option key character insertion
    const modKey = e.altKey;

    // Cmd/Alt + Shift + T to toggle theme
    if (e.code === 'KeyT' && e.shiftKey && modKey) {
      e.preventDefault();
      this.toggleTheme();
      this.showShortcutFeedback('Theme toggled');
      return;
    }

    // Cmd/Alt + T for new tab (note: Cmd+T might be intercepted by browser)
    if (e.code === 'KeyT' && modKey && !e.shiftKey) {
      e.preventDefault();
      this.handleNewTab();
      this.showShortcutFeedback('New tab created');
      return;
    }

    // Cmd/Alt + W to close tab (note: Cmd+W might be intercepted by browser)
    if (e.code === 'KeyW' && modKey) {
      e.preventDefault();
      this.handleCloseCurrentTab();
      this.showShortcutFeedback('Tab closed');
      return;
    }

    // Cmd/Alt + L to focus URL bar
    if (e.code === 'KeyL' && modKey) {
      e.preventDefault();
      this.focusUrlBar();
      this.showShortcutFeedback('URL bar focused');
      return;
    }

    // Cmd/Alt + Number to switch tabs (1-9)
    if (modKey && e.code >= 'Digit1' && e.code <= 'Digit9') {
      e.preventDefault();
      const tabIndex = parseInt(e.code.slice(-1)) - 1;
      this.switchToTabByIndex(tabIndex);
      this.showShortcutFeedback(`Switched to tab ${e.code.slice(-1)}`);
      return;
    }

    // Fallback: Also support Ctrl key combinations on all platforms
    if (e.ctrlKey && !e.altKey && !e.metaKey) {
      // Ctrl + Shift + T to toggle theme
      if (e.code === 'KeyT' && e.shiftKey) {
        e.preventDefault();
        this.toggleTheme();
        this.showShortcutFeedback('Theme toggled (Ctrl)');
        return;
      }

      // Ctrl + N for new tab (less likely to be intercepted than Ctrl+T)
      if (e.code === 'KeyN') {
        e.preventDefault();
        this.handleNewTab();
        this.showShortcutFeedback('New tab created (Ctrl+N)');
        return;
      }
    }
  };

  private toggleTheme() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    console.log(`Switched to ${this.currentTheme} theme`);
  }

  private handleTabActivated(e: CustomEvent<{ tabId: string; tab: Tab }>) {
    const activeTab = e.detail.tab;
    if (activeTab) {
      this.activeTab = activeTab;
      this.updateUrlBar(activeTab);
    }
  }

  private updateUrlBar(tab: Tab) {
    const navBar = this.shadowRoot?.querySelector('navigation-bar') as NavigationBar;
    if (navBar) {
      // Map tab titles to URLs for demonstration
      const urlMap: Record<string, string> = {
        'Wikipedia, the free encyclopedia': 'https://en.wikipedia.org/',
        'The Wild Story of th...': 'https://getpocket.com/',
      };

      if (tab.id === 'firefox-view') {
        navBar.setAttribute('url', 'about:firefox-view');
      } else {
        const url = urlMap[tab.title] || 'about:blank';
        navBar.setAttribute('url', url);
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

  private showShortcutFeedback(message: string) {
    this.shortcutPressed = message;
    setTimeout(() => {
      this.shortcutPressed = '';
    }, 2000);
  }

  private renderHamburgerMenuContent() {
    return html`
      <!-- New Tab -->
      <div class="menu-item">
        <img class="menu-item-icon" src="/assets/browser/themes/shared/icons/new-tab.svg" alt="" />
        <span class="menu-item-label">New Tab</span>
        <span class="menu-item-shortcut">⌘T</span>
      </div>
      <div class="menu-item">
        <img class="menu-item-icon" src="/assets/browser/themes/shared/icons/window.svg" alt="" />
        <span class="menu-item-label">New Window</span>
        <span class="menu-item-shortcut">⌘N</span>
      </div>
      <div class="menu-item">
        <img
          class="menu-item-icon"
          src="/assets/browser/themes/shared/icons/privateBrowsing.svg"
          alt=""
        />
        <span class="menu-item-label">New Private Window</span>
        <span class="menu-item-shortcut">⇧⌘P</span>
      </div>
      <div class="menu-separator"></div>

      <!-- Bookmarks & History -->
      <div class="menu-item has-submenu">
        <img class="menu-item-icon" src="/assets/browser/themes/shared/icons/bookmark.svg" alt="" />
        <span class="menu-item-label">Bookmarks</span>
      </div>
      <div class="menu-item has-submenu">
        <img class="menu-item-icon" src="/assets/browser/themes/shared/icons/history.svg" alt="" />
        <span class="menu-item-label">History</span>
        <span class="menu-item-shortcut">⌘Y</span>
      </div>
      <div class="menu-item">
        <img
          class="menu-item-icon"
          src="/assets/browser/themes/shared/downloads/downloads.svg"
          alt=""
        />
        <span class="menu-item-label">Downloads</span>
        <span class="menu-item-shortcut">⇧⌘J</span>
      </div>
      <div class="menu-item">
        <img class="menu-item-icon" src="/assets/browser/themes/shared/icons/login.svg" alt="" />
        <span class="menu-item-label">Passwords</span>
      </div>
      <div class="menu-separator"></div>

      <!-- Extensions & Themes -->
      <div class="menu-item">
        <img
          class="menu-item-icon"
          src="/assets/toolkit/themes/shared/extensions/extension.svg"
          alt=""
        />
        <span class="menu-item-label">Extensions and themes</span>
      </div>
      <div class="menu-separator"></div>

      <!-- Print & Save -->
      <div class="menu-item">
        <img class="menu-item-icon" src="/assets/toolkit/themes/shared/icons/print.svg" alt="" />
        <span class="menu-item-label">Print…</span>
        <span class="menu-item-shortcut">⌘P</span>
      </div>
      <div class="menu-item">
        <img class="menu-item-icon" src="/assets/browser/themes/shared/icons/save.svg" alt="" />
        <span class="menu-item-label">Save page as…</span>
        <span class="menu-item-shortcut">⌘S</span>
      </div>
      <div class="menu-item">
        <img
          class="menu-item-icon"
          src="/assets/toolkit/themes/shared/icons/search-glass.svg"
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
          src="/assets/browser/themes/shared/icons/translations.svg"
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
        <img class="menu-item-icon" src="/assets/toolkit/themes/shared/icons/settings.svg" alt="" />
        <span class="menu-item-label">Settings</span>
      </div>
      <div class="menu-item has-submenu">
        <img
          class="menu-item-icon"
          src="/assets/toolkit/themes/shared/icons/developer.svg"
          alt=""
        />
        <span class="menu-item-label">More tools</span>
      </div>
      <div class="menu-separator"></div>

      <!-- Help -->
      <div class="menu-item has-submenu">
        <img class="menu-item-icon" src="/assets/toolkit/themes/shared/icons/help.svg" alt="" />
        <span class="menu-item-label">Help</span>
      </div>
    `;
  }
}
