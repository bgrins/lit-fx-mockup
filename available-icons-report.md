# Available SVG Icons for Firefox Mockup

## Current Icon Usage

The navigation bar component currently uses placeholder icon content. Based on the available SVG files in the `src/assets` directory, here are the suitable icons for each UI element:

## Navigation Buttons

### 1. **Back Button**
- **Available icon**: `/src/assets/browser/themes/shared/icons/back.svg`
- **Current**: Using placeholder arrow path

### 2. **Forward Button**
- **Available icon**: `/src/assets/browser/themes/shared/icons/forward.svg`
- **Current**: Using placeholder arrow path

### 3. **Refresh Button**
- **Available icon**: `/src/assets/browser/themes/shared/icons/reload-to-stop.svg` (animated transition icon)
- **Alternative**: Could extract just the reload portion from the animated SVG
- **Current**: Using placeholder circular arrow path

### 4. **Home Button**
- **Available icon**: `/src/assets/browser/themes/shared/icons/home.svg`
- **Current**: Using placeholder house path

## Toolbar Icons

### 5. **Extensions (Puzzle Piece)**
- **No direct puzzle piece icon found**
- **Alternatives**: 
  - `/src/assets/browser/themes/shared/addons/addon-install-installed.svg`
  - Could use a generic extensions representation
- **Current**: Using placeholder puzzle piece path

### 6. **Profile/Account Button**
- **Available icon**: `/src/assets/browser/themes/shared/fxa/avatar.svg`
- **Description**: Circle with user silhouette
- **Current**: Using placeholder circle path

### 7. **Menu (Hamburger) Button**
- **Available icon**: `/src/assets/browser/themes/shared/icons/menu.svg`
- **Alternative**: `/src/assets/browser/themes/shared/icons/menu-badged.svg` (with notification badge)
- **Current**: Using placeholder three-line path

## Other Available UI Icons

### Tab Bar
- **Firefox View**: `/src/assets/browser/themes/shared/icons/firefox-view.svg`
- **New Tab**: `/src/assets/browser/themes/shared/icons/new-tab.svg`
- **Tab**: `/src/assets/browser/themes/shared/icons/tab.svg`
- **Tab Audio Playing**: `/src/assets/browser/themes/shared/tabbrowser/tab-audio-playing-small.svg`
- **Tab Audio Muted**: `/src/assets/browser/themes/shared/tabbrowser/tab-audio-muted-small.svg`
- **Tab Loading**: `/src/assets/browser/themes/shared/tabbrowser/loading.svg`
- **Tab Crashed**: `/src/assets/browser/themes/shared/tabbrowser/crashed.svg`

### Sidebar
- **Sidebar Expanded**: `/src/assets/browser/themes/shared/icons/sidebar-expanded.svg`
- **Sidebar Collapsed**: `/src/assets/browser/themes/shared/icons/sidebar-collapsed.svg`
- **Sidebars**: `/src/assets/browser/themes/shared/icons/sidebars.svg`

### Bookmarks
- **Bookmark**: `/src/assets/browser/themes/shared/icons/bookmark.svg`
- **Bookmark Hollow**: `/src/assets/browser/themes/shared/icons/bookmark-hollow.svg`
- **Bookmarks Toolbar**: `/src/assets/browser/themes/shared/icons/bookmarks-toolbar.svg`

### Other Useful Icons
- **History**: `/src/assets/browser/themes/shared/icons/history.svg`
- **Downloads**: `/src/assets/browser/themes/shared/icons/downloads.svg` (if exists)
- **Settings/Preferences**: Various preference category icons available
- **Private Browsing**: `/src/assets/browser/themes/shared/icons/privateBrowsing.svg`
- **Reader Mode**: `/src/assets/browser/themes/shared/icons/reader-mode.svg`
- **Screenshot**: `/src/assets/browser/themes/shared/icons/screenshot.svg`
- **Fullscreen**: `/src/assets/browser/themes/shared/icons/fullscreen.svg`
- **Print**: `/src/assets/browser/themes/shared/icons/print.svg` (if exists)
- **Save**: `/src/assets/browser/themes/shared/icons/save.svg`

### URL Bar Icons
- **Lock (HTTPS)**: Could use identity/permission icons from `/src/assets/browser/themes/shared/identity-block/`
- **Tracking Protection**: `/src/assets/browser/themes/shared/identity-block/tracking-protection.svg`
- **Permissions**: `/src/assets/browser/themes/shared/identity-block/permissions.svg`

## Implementation Notes

1. The SVG files should be imported and used directly in the components
2. Most Firefox icons use `fill="context-fill"` to inherit color from CSS
3. Standard icon sizes in Firefox are typically 16x16 or 20x20 pixels
4. Icons should maintain consistent stroke width and visual weight

## Missing Icons

The following icons are currently using placeholders but don't have exact matches:
- **Extensions/Puzzle Piece**: No direct puzzle piece icon found, may need to use addon-related icons or create custom
- **Some toolbar actions**: May need to use alternative representations or combine existing icons