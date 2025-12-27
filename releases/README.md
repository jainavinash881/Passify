# 🔐 Passify Release Package

## 📦 Version 1.0.1

This folder contains ready-to-install release packages for Passify browser extension.

## 📥 Downloads

| Browser | File | Size | Download |
|---------|------|------|----------|
| Chrome / Edge / Brave | `passify-v1.0.1-chrome.zip` | 90KB | [Download](passify-v1.0.1-chrome.zip) |
| Firefox | `passify-v1.0.1-firefox.zip` | 90KB | [Download](passify-v1.0.1-firefox.zip) |

## 🚀 Quick Install

### One-Line Install (macOS/Linux)

**Chrome:**
```bash
unzip passify-v1.0.1-chrome.zip -d passify-chrome && open -a "Google Chrome" chrome://extensions/
```

**Firefox:**
```bash
unzip passify-v1.0.1-firefox.zip -d passify-firefox && open -a "Firefox" about:debugging#/runtime/this-firefox
```

**Edge:**
```bash
unzip passify-v1.0.1-chrome.zip -d passify-edge && open -a "Microsoft Edge" edge://extensions/
```

**Brave:**
```bash
unzip passify-v1.0.1-chrome.zip -d passify-brave && open -a "Brave Browser" brave://extensions/
```

### One-Line Install (Windows PowerShell)

**Chrome:**
```powershell
Expand-Archive passify-v1.0.1-chrome.zip -DestinationPath passify-chrome; Start-Process chrome chrome://extensions/
```

**Firefox:**
```powershell
Expand-Archive passify-v1.0.1-firefox.zip -DestinationPath passify-firefox; Start-Process firefox about:debugging#/runtime/this-firefox
```

**Edge:**
```powershell
Expand-Archive passify-v1.0.1-chrome.zip -DestinationPath passify-edge; Start-Process msedge edge://extensions/
```

## 📖 Full Installation Guide

For detailed installation instructions, see [INSTALL.md](INSTALL.md)

## 🔒 Security

- All data stored locally
- No external network requests
- No tracking or analytics
- Open source and auditable

## 📋 System Requirements

### Chrome / Edge / Brave
- Chrome 88+ / Edge 88+ / Brave (latest)
- Manifest V3 support
- Developer mode enabled (for manual installation)

### Firefox
- Firefox 109+
- WebExtensions support
- Temporary add-on support (for testing)

## 🗂️ Package Contents

Each ZIP file contains:
```
passify/
├── manifest.json          # Extension manifest
├── popup.html            # Popup interface
├── manager.html          # Password manager page
├── background.js         # Background script
├── content.js            # Content script
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── assets/               # Compiled CSS and JS
    ├── popup-*.js
    ├── popup-*.css
    ├── manager-*.js
    ├── manager-*.css
    ├── liquidGlass-*.js
    └── liquidGlass-*.css
```

## 🔄 Updating

To update from a previous version:

1. Download the new release ZIP
2. Remove old extension from browser
3. Install new version following the guide
4. Your saved passwords will be preserved

## 🐛 Troubleshooting

### Common Issues

**Extension won't load:**
- Enable Developer mode in browser
- Select the extracted folder, not the ZIP
- Check that manifest.json exists

**Firefox signature error:**
- Use temporary installation for testing
- Or install from Firefox Add-ons store (coming soon)

**Permissions error:**
- Grant all requested permissions
- Reload extension
- Restart browser

For more help, see [INSTALL.md](INSTALL.md) or [open an issue](https://github.com/jainavinash881/passify/issues).

## 📞 Support

- **Documentation**: [INSTALL.md](INSTALL.md)
- **Issues**: [GitHub Issues](https://github.com/jainavinash881/passify/issues)
- **Email**: jainavinash881@gmail.com

## 📄 License

MIT License - See [LICENSE](../LICENSE) for details

## 🔗 Links

- [GitHub Repository](https://github.com/jainavinash881/passify)
- [Full Documentation](../README.md)
- [Privacy Policy](../PRIVACY_POLICY.md)
- [Build Instructions](../BUILD_INSTRUCTIONS.md)

---

**Version**: 1.0.1  
**Release Date**: 2024-12-27  
**Build**: Production  
**Manifest**: V3