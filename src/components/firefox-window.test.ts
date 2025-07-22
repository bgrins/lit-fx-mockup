import { describe, it, expect, beforeEach, vi } from 'vitest';
import './firefox-window';
import type { FirefoxWindow } from './firefox-window';
import type { ContextMenu, ContextMenuItem } from './context-menu';

describe('FirefoxWindow', () => {
  let element: FirefoxWindow;

  beforeEach(async () => {
    document.body.innerHTML = '<firefox-window></firefox-window>';
    element = document.querySelector('firefox-window') as FirefoxWindow;
    await element.updateComplete;
  });

  it('renders window controls', () => {
    const controls = element.shadowRoot!.querySelectorAll('.window-control');
    expect(controls.length).toBe(3); // close, minimize, maximize
  });

  it('renders tab bar', () => {
    const tabBar = element.shadowRoot!.querySelector('tab-bar');
    expect(tabBar).toBeTruthy();
  });

  it('renders navigation bar', () => {
    const navBar = element.shadowRoot!.querySelector('navigation-bar');
    expect(navBar).toBeTruthy();
  });

  it('renders content area', () => {
    const content = element.shadowRoot!.querySelector('.main-content');
    expect(content).toBeTruthy();
    expect(content!.textContent).toContain('Wikipedia, the free encyclopedia');
  });

  it('toggles menu when menu button is clicked', async () => {
    expect(element.activeMenu).toBeNull();

    // Simulate menu click
    const tabBar = element.shadowRoot!.querySelector('tab-bar');
    tabBar!.dispatchEvent(new CustomEvent('menu-clicked', { bubbles: true }));
    await element.updateComplete;

    expect(element.activeMenu).toBe('tab-menu');

    // Toggle off
    tabBar!.dispatchEvent(new CustomEvent('menu-clicked', { bubbles: true }));
    await element.updateComplete;

    expect(element.activeMenu).toBeNull();
  });

  it('renders menu panels', () => {
    const panels = element.shadowRoot!.querySelectorAll('panel-menu');
    expect(panels.length).toBe(2); // tab menu and hamburger menu
  });

  describe('Context Menu', () => {
    it('renders context menu component', () => {
      const contextMenu = element.shadowRoot!.querySelector('context-menu');
      expect(contextMenu).toBeTruthy();
    });

    it('shows context menu on right click in chrome area', async () => {
      const contextMenu = element.shadowRoot!.querySelector('context-menu') as ContextMenu;
      const showSpy = vi.spyOn(contextMenu, 'show');

      // Right click on tab bar - dispatch on the element itself since listener is on host
      const event = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: 100,
        clientY: 50,
        composed: true,
      });

      // Mock the composedPath to return tab-bar element
      const tabBar = element.shadowRoot!.querySelector('.tab-bar');
      Object.defineProperty(event, 'composedPath', {
        value: () => [tabBar, element.shadowRoot, element],
      });

      element.dispatchEvent(event);
      await element.updateComplete;

      expect(showSpy).toHaveBeenCalled();
      expect(showSpy).toHaveBeenCalledWith(100, 50, expect.any(Array));
      expect(event.defaultPrevented).toBe(true);
    });

    it('does not show context menu in content area', async () => {
      const contextMenu = element.shadowRoot!.querySelector('context-menu') as ContextMenu;
      const showSpy = vi.spyOn(contextMenu, 'show');

      // Right click in content area
      const contentArea = element.shadowRoot!.querySelector('.main-content');
      const event = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        clientX: 300,
        clientY: 300,
        composed: true,
      });

      // Mock the composedPath to return content area element
      Object.defineProperty(event, 'composedPath', {
        value: () => [contentArea, element.shadowRoot, element],
      });

      element.dispatchEvent(event);
      await element.updateComplete;

      expect(showSpy).not.toHaveBeenCalled();
      expect(event.defaultPrevented).toBe(false);
    });

    it('provides different menu items for different areas', async () => {
      const contextMenu = element.shadowRoot!.querySelector('context-menu') as ContextMenu;
      const showSpy = vi.spyOn(contextMenu, 'show');

      // Click on navigation bar
      const navBar = element.shadowRoot!.querySelector('navigation-bar');
      const event = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        composed: true,
      });

      // Mock the composedPath to return navigation bar element
      Object.defineProperty(event, 'composedPath', {
        value: () => [navBar, element.shadowRoot, element],
      });

      element.dispatchEvent(event);
      await element.updateComplete;

      expect(showSpy).toHaveBeenCalled();
      const menuItems = showSpy.mock.calls[0][2] as ContextMenuItem[];
      const menuLabels = menuItems.filter((item) => item.label).map((item) => item.label);

      expect(menuLabels).toContain('Back');
      expect(menuLabels).toContain('Forward');
      expect(menuLabels).toContain('Reload');
      expect(menuLabels).toContain('Bookmark This Page');
    });
  });

  describe('Hamburger Menu', () => {
    it('opens hamburger menu when navigation bar emits menu-clicked', async () => {
      expect(element.activeMenu).toBeNull();

      // Simulate hamburger menu click
      const navBar = element.shadowRoot!.querySelector('navigation-bar');
      navBar!.dispatchEvent(new CustomEvent('menu-clicked', { bubbles: true }));
      await element.updateComplete;

      expect(element.activeMenu).toBe('hamburger');

      // Check that the panel-menu is open
      const panelMenus = element.shadowRoot!.querySelectorAll('panel-menu');
      const hamburgerMenu = panelMenus[1] as HTMLElement & { open: boolean }; // Second panel is hamburger menu
      expect(hamburgerMenu.getAttribute('style')).toContain('width: 320px');
      expect(hamburgerMenu.open).toBe(true);
    });

    it('renders all hamburger menu items', async () => {
      // Open the menu
      const navBar = element.shadowRoot!.querySelector('navigation-bar');
      navBar!.dispatchEvent(new CustomEvent('menu-clicked', { bubbles: true }));
      await element.updateComplete;

      const hamburgerMenu = element.shadowRoot!.querySelectorAll('panel-menu')[1];
      const menuItems = hamburgerMenu.querySelectorAll('.menu-item');
      const menuLabels = Array.from(menuItems).map((item) => {
        const label = item.querySelector('.menu-item-label');
        return label ? label.textContent : '';
      });

      // Check for all expected items
      expect(menuLabels).toContain('New Tab');
      expect(menuLabels).toContain('New Window');
      expect(menuLabels).toContain('New Private Window');
      expect(menuLabels).toContain('Bookmarks');
      expect(menuLabels).toContain('History');
      expect(menuLabels).toContain('Downloads');
      expect(menuLabels).toContain('Passwords');
      expect(menuLabels).toContain('Extensions and themes');
      expect(menuLabels).toContain('Print…');
      expect(menuLabels).toContain('Save page as…');
      expect(menuLabels).toContain('Find in page…');
      expect(menuLabels).toContain('Translate page…');
      expect(menuLabels).toContain('Zoom');
      expect(menuLabels).toContain('Settings');
      expect(menuLabels).toContain('More tools');
      expect(menuLabels).toContain('Help');

      expect(menuItems.length).toBe(16);
    });

    it('renders keyboard shortcuts in hamburger menu', async () => {
      // Open the menu
      const navBar = element.shadowRoot!.querySelector('navigation-bar');
      navBar!.dispatchEvent(new CustomEvent('menu-clicked', { bubbles: true }));
      await element.updateComplete;

      const hamburgerMenu = element.shadowRoot!.querySelectorAll('panel-menu')[1];
      const shortcuts = hamburgerMenu.querySelectorAll('.menu-item-shortcut');
      const shortcutTexts = Array.from(shortcuts).map((s) => s.textContent);

      expect(shortcutTexts).toContain('⌘T');
      expect(shortcutTexts).toContain('⌘N');
      expect(shortcutTexts).toContain('⇧⌘P');
      expect(shortcutTexts).toContain('⌘Y');
      expect(shortcutTexts).toContain('⇧⌘J');
      expect(shortcutTexts).toContain('⌘P');
      expect(shortcutTexts).toContain('⌘S');
      expect(shortcutTexts).toContain('⌘F');
      expect(shortcutTexts).toContain('100%'); // Zoom level
    });

    it('renders submenu indicators', async () => {
      // Open the menu
      const navBar = element.shadowRoot!.querySelector('navigation-bar');
      navBar!.dispatchEvent(new CustomEvent('menu-clicked', { bubbles: true }));
      await element.updateComplete;

      const hamburgerMenu = element.shadowRoot!.querySelectorAll('panel-menu')[1];
      const submenuItems = hamburgerMenu.querySelectorAll('.menu-item.has-submenu');

      expect(submenuItems.length).toBe(4); // Bookmarks, History, More tools, Help

      const submenuLabels = Array.from(submenuItems).map((item) => {
        const label = item.querySelector('.menu-item-label');
        return label ? label.textContent : '';
      });

      expect(submenuLabels).toContain('Bookmarks');
      expect(submenuLabels).toContain('History');
      expect(submenuLabels).toContain('More tools');
      expect(submenuLabels).toContain('Help');
    });

    it('closes menu when clicking outside', async () => {
      // Open the menu
      const navBar = element.shadowRoot!.querySelector('navigation-bar');
      navBar!.dispatchEvent(new CustomEvent('menu-clicked', { bubbles: true }));
      await element.updateComplete;
      expect(element.activeMenu).toBe('hamburger');

      // Click outside
      document.body.click();
      await element.updateComplete;

      expect(element.activeMenu).toBeNull();
    });

    it('keeps menu open when clicking on menu-button', async () => {
      // Open the menu
      const navBar = element.shadowRoot!.querySelector('navigation-bar');
      navBar!.dispatchEvent(new CustomEvent('menu-clicked', { bubbles: true }));
      await element.updateComplete;
      expect(element.activeMenu).toBe('hamburger');

      // Create a click event on element with menu-button class
      const menuButton = document.createElement('button');
      menuButton.className = 'menu-button';
      document.body.appendChild(menuButton);

      const event = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(event, 'composedPath', {
        value: () => [menuButton],
      });

      document.dispatchEvent(event);
      await element.updateComplete;

      // Menu should still be open
      expect(element.activeMenu).toBe('hamburger');

      // Cleanup
      document.body.removeChild(menuButton);
    });
  });
});
