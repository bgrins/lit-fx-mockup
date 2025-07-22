import { describe, it, expect, beforeEach } from 'vitest';
import './firefox-window';
import type { FirefoxWindow } from './firefox-window';

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
    expect(content!.textContent).toContain('New Tab');
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
});
