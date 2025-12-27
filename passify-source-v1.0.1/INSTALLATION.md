# 🚀 Passify Extension - Installation Guide

## ✅ Build Status
Extension has been successfully built and is ready to install!

## 📁 Installation Files
All necessary files are in the `dist/` folder:
- ✅ manifest.json (extension configuration)
- ✅ popup.html (popup interface)
- ✅ background.js (background service worker)
- ✅ content.js (content script for password detection)
- ✅ assets/ (CSS and JS bundles)
- ✅ icons/ (extension icons)

## 🌐 Chrome/Edge Installation

1. **Open Extensions Page**
   - Chrome: Navigate to `chrome://extensions/`
   - Edge: Navigate to `edge://extensions/`

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load Extension**
   - Click "Load unpacked" button
   - Navigate to and select the `passify/dist` folder
   - Click "Select Folder"

4. **Verify Installation**
   - You should see "Passify - Password Manager" in your extensions list
   - The extension icon (🔐) should appear in your browser toolbar

## 🦊 Firefox Installation

1. **Open Debugging Page**
   - Navigate to `about:debugging#/runtime/this-firefox`

2. **Load Temporary Add-on**
   - Click "Load Temporary Add-on..." button
   - Navigate to `passify/dist` folder
   - Select the `manifest.json` file
   - Click "Open"

3. **Verify Installation**
   - The extension should appear in the list
   - Note: In Firefox, temporary extensions are removed when you close the browser

## 🎯 First Use

### Quick Access (Popup)
1. **Click the Extension Icon**
   - Look for the 🔐 icon in your browser toolbar
   - Click it to open the password manager popup

2. **Generate a Password**
   - Select strength level (Easy, Medium, or Hard)
   - Click "⚡ Generate Password"
   - Copy or save the generated password

3. **Save Passwords**
   - After generating a password, click "💾 Save Password"
   - Enter the username/email
   - Click "Save"

### Full Password Manager Page
1. **Open Password Manager**
   - Click extension icon
   - Click "🔓 Open Password Manager" button
   - A new tab opens with full password management interface

2. **Manage All Passwords**
   - View all saved passwords in a grid layout
   - Search and filter passwords
   - Add, edit, or delete passwords
   - See password strength indicators
   - Copy passwords with one click

### Autofill Passwords
1. **Method 1: From Website**
   - Visit any website with a password field
   - Look for the 🔐 button next to password fields
   - Click to open autofill options

2. **Method 2: From Extension**
   - Open the extension popup
   - Click "📚 View Saved Passwords"
   - Click "⚡ Autofill" on any saved credential

## 🎨 Features Overview

### Password Generation
- **Easy**: 8 characters (letters + numbers)
- **Medium**: 12 characters (letters + numbers + symbols)
- **Hard**: 16 characters (letters + numbers + symbols)

### Password Strength Indicator
- Real-time visual feedback
- Color-coded strength levels (Red/Orange/Green)
- Percentage-based strength score

### Liquid Glass UI
- Beautiful glassmorphism design
- Smooth animations and transitions
- Purple/pink gradient theme
- Responsive hover effects

### Security Features
- Local storage only (no external servers)
- Passwords stored in browser's secure storage
- No data transmission
- Unique IDs for each saved password

## 🔧 Troubleshooting

### Extension Not Loading
- Make sure you selected the `dist` folder, not the root `passify` folder
- Check that all files exist in the `dist` folder
- Try rebuilding: `cd passify && npm run build:extension`

### Popup Not Opening
- Check browser console for errors (F12)
- Verify manifest.json is valid
- Try reloading the extension

### Autofill Not Working
- Make sure you're on a page with password fields
- Check that the content script is injected (look for 🔐 button)
- Verify the extension has necessary permissions

### Icons Not Showing
- Icons are currently text placeholders
- For production, replace files in `public/icons/` with actual PNG images
- Rebuild after replacing icons

## 📝 Development

### Rebuild Extension
```bash
cd passify
npm run build:extension
```

### Development Mode
```bash
cd passify
npm run dev
```

### Project Structure
```
passify/
├── dist/              # Built extension (load this folder)
├── src/
│   ├── popup/        # Popup UI components
│   ├── content/      # Content script
│   ├── background/   # Background service worker
│   ├── utils/        # Utilities (password gen, storage)
│   └── styles/       # Global styles
└── public/
    ├── manifest.json # Extension manifest
    └── icons/        # Extension icons
```

## 🎉 You're All Set!

The extension is now ready to use. Enjoy secure password management with a beautiful liquid glass interface!

For more details, see `README_EXTENSION.md`