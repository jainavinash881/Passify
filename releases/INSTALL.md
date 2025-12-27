# 🔐 Passify Installation Guide

Welcome! This guide will help you install Passify browser extension from the release package.

## 📦 What's Included

This release package contains:
- `passify-v1.0.1-chrome.zip` - For Chrome, Edge, Brave, and other Chromium browsers
- `passify-v1.0.1-firefox.zip` - For Firefox
- `INSTALL.md` - This installation guide

## 🚀 Quick Install

### Option 1: Chrome / Edge / Brave (Chromium Browsers)

#### Step 1: Download
Download `passify-v1.0.1-chrome.zip` from the releases folder.

#### Step 2: Extract
```bash
# Using command line
unzip passify-v1.0.1-chrome.zip -d passify-chrome

# Or right-click the ZIP file and select "Extract All..."
```

#### Step 3: Install in Browser

**Chrome:**
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the extracted `passify-chrome` folder
5. Done! The extension icon should appear in your toolbar

**Edge:**
1. Open Edge and navigate to `edge://extensions/`
2. Enable "Developer mode" (toggle in left sidebar)
3. Click "Load unpacked"
4. Select the extracted `passify-chrome` folder
5. Done! The extension icon should appear in your toolbar

**Brave:**
1. Open Brave and navigate to `brave://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the extracted `passify-chrome` folder
5. Done! The extension icon should appear in your toolbar

---

### Option 2: Firefox

#### Step 1: Download
Download `passify-v1.0.1-firefox.zip` from the releases folder.

#### Step 2: Extract
```bash
# Using command line
unzip passify-v1.0.1-firefox.zip -d passify-firefox

# Or right-click the ZIP file and select "Extract All..."
```

#### Step 3: Install in Browser

**Temporary Installation (for testing):**
1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on..."
3. Navigate to the extracted folder
4. Select `manifest.json`
5. Done! The extension will work until you close Firefox

**Permanent Installation:**
Firefox requires extensions to be signed. You have two options:

**A) Install from Firefox Add-ons Store (Recommended):**
- Visit: [Firefox Add-ons](https://addons.mozilla.org/firefox/) (link coming soon)
- Click "Add to Firefox"

**B) Disable Signature Verification (Developer Mode):**
1. Open Firefox and navigate to `about:config`
2. Search for `xpinstall.signatures.required`
3. Set it to `false`
4. Now you can install the unsigned extension permanently

---

## 📋 Command Line Installation

### For Chrome/Edge/Brave

```bash
# Download and extract
cd ~/Downloads
unzip passify-v1.0.1-chrome.zip -d passify-chrome

# Open browser extensions page
# Chrome
open -a "Google Chrome" chrome://extensions/

# Edge
open -a "Microsoft Edge" edge://extensions/

# Brave
open -a "Brave Browser" brave://extensions/

# Then manually:
# 1. Enable Developer mode
# 2. Click "Load unpacked"
# 3. Select the passify-chrome folder
```

### For Firefox

```bash
# Download and extract
cd ~/Downloads
unzip passify-v1.0.1-firefox.zip -d passify-firefox

# Open Firefox debugging page
open -a "Firefox" about:debugging#/runtime/this-firefox

# Then manually:
# 1. Click "Load Temporary Add-on"
# 2. Select manifest.json from passify-firefox folder
```

---

## 🔧 Automated Installation Script

### For macOS/Linux

Save this as `install-passify.sh`:

```bash
#!/bin/bash

echo "🔐 Passify Installation Script"
echo "=============================="
echo ""

# Check which browser to install for
echo "Select your browser:"
echo "1) Chrome"
echo "2) Firefox"
echo "3) Edge"
echo "4) Brave"
read -p "Enter choice (1-4): " browser_choice

# Set variables based on choice
case $browser_choice in
    1)
        BROWSER="chrome"
        ZIP_FILE="passify-v1.0.1-chrome.zip"
        EXTENSIONS_URL="chrome://extensions/"
        ;;
    2)
        BROWSER="firefox"
        ZIP_FILE="passify-v1.0.1-firefox.zip"
        EXTENSIONS_URL="about:debugging#/runtime/this-firefox"
        ;;
    3)
        BROWSER="edge"
        ZIP_FILE="passify-v1.0.1-chrome.zip"
        EXTENSIONS_URL="edge://extensions/"
        ;;
    4)
        BROWSER="brave"
        ZIP_FILE="passify-v1.0.1-chrome.zip"
        EXTENSIONS_URL="brave://extensions/"
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

# Check if ZIP file exists
if [ ! -f "$ZIP_FILE" ]; then
    echo "❌ Error: $ZIP_FILE not found in current directory"
    echo "Please download the release package first."
    exit 1
fi

# Extract
EXTRACT_DIR="passify-$BROWSER"
echo "📦 Extracting $ZIP_FILE to $EXTRACT_DIR..."
unzip -q "$ZIP_FILE" -d "$EXTRACT_DIR"

if [ $? -eq 0 ]; then
    echo "✅ Extraction successful!"
    echo ""
    echo "📍 Extension files are in: $(pwd)/$EXTRACT_DIR"
    echo ""
    echo "🌐 Next steps:"
    echo "1. Open your browser"
    echo "2. Navigate to: $EXTENSIONS_URL"
    
    if [ "$BROWSER" = "firefox" ]; then
        echo "3. Click 'Load Temporary Add-on'"
        echo "4. Select: $(pwd)/$EXTRACT_DIR/manifest.json"
    else
        echo "3. Enable 'Developer mode'"
        echo "4. Click 'Load unpacked'"
        echo "5. Select: $(pwd)/$EXTRACT_DIR"
    fi
    
    echo ""
    echo "✨ Installation complete!"
else
    echo "❌ Extraction failed. Please check the ZIP file."
    exit 1
fi
```

**Usage:**
```bash
# Make script executable
chmod +x install-passify.sh

# Run script
./install-passify.sh
```

### For Windows (PowerShell)

Save this as `install-passify.ps1`:

```powershell
Write-Host "🔐 Passify Installation Script" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Check which browser to install for
Write-Host "Select your browser:"
Write-Host "1) Chrome"
Write-Host "2) Firefox"
Write-Host "3) Edge"
Write-Host "4) Brave"
$browserChoice = Read-Host "Enter choice (1-4)"

# Set variables based on choice
switch ($browserChoice) {
    "1" {
        $browser = "chrome"
        $zipFile = "passify-v1.0.1-chrome.zip"
        $extensionsUrl = "chrome://extensions/"
    }
    "2" {
        $browser = "firefox"
        $zipFile = "passify-v1.0.1-firefox.zip"
        $extensionsUrl = "about:debugging#/runtime/this-firefox"
    }
    "3" {
        $browser = "edge"
        $zipFile = "passify-v1.0.1-chrome.zip"
        $extensionsUrl = "edge://extensions/"
    }
    "4" {
        $browser = "brave"
        $zipFile = "passify-v1.0.1-chrome.zip"
        $extensionsUrl = "brave://extensions/"
    }
    default {
        Write-Host "❌ Invalid choice. Exiting." -ForegroundColor Red
        exit 1
    }
}

# Check if ZIP file exists
if (-not (Test-Path $zipFile)) {
    Write-Host "❌ Error: $zipFile not found in current directory" -ForegroundColor Red
    Write-Host "Please download the release package first."
    exit 1
}

# Extract
$extractDir = "passify-$browser"
Write-Host "📦 Extracting $zipFile to $extractDir..." -ForegroundColor Yellow
Expand-Archive -Path $zipFile -DestinationPath $extractDir -Force

if ($?) {
    Write-Host "✅ Extraction successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Extension files are in: $PWD\$extractDir" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🌐 Next steps:" -ForegroundColor Yellow
    Write-Host "1. Open your browser"
    Write-Host "2. Navigate to: $extensionsUrl"
    
    if ($browser -eq "firefox") {
        Write-Host "3. Click 'Load Temporary Add-on'"
        Write-Host "4. Select: $PWD\$extractDir\manifest.json"
    } else {
        Write-Host "3. Enable 'Developer mode'"
        Write-Host "4. Click 'Load unpacked'"
        Write-Host "5. Select: $PWD\$extractDir"
    }
    
    Write-Host ""
    Write-Host "✨ Installation complete!" -ForegroundColor Green
} else {
    Write-Host "❌ Extraction failed. Please check the ZIP file." -ForegroundColor Red
    exit 1
}
```

**Usage:**
```powershell
# Run PowerShell as Administrator
# Navigate to the releases folder
cd path\to\passify\releases

# Run script
.\install-passify.ps1
```

---

## ✅ Verify Installation

After installation, verify that Passify is working:

1. **Check Extension Icon**
   - Look for the 🔐 Passify icon in your browser toolbar
   - If not visible, click the extensions icon and pin Passify

2. **Test Popup**
   - Click the Passify icon
   - The popup should open with password generator

3. **Test on a Website**
   - Visit any website with a login form
   - You should see a 🔐 button next to password fields

4. **Open Password Manager**
   - Click "Open Password Manager" in the popup
   - A new tab should open with the full interface

---

## 🔄 Updating

To update to a newer version:

1. Download the new release ZIP
2. Remove the old extension from your browser
3. Follow the installation steps above with the new ZIP

**Note:** Your saved passwords are stored in browser storage and will persist across updates.

---

## 🗑️ Uninstallation

### Chrome/Edge/Brave
1. Navigate to extensions page (`chrome://extensions/`, `edge://extensions/`, or `brave://extensions/`)
2. Find Passify
3. Click "Remove"
4. Confirm removal

### Firefox
1. Navigate to `about:addons`
2. Find Passify
3. Click "..." menu
4. Select "Remove"
5. Confirm removal

**Note:** Uninstalling will delete all saved passwords. Export your data first if needed.

---

## 🐛 Troubleshooting

### Extension doesn't load
- **Check Developer Mode**: Make sure it's enabled
- **Check Folder**: Ensure you selected the correct folder (not the ZIP file)
- **Check manifest.json**: Verify the file exists in the extracted folder

### Extension loads but doesn't work
- **Reload Extension**: Click the reload icon in extensions page
- **Check Console**: Right-click extension icon → Inspect popup → Check for errors
- **Clear Cache**: Clear browser cache and reload

### Firefox signature error
- Use temporary installation for testing
- Or disable signature verification in `about:config`
- Or wait for signed version from Firefox Add-ons store

### Permissions error
- Grant all requested permissions
- Reload the extension
- Restart browser if needed

---

## 📞 Support

If you encounter issues:

1. **Check Documentation**: Review this guide and README.md
2. **GitHub Issues**: Report bugs at [GitHub Issues](https://github.com/jainavinash881/passify/issues)
3. **Email Support**: Contact support email listed in extension details

---

## 📄 Files in This Release

```
releases/
├── passify-v1.0.1-chrome.zip    (90KB) - Chrome/Edge/Brave version
├── passify-v1.0.1-firefox.zip   (90KB) - Firefox version
└── INSTALL.md                           - This installation guide
```

---

## 🔒 Security Note

This extension:
- ✅ Stores all data locally
- ✅ Makes no external network requests
- ✅ Contains no tracking or analytics
- ✅ Is open source and auditable

Your passwords never leave your device.

---

## 📝 Version Information

- **Version**: 1.0.1
- **Release Date**: 2024-12-27
- **Manifest Version**: 3
- **Supported Browsers**: Chrome 88+, Firefox 109+, Edge 88+, Brave

---

**Thank you for using Passify! 🔐**

For more information, visit the [GitHub repository](https://github.com/jainavinash881/passify).