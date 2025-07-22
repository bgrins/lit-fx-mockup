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

## Core Components to Implement

1. **FirefoxWindow**: Main container with window controls
2. **TabBar**: Tab management with new tab button
3. **URLBar**: Address bar with basic input functionality
4. **Sidebar**: Collapsible sidebar with tab panels
5. **Toolbar**: Navigation buttons and menu
6. **ContentArea**: Placeholder for web content

## Development Workflow

### Playwright MCP

You have access to the `playwright` tool. I will run a development server in another terminal window at http://localhost:5173/ (or some other port we can discuss if necessary) so you can load and take screenshots of the curernt app.

### Automated Visual Testing
```bash
npm run test:visual  # Compare against reference screenshots
```

### Unit Testing
```bash
npm test  # Run Vitest unit tests
```

### Keyboard Shortcuts
Implement common shortcuts:
- Ctrl/Cmd+T: New tab
- Ctrl/Cmd+W: Close tab
- Ctrl/Cmd+L: Focus URL bar
- Ctrl/Cmd+B: Toggle sidebar

## Implementation Notes
- Start with the window shell and work inward
- Stub out UI transitions for buttons that open additional views
- Use URL hash for initial states, but don't implement full routing
- Focus on extensibility - make it easy to add new components and features