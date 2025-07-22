import { describe, it, expect, beforeEach } from 'vitest';
import './navigation-bar';
import type { NavigationBar } from './navigation-bar';

describe('NavigationBar', () => {
  let element: NavigationBar;

  beforeEach(async () => {
    document.body.innerHTML = '<navigation-bar></navigation-bar>';
    element = document.querySelector('navigation-bar') as NavigationBar;
    await element.updateComplete;
  });

  it('renders navigation buttons', () => {
    const buttons = element.shadowRoot!.querySelectorAll('.nav-button');
    expect(buttons.length).toBeGreaterThan(0);

    const backButton = element.shadowRoot!.querySelector('button[disabled]');
    expect(backButton).toBeTruthy();
  });

  it('renders URL bar with default value', () => {
    const urlInput = element.shadowRoot!.querySelector('.urlbar-input') as HTMLInputElement;
    expect(urlInput).toBeTruthy();
    expect(urlInput.value).toBe('wikipedia.org');
  });

  it('shows lock icon in URL bar', () => {
    const lockIcon = element.shadowRoot!.querySelector('.lock-icon');
    expect(lockIcon).toBeTruthy();
  });

  it('emits navigate event on Enter key', async () => {
    let navigatedUrl: string | null = null;
    element.addEventListener('navigate', (e: Event) => {
      navigatedUrl = (e as CustomEvent).detail.url;
    });

    const urlInput = element.shadowRoot!.querySelector('.urlbar-input') as HTMLInputElement;
    urlInput.value = 'example.com';
    urlInput.dispatchEvent(new Event('input'));

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    urlInput.dispatchEvent(enterEvent);

    await element.updateComplete;
    expect(navigatedUrl).toBe('example.com');
  });

  it('emits menu-clicked event when hamburger menu is clicked', async () => {
    let menuClicked = false;
    element.addEventListener('menu-clicked', () => {
      menuClicked = true;
    });

    const menuButton = element.shadowRoot!.querySelector(
      'button[title="Open application menu"]'
    ) as HTMLButtonElement;
    menuButton.click();

    await element.updateComplete;
    expect(menuClicked).toBe(true);
  });
});
