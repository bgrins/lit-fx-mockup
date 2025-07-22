import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('firefox-window')
export class FirefoxWindow extends LitElement {
  @state()
  private isFullscreen = false;

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: 100vw;
      height: 100vh;
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
        <!-- Tab bar will go here -->
      </div>
      <div class="toolbar">
        <!-- Navigation bar with URL bar will go here -->
      </div>
      <div class="content-area">
        <div class="main-content">
          New Tab
        </div>
      </div>
    `;
  }

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