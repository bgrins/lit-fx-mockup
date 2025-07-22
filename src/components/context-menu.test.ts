import { describe, it, expect, beforeEach, vi } from 'vitest';
import './context-menu';
import type { ContextMenu, ContextMenuItem } from './context-menu';

describe('ContextMenu', () => {
  let element: ContextMenu;

  beforeEach(async () => {
    document.body.innerHTML = '<context-menu></context-menu>';
    element = document.querySelector('context-menu') as ContextMenu;
    await element.updateComplete;
  });

  it('should create the component', () => {
    expect(element).toBeDefined();
    expect(element.tagName.toLowerCase()).toBe('context-menu');
  });

  it('should be hidden by default', () => {
    expect(element.open).toBe(false);
    expect(element.hasAttribute('open')).toBe(false);
  });

  it('should show menu when show() is called', async () => {
    const items: ContextMenuItem[] = [
      { label: 'Item 1', action: vi.fn() },
      { label: 'Item 2', action: vi.fn() },
    ];

    element.show(100, 200, items);
    await element.updateComplete;

    expect(element.open).toBe(true);
    expect(element.hasAttribute('open')).toBe(true);
    expect(element.x).toBe(100);
    expect(element.y).toBe(200);
    expect(element.items).toEqual(items);
  });

  it('should hide menu when close() is called', async () => {
    element.show(100, 200, [{ label: 'Item 1' }]);
    await element.updateComplete;

    element.close();
    await element.updateComplete;

    expect(element.open).toBe(false);
    expect(element.hasAttribute('open')).toBe(false);
    expect(element.items).toEqual([]);
  });

  it('should render menu items correctly', async () => {
    const items: ContextMenuItem[] = [
      { label: 'Item 1' },
      { separator: true },
      { label: 'Item 2', disabled: true },
      { label: 'Item 3', icon: '/icon.svg' },
    ];

    element.show(0, 0, items);
    await element.updateComplete;

    const menuItems = element.shadowRoot!.querySelectorAll('.menu-item');
    const separators = element.shadowRoot!.querySelectorAll('.separator');

    expect(menuItems.length).toBe(3); // 3 actual items
    expect(separators.length).toBe(1); // 1 separator

    // Check disabled state
    expect(menuItems[1].classList.contains('disabled')).toBe(true);

    // Check icon
    const icon = menuItems[2].querySelector('img');
    expect(icon).toBeTruthy();
    expect(icon?.getAttribute('src')).toBe('/icon.svg');
  });

  it('should call action when menu item is clicked', async () => {
    const mockAction = vi.fn();
    const items: ContextMenuItem[] = [{ label: 'Item 1', action: mockAction }];

    element.show(0, 0, items);
    await element.updateComplete;

    const menuItem = element.shadowRoot!.querySelector('.menu-item') as HTMLElement;
    menuItem.click();

    expect(mockAction).toHaveBeenCalledTimes(1);
    expect(element.open).toBe(false); // Menu should close after click
  });

  it('should not call action for disabled items', async () => {
    const mockAction = vi.fn();
    const items: ContextMenuItem[] = [
      { label: 'Disabled Item', action: mockAction, disabled: true },
    ];

    element.show(0, 0, items);
    await element.updateComplete;

    const menuItem = element.shadowRoot!.querySelector('.menu-item') as HTMLElement;

    // Create and dispatch click event that won't bubble to document
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    menuItem.dispatchEvent(clickEvent);

    expect(mockAction).not.toHaveBeenCalled();
    expect(element.open).toBe(true); // Menu should stay open
  });

  it('should not close menu when clicking submenu items', async () => {
    const items: ContextMenuItem[] = [{ label: 'Submenu Item', submenu: [] }];

    element.show(0, 0, items);
    await element.updateComplete;

    const menuItem = element.shadowRoot!.querySelector('.menu-item') as HTMLElement;

    // Create and dispatch click event that won't bubble to document
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    menuItem.dispatchEvent(clickEvent);

    expect(element.open).toBe(true); // Menu should stay open for submenu items
  });

  it('should position menu at specified coordinates', async () => {
    element.show(150, 250, [{ label: 'Item' }]);
    await element.updateComplete;

    const menu = element.shadowRoot!.querySelector('.menu') as HTMLElement;
    expect(menu.style.left).toBe('150px');
    expect(menu.style.top).toBe('250px');
  });

  it('should close menu on document click outside', async () => {
    element.show(0, 0, [{ label: 'Item' }]);
    await element.updateComplete;

    // Simulate click outside
    document.body.click();

    expect(element.open).toBe(false);
  });

  it('should handle empty items array', async () => {
    element.show(0, 0, []);
    await element.updateComplete;

    const menu = element.shadowRoot!.querySelector('.menu');
    expect(menu).toBeTruthy();
    expect(menu?.children.length).toBe(0);
  });
});
