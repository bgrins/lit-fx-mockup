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
});
