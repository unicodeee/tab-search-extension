# tab-search-extension
cmd + shift + A in Microsoft Edge doesn't allow arrow select anymore (which is R-Ridiculous) so I built this as an alternative. 
Enjoy!


## Features

- Search all open tabs by title or URL
- Keyboard navigation with arrow keys
- Press `Enter` to switch to the selected tab
- Press `Esc` to close the popup
- Click a result to switch tabs
- Shows tab favicons, titles, URLs, and window IDs
- Works as an unpacked extension in Edge and Chrome

## Default shortcut

The default shortcut is:

```text
Alt+Shift+A
```

`Ctrl+Shift+A` may be reserved by Edge or Chrome, so this extension uses `Alt+Shift+A` by default.

You can change the shortcut here:

```text
edge://extensions/shortcuts
```

or in Chrome:

```text
chrome://extensions/shortcuts
```

## Installation

### Microsoft Edge

1. Download or clone this repository.
2. Open Edge and go to:

   ```text
   edge://extensions
   ```

3. Turn on **Developer mode**.
4. Click **Load unpacked**.
5. Select the folder containing `manifest.json`.
6. Optional: go to `edge://extensions/shortcuts` and set your preferred keyboard shortcut.

### Google Chrome

1. Download or clone this repository.
2. Open Chrome and go to:

   ```text
   chrome://extensions
   ```

3. Turn on **Developer mode**.
4. Click **Load unpacked**.
5. Select the folder containing `manifest.json`.
6. Optional: go to `chrome://extensions/shortcuts` and set your preferred keyboard shortcut.

## Usage

Open the popup using the extension icon or the configured keyboard shortcut.

Controls:

| Key | Action |
| --- | --- |
| `↑` / `↓` | Move through tab results |
| `Enter` | Switch to the selected tab |
| `Esc` | Close the popup |

You can also click any result to switch to that tab.

## Permissions

This extension requests:

```json
["tabs", "windows"]
```

These permissions are used to:

- Read the list of open tabs
- Display tab titles, URLs, and favicons
- Activate the selected tab
- Focus the window containing that tab

The extension does not collect, store, or transmit any browsing data.

## Project structure

```text
.
├── manifest.json
├── popup.html
├── popup.css
├── popup.js
└── icon.svg
```

## Troubleshooting

### The shortcut does not open the popup

Some keyboard shortcuts are reserved by the browser or operating system.

Open:

```text
edge://extensions/shortcuts
```

or:

```text
chrome://extensions/shortcuts
```

Then assign a different shortcut.

### Clicking or pressing Enter does not switch tabs

Make sure you are using the latest version of the extension files and that the extension has both `tabs` and `windows` permissions in `manifest.json`.

The popup should show an error message if the browser blocks tab switching.

### The popup does not update after editing files

Go to:

```text
edge://extensions
```

or:

```text
chrome://extensions
```

Then click **Reload** on the extension card.

## Development

After changing any file, reload the extension from the browser extensions page.

For quick testing, keep the extension loaded as an unpacked extension and use the browser's built-in extension reload button.

## Packaging

To share the extension manually, zip the contents of the extension folder.

Make sure `manifest.json` is at the root of the ZIP, not inside an extra nested folder.

## License

MIT License

You are free to use, modify, and share this extension.
