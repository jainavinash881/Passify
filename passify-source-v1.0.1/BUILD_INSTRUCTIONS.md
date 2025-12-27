# Build Instructions for Passify Firefox Extension

This document provides step-by-step instructions for building the Passify browser extension from source code.

## Prerequisites

### Required Software
- **Node.js**: Version 18.17.1 or higher (20.19+ or 22.12+ recommended)
- **npm**: Version 9.0.0 or higher (comes with Node.js)

### Verify Installation
```bash
node --version  # Should show v18.17.1 or higher
npm --version   # Should show 9.0.0 or higher
```

## Build Steps

### 1. Extract Source Code
```bash
unzip passify-source-v1.0.1.zip -d passify-source
cd passify-source
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required dependencies listed in `package.json`, including:
- React 19.2.0
- TypeScript 5.9.3
- Vite 7.3.0
- And other build tools

**Note:** This may take 2-5 minutes depending on your internet connection.

### 3. Build the Extension
```bash
npm run build
```

This command:
1. Compiles TypeScript to JavaScript
2. Bundles React components
3. Optimizes assets
4. Generates the `dist/` folder with the built extension

**Build time:** Approximately 30-60 seconds

### 4. Verify Build Output

After successful build, the `dist/` folder should contain:

```
dist/
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

### 5. Package for Distribution (Optional)

To create a ZIP file identical to the submitted extension:

```bash
cd dist
zip -r ../passify-firefox-built.zip .
cd ..
```

## Build Verification

### Compare with Submitted Package

The built extension should be functionally identical to `passify-firefox-v1.0.1.zip`.

**File sizes may vary slightly** due to:
- Build timestamp differences
- Compression variations
- Source map generation

**To verify:**
```bash
# Check file structure
ls -la dist/

# Verify manifest.json
cat dist/manifest.json

# Check that all required files exist
test -f dist/manifest.json && \
test -f dist/popup.html && \
test -f dist/manager.html && \
test -f dist/background.js && \
test -f dist/content.js && \
echo "✅ All required files present"
```

## Testing the Built Extension

### Load in Firefox
1. Open Firefox
2. Navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select `dist/manifest.json`
5. Extension should load successfully

### Verify Functionality
1. Click extension icon - popup should appear
2. Generate a password - should work
3. Visit a website with password field - autofill button should appear
4. Open password manager - full interface should load

## Troubleshooting

### Issue: "Node.js version too old"
**Solution:** Upgrade Node.js to version 20.19+ or 22.12+
```bash
# Using nvm (recommended)
nvm install 20
nvm use 20
```

### Issue: "npm install fails"
**Solution:** Clear npm cache and retry
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Build fails with TypeScript errors"
**Solution:** Ensure all dependencies are installed
```bash
npm install --legacy-peer-deps
npm run build
```

### Issue: "dist/ folder is empty"
**Solution:** Check build output for errors
```bash
npm run build 2>&1 | tee build.log
```

## Build Environment

### Development Environment Used
- **OS**: macOS (also works on Linux, Windows)
- **Node.js**: v18.17.1
- **npm**: v9.6.7
- **Build Tool**: Vite 7.3.0
- **TypeScript**: 5.9.3

### Build Configuration
- **Entry Points**: 
  - `src/popup/popup.tsx` → `dist/popup.html`
  - `src/manager/manager.tsx` → `dist/manager.html`
  - `src/background/background.ts` → `dist/background.js`
  - `src/content/content.ts` → `dist/content.js`

- **Build Mode**: Production
- **Minification**: Enabled
- **Source Maps**: Disabled (for production)
- **Tree Shaking**: Enabled

## Additional Information

### Source Code Structure
```
src/
├── background/          # Background script
├── content/            # Content script (page injection)
├── popup/              # Extension popup UI
├── manager/            # Password manager page
├── utils/              # Utility functions
├── styles/             # Global styles
└── types/              # TypeScript definitions
```

### Build Scripts
- `npm run build` - Production build
- `npm run dev` - Development mode with hot reload
- `npm run preview` - Preview production build

### Dependencies
All dependencies are listed in `package.json` and will be installed from npm registry.

**No external or proprietary dependencies are used.**

## Contact

For build issues or questions:
- Check existing documentation in the source package
- Review `README.md` for project overview
- See `PUBLISHING_GUIDE.md` for publishing details

## Verification Checklist

- [ ] Node.js 18.17.1+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] Build completed successfully (`npm run build`)
- [ ] `dist/` folder contains all required files
- [ ] Extension loads in Firefox without errors
- [ ] All features work as expected

---

**Build Date**: 2024-12-27  
**Version**: 1.0.1  
**Build Tool**: Vite 7.3.0  
**Target**: Firefox Browser Extension (Manifest V3)