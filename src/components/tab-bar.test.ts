import { describe, it, expect, beforeEach } from 'vitest';
import './tab-bar';
import type { TabBar } from './tab-bar';

describe('TabBar', () => {
  let element: TabBar;

  beforeEach(async () => {
    document.body.innerHTML = '<tab-bar></tab-bar>';
    element = document.querySelector('tab-bar') as TabBar;
    await element.updateComplete;
  });

  it('renders with default tabs', () => {
    const tabs = element.shadowRoot!.querySelectorAll('.tab');
    expect(tabs.length).toBe(3); // Firefox View + 2 other tabs
  });

  it('marks first tab as active by default', () => {
    const activeTab = element.shadowRoot!.querySelector('.tab.active');
    expect(activeTab).toBeTruthy();
    expect(activeTab!.textContent).toContain('Wikipedia');
  });

  it('creates new tab when new tab button is clicked', async () => {
    const newTabButton = element.shadowRoot!.querySelector('.new-tab') as HTMLButtonElement;
    newTabButton.click();
    await element.updateComplete;

    const tabs = element.shadowRoot!.querySelectorAll('.tab');
    expect(tabs.length).toBe(4); // 3 default + 1 new

    // Check that new tab has "New Tab" title
    const newTab = tabs[3] as HTMLElement;
    const tabTitle = newTab.querySelector('.tab-title');
    expect(tabTitle?.textContent).toBe('New Tab');
  });

  it('switches active tab when clicking on inactive tab', async () => {
    const tabs = element.shadowRoot!.querySelectorAll('.tab');
    const secondTab = tabs[1] as HTMLElement;

    secondTab.click();
    await element.updateComplete;

    expect(secondTab.classList.contains('active')).toBe(true);
    expect(tabs[0].classList.contains('active')).toBe(false);
  });

  it('emits tab-closed event when close button is clicked', async () => {
    let closedTabId: string | null = null;
    element.addEventListener('tab-closed', (e: Event) => {
      closedTabId = (e as CustomEvent).detail.tabId;
    });

    const closeButton = element.shadowRoot!.querySelector('.tab-close') as HTMLButtonElement;
    closeButton.click();
    await element.updateComplete;

    expect(closedTabId).toBeTruthy();
  });

  it('prevents closing the last non-Firefox-view tab', async () => {
    // First, close one of the regular tabs
    const closeButtons = element.shadowRoot!.querySelectorAll(
      '.tab-close'
    ) as NodeListOf<HTMLButtonElement>;
    closeButtons[0].click(); // Close the first regular tab (Wikipedia)
    await element.updateComplete;

    // Verify we now have 2 tabs (Firefox View + 1 regular tab)
    let tabs = element.shadowRoot!.querySelectorAll('.tab');
    expect(tabs.length).toBe(2);

    // Try to close the last remaining regular tab
    const remainingCloseButton = element.shadowRoot!.querySelector(
      '.tab-close'
    ) as HTMLButtonElement;
    let closedTabId: string | null = null;
    element.addEventListener('tab-closed', (e: Event) => {
      closedTabId = (e as CustomEvent).detail.tabId;
    });

    remainingCloseButton.click();
    await element.updateComplete;

    // Verify the tab was NOT closed
    tabs = element.shadowRoot!.querySelectorAll('.tab');
    expect(tabs.length).toBe(2); // Should still have 2 tabs
    expect(closedTabId).toBe(null); // No tab-closed event should have been emitted
  });

  it('allows closing tabs when there are multiple non-Firefox-view tabs', async () => {
    // Add a new tab first
    const newTabButton = element.shadowRoot!.querySelector('.new-tab') as HTMLButtonElement;
    newTabButton.click();
    await element.updateComplete;

    // Now we have 4 tabs total (Firefox View + 3 regular tabs)
    let tabs = element.shadowRoot!.querySelectorAll('.tab');
    expect(tabs.length).toBe(4);

    // Close one regular tab
    const closeButton = element.shadowRoot!.querySelector('.tab-close') as HTMLButtonElement;
    closeButton.click();
    await element.updateComplete;

    // Should have 3 tabs now
    tabs = element.shadowRoot!.querySelectorAll('.tab');
    expect(tabs.length).toBe(3);
  });

  it('shows new tab button inline when no overflow', async () => {
    const inlineButton = element.shadowRoot!.querySelector('.new-tab.inline');
    const overflowButton = element.shadowRoot!.querySelector('.new-tab.overflow');

    expect(inlineButton).toBeTruthy();
    expect(overflowButton).toBeFalsy();
  });

  it('positions new tab button next to menu when overflow detected', async () => {
    // Mock the container width to simulate overflow
    element.hasOverflow = true;
    await element.updateComplete;

    const inlineButton = element.shadowRoot!.querySelector('.new-tab.inline');
    const overflowButton = element.shadowRoot!.querySelector('.new-tab.overflow');

    expect(inlineButton).toBeFalsy();
    expect(overflowButton).toBeTruthy();
  });

  it('emits menu-clicked event when menu button is clicked', async () => {
    let menuClicked = false;
    element.addEventListener('menu-clicked', () => {
      menuClicked = true;
    });

    const menuButton = element.shadowRoot!.querySelector('.menu-button') as HTMLButtonElement;
    menuButton.click();
    await element.updateComplete;

    expect(menuClicked).toBe(true);
  });
});
