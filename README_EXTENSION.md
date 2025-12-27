# 🔐 Passify - Password Manager Browser Extension

A beautiful and secure password manager browser extension with a liquid glass UI theme. Generate strong passwords, save credentials, and autofill them with ease.

## ✨ Features

- **Password Generation**: Generate passwords with three strength levels:
  - Easy (8 characters)
  - Medium (12 characters)
  - Hard (16 characters)

- **Password Strength Indicator**: Real-time visual feedback on password strength

- **Save Passwords**: Store credentials securely in browser local storage

- **Autofill**: One-click autofill for saved passwords on any website

- **Liquid Glass UI**: Beautiful glassmorphism design with smooth animations

- **Password Detection**: Automatically detects password fields on web pages

## 🚀 Installation

### Development Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build the Extension**
   ```bash
   npm run build:extension
   ```

3. **Load in Chrome/Edge**
   - Open `chrome://extensions/` (or `edge://extensions/`)
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder from the project

4. **Load in Firefox**
   - Open `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file from the `dist` folder

### Production Build

For production, run:
```bash
npm run build:extension
```

The built extension will be in the `dist` folder.

## 📖 Usage

### Generating Passwords

1. Click the Passify extension icon in your browser toolbar
2. Select password strength (Easy, Medium, or Hard)
3. Click "⚡ Generate Password"
4. Copy the generated password or save it

### Saving Passwords

1. Generate or enter a password
2. Click "💾 Save Password"
3. Enter the username/email
4. Click "Save"

### Autofilling Passwords

**Method 1: From Extension Popup**
1. Click the Passify icon
2. Click "📚 View Saved Passwords"
3. Click "⚡ Autofill" on the desired credential

**Method 2: From Password Field**
1. Navigate to a website with a password field
2. Click the 🔐 button that appears next to the password field
3. Select the credential to autofill

## 🎨 UI Theme

The extension features a stunning liquid glass (glassmorphism) design with:
- Translucent glass-like containers
- Backdrop blur effects
- Smooth gradient backgrounds
- Elegant animations
- Responsive hover effects

## 🔒 Security

- All passwords are stored locally in your browser using Chrome Storage API
- No data is sent to external servers
- Passwords are never exposed in plain text in the UI (except when copying)
- Each saved password has a unique ID

## 🛠️ Development

### Project Structure

```
passify/
├── public/
│   ├── manifest.json          # Extension manifest
│   └── icons/                 # Extension icons
├── src/
│   ├── popup/
│   │   ├── Popup.tsx          # Main popup component
│   │   ├── Popup.css          # Popup styles
│   │   └── popup.tsx          # Popup entry point
│   ├── content/
│   │   ├── content.ts         # Content script
│   │   └── content.css        # Content script styles
│   ├── background/
│   │   └── background.ts      # Background service worker
│   ├── utils/
│   │   ├── passwordGenerator.ts  # Password generation logic
│   │   └── storage.ts         # Storage utilities
│   └── styles/
│       └── liquidGlass.css    # Global glass theme styles
├── popup.html                 # Popup HTML
└── vite.config.ts            # Vite configuration
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:extension` - Build extension with manifest
- `npm run lint` - Run ESLint

### Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Chrome Extension APIs** - Browser integration
- **CSS3** - Glassmorphism effects

## 🎯 Roadmap

- [ ] Password encryption
- [ ] Master password protection
- [ ] Password import/export
- [ ] Password history
- [ ] Breach detection
- [ ] Multi-device sync
- [ ] Custom password rules
- [ ] Password categories/folders
- [ ] Search functionality
- [ ] Dark/Light theme toggle

## 📝 Notes

- The extension requires Chrome/Edge 88+ or Firefox 89+ for full functionality
- Icons are currently placeholders - replace with actual icon images for production
- For production use, consider implementing encryption for stored passwords

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Inspired by modern password managers
- UI design inspired by glassmorphism trends
- Built with love using React and TypeScript
