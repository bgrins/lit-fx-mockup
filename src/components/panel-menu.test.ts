import { describe, it, expect, beforeEach } from 'vitest';
import './panel-menu';
import type { PanelMenu } from './panel-menu';

describe('PanelMenu', () => {
  let element: PanelMenu;

  beforeEach(async () => {
    document.body.innerHTML = '<panel-menu title="Test Menu"></panel-menu>';
    element = document.querySelector('panel-menu') as PanelMenu;
    await element.updateComplete;
  });

  it('renders with title', () => {
    const header = element.shadowRoot!.querySelector('.panel-header');
    expect(header).toBeTruthy();
    expect(header!.textContent).toBe('Test Menu');
  });

  it('is hidden by default', () => {
    const panel = element.shadowRoot!.querySelector('.panel');
    expect(panel!.classList.contains('open')).toBe(false);
  });

  it('shows when open property is set', async () => {
    element.open = true;
    await element.updateComplete;

    const panel = element.shadowRoot!.querySelector('.panel');
    expect(panel!.classList.contains('open')).toBe(true);
  });

  it('renders slot content', async () => {
    element.innerHTML = '<div class="test-content">Menu Item</div>';
    await element.updateComplete;

    const slot = element.shadowRoot!.querySelector('slot');
    const assignedNodes = slot!.assignedNodes();
    expect(assignedNodes.length).toBeGreaterThan(0);
  });
});
