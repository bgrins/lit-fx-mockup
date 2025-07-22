# Firefox UI Mockup Project

## Overview
This project creates an interactive mockup of the modern Firefox UI using TypeScript and Lit web components. The mockup should precisely match Firefox's visual design while providing basic interactive functionality.

## Key Technologies
- **TypeScript**: For type safety and modern JavaScript features
- **Lit**: Web Components framework for building UI components
- **Vitest**: Unit testing framework
- **Playwright**: Visual regression testing against reference screenshots

## Architecture Principles

### Component Structure
- Each major UI element should be its own Lit component
- Components should be self-contained with their own styles
- Use CSS custom properties for theming consistency
- Follow Firefox's actual component hierarchy where possible

### State Management
- Use reactive properties for component state
- Implement a simple event-based system for cross-component communication
- Tab state, sidebar state, and URL bar content should be managed centrally

### Visual Accuracy
- Screenshots in `screenshots/` directory are the source of truth
- Use Playwright to compare mockup against reference images
- Match colors, spacing, borders, and shadows precisely
- Window controls should be visually present (functionality optional)

## Component Structure and Information Architecture

### Implemented Components

#### 1. **FirefoxWindow** (`src/components/firefox-window.ts`)
The main container component that orchestrates the entire Firefox UI.
- **Features:**
  - macOS window controls (close, minimize, maximize)
  - Manages active menu state for flyout panels
  - Handles document-level click events for menu dismissal
  - Renders child components in proper layout hierarchy
- **State Management:**
  - `isFullscreen`: Boolean for window state
  - `activeMenu`: String tracking which menu panel is open

#### 2. **TabBar** (`src/components/tab-bar.ts`)
Horizontal tab strip with tab management functionality.
- **Features:**
  - Firefox View tab (special system tab)
  - Regular browsing tabs with favicons and titles
  - Active tab highlighting
  - Tab close buttons (with hover states)
  - New tab button (+)
  - Tab overflow menu button (down caret ▾)
- **State Management:**
  - `tabs`: Array of tab objects with id, title, favicon, and active state
  - `activeTabId`: Currently active tab identifier
- **Events Emitted:**
  - `tab-activated`: When user clicks a tab
  - `tab-closed`: When user closes a tab
  - `new-tab`: When user clicks new tab button
  - `menu-clicked`: When user clicks tab overflow menu

#### 3. **NavigationBar** (`src/components/navigation-bar.ts`)
Navigation toolbar containing URL bar and action buttons.
- **Features:**
  - Back/Forward buttons (disabled by default)
  - Refresh button
  - Home button
  - URL bar with lock icon and input field
  - Extensions button (puzzle piece)
  - Account/Profile button
  - Application menu button (hamburger ≡)
- **State Management:**
  - `url`: Current URL display
  - `inputValue`: URL bar input value
- **Events Emitted:**
  - `navigate-back`, `navigate-forward`: Navigation actions
  - `refresh`: Refresh page
  - `navigate-home`: Go to home page
  - `navigate`: When user presses Enter in URL bar
  - `menu-clicked`: When hamburger menu is clicked

#### 4. **PanelMenu** (`src/components/panel-menu.ts`)
Reusable flyout menu panel component.
- **Features:**
  - Animated show/hide transitions
  - Optional title header
  - Slot-based content projection
  - Drop shadow and proper z-indexing
- **Props:**
  - `open`: Boolean to control visibility
  - `title`: Optional header text
  - `anchor`: Position relative to trigger (unused currently)
- **Helper Methods:**
  - `renderMenuItem()`: Creates consistent menu items
  - `renderSeparator()`: Creates menu dividers

### Menu Panels (Defined in FirefoxWindow)

1. **Tab Overflow Menu** (triggered by down caret in tab bar)
   - Search Tabs...
   - Close Tab operations
   - Move Tab
   - Reopen Closed Tab

2. **Application Menu** (triggered by hamburger in navigation bar)
   - New Window/Private Window
   - Bookmarks, History, Downloads
   - Add-ons and Themes
   - Settings
   - More Tools, Help

### Layout Hierarchy

```
FirefoxWindow
├── Titlebar (with macOS window controls)
├── TabBar
│   ├── Firefox View Tab
│   ├── Regular Tabs
│   ├── New Tab Button
│   └── Tab Menu Button (▾)
├── NavigationBar (Toolbar)
│   ├── Navigation Buttons
│   ├── URL Bar
│   └── Action Buttons (Extensions, Profile, Menu ≡)
├── ContentArea
│   └── Main Content (placeholder)
└── Panel Menus (absolutely positioned)
    ├── Tab Menu Panel
    └── Application Menu Panel
```

### Styling Architecture

- **CSS Custom Properties**: Defined in `src/styles/global.css` for consistent theming
- **Shadow DOM**: Each component uses Shadow DOM for style encapsulation
- **Responsive**: Window-level responsive behavior with max dimensions
- **macOS Integration**: Native window shadow and controls styling

### Future Components to Implement

1. **Sidebar**: Collapsible sidebar with bookmark/history panels
2. **BookmarksToolbar**: Optional bookmarks bar below navigation
3. **FindBar**: In-page search functionality
4. **CustomizationPanel**: UI customization options
5. **ExtensionPopups**: Extension-specific panels

### Maintenance Notes

**IMPORTANT**: When modifying or adding components, update this section to reflect:
- New components and their responsibilities
- State management changes
- New events or props
- Changes to the layout hierarchy
- Updates to menu structures

## Development Workflow

### Playwright MCP

You have access to the `playwright` tool. I will run a development server in another terminal window at http://localhost:5173/ (or some other port we can discuss if necessary) so you can load and take screenshots of the curernt app.

### Automated Visual Testing
```bash
npm run test:visual  # Compare against reference screenshots
```

The Playwright HTML report is automatically served at http://localhost:9323/ after running visual tests. You can navigate to this URL using the Playwright browser tools to view:
- Test results and pass/fail status
- Visual comparisons between actual and expected screenshots
- Test execution timeline and steps
- Any differences highlighted in failed tests

### Unit Testing
```bash
npm test  # Run Vitest unit tests
```

### Precommit checklist

- `npm run precommit`. Fix all errors, do not be lazy.
- `npm run test`. Fix all errors, do not be lazy.

### Keyboard Shortcuts

The mockup detects your platform and uses appropriate modifiers:

**On macOS:**
- **Cmd+T**: New tab (may be intercepted by browser)
- **Cmd+W**: Close current tab (may be intercepted by browser)
- **Cmd+L**: Focus URL bar
- **Cmd+1-9**: Switch to tab by number
- **Cmd+Shift+T**: Toggle between light/dark theme

**On Windows/Linux:**
- **Alt+T**: New tab
- **Alt+W**: Close current tab
- **Alt+L**: Focus URL bar
- **Alt+1-9**: Switch to tab by number
- **Alt+Shift+T**: Toggle between light/dark theme

**Fallback shortcuts (all platforms):**
- **Ctrl+N**: New tab
- **Ctrl+Shift+T**: Toggle theme

The implementation includes:
- Platform detection to use Cmd on Mac, Alt on others
- Debug logging for all key events
- Visual feedback when shortcuts are triggered
- On-screen help showing available shortcuts

## Implementation Notes
- Start with the window shell and work inward
- Stub out UI transitions for buttons that open additional views
- Use URL hash for initial states, but don't implement full routing
- Focus on extensibility - make it easy to add new components and features
- DO NOT keep things around for backwards compatibility. This is a rapid development environment, just update test assertions and delete the old code when applicable.
