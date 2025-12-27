#!/bin/bash

# Passify Extension - Publishing Preparation Script
# This script helps prepare your extension for publishing to browser stores

echo "🚀 Passify Extension - Publishing Preparation"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the passify directory.${NC}"
    exit 1
fi

echo "📋 Pre-Publishing Checklist"
echo "----------------------------"
echo ""

# Step 1: Build the extension
echo -e "${YELLOW}Step 1: Building extension...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed. Please fix errors and try again.${NC}"
    exit 1
fi
echo ""

# Step 2: Check for required files
echo -e "${YELLOW}Step 2: Checking required files...${NC}"

REQUIRED_FILES=(
    "dist/manifest.json"
    "dist/popup.html"
    "dist/manager.html"
)

MISSING_FILES=0
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ Found: $file${NC}"
    else
        echo -e "${RED}❌ Missing: $file${NC}"
        MISSING_FILES=$((MISSING_FILES + 1))
    fi
done

if [ $MISSING_FILES -gt 0 ]; then
    echo -e "${RED}❌ Some required files are missing. Build may have failed.${NC}"
    exit 1
fi
echo ""

# Step 3: Check manifest version
echo -e "${YELLOW}Step 3: Checking manifest version...${NC}"
VERSION=$(grep -o '"version": "[^"]*"' dist/manifest.json | cut -d'"' -f4)
echo -e "${GREEN}📦 Current version: $VERSION${NC}"
echo ""

# Step 4: Create icons directory reminder
echo -e "${YELLOW}Step 4: Icon files check...${NC}"
if [ -d "public/icons" ]; then
    ICON_COUNT=$(ls -1 public/icons/*.png 2>/dev/null | wc -l)
    if [ $ICON_COUNT -ge 4 ]; then
        echo -e "${GREEN}✅ Icon files found in public/icons/${NC}"
    else
        echo -e "${YELLOW}⚠️  Warning: You need 4 icon sizes (16, 32, 48, 128px)${NC}"
        echo "   Create icons and place them in public/icons/"
    fi
else
    echo -e "${YELLOW}⚠️  Warning: public/icons/ directory not found${NC}"
    echo "   Create this directory and add your icon files:"
    echo "   - icon16.png (16×16px)"
    echo "   - icon32.png (32×32px)"
    echo "   - icon48.png (48×48px)"
    echo "   - icon128.png (128×128px)"
fi
echo ""

# Step 5: Create ZIP package
echo -e "${YELLOW}Step 5: Creating ZIP package...${NC}"
PACKAGE_NAME="passify-v${VERSION}.zip"

cd dist
if [ -f "../$PACKAGE_NAME" ]; then
    rm "../$PACKAGE_NAME"
    echo "   Removed old package"
fi

zip -r "../$PACKAGE_NAME" . -x "*.DS_Store" -x "__MACOSX/*"
cd ..

if [ -f "$PACKAGE_NAME" ]; then
    PACKAGE_SIZE=$(du -h "$PACKAGE_NAME" | cut -f1)
    echo -e "${GREEN}✅ Package created: $PACKAGE_NAME ($PACKAGE_SIZE)${NC}"
else
    echo -e "${RED}❌ Failed to create package${NC}"
    exit 1
fi
echo ""

# Step 6: Create source code package (for Firefox)
echo -e "${YELLOW}Step 6: Creating source code package...${NC}"
SOURCE_PACKAGE="passify-source-v${VERSION}.zip"

if [ -f "$SOURCE_PACKAGE" ]; then
    rm "$SOURCE_PACKAGE"
fi

zip -r "$SOURCE_PACKAGE" . \
    -x "dist/*" \
    -x "node_modules/*" \
    -x "*.zip" \
    -x ".git/*" \
    -x ".DS_Store" \
    -x "__MACOSX/*"

if [ -f "$SOURCE_PACKAGE" ]; then
    SOURCE_SIZE=$(du -h "$SOURCE_PACKAGE" | cut -f1)
    echo -e "${GREEN}✅ Source package created: $SOURCE_PACKAGE ($SOURCE_SIZE)${NC}"
else
    echo -e "${RED}❌ Failed to create source package${NC}"
fi
echo ""

# Summary
echo "=============================================="
echo -e "${GREEN}🎉 Publishing Preparation Complete!${NC}"
echo "=============================================="
echo ""
echo "📦 Packages created:"
echo "   1. $PACKAGE_NAME - Upload to browser stores"
echo "   2. $SOURCE_PACKAGE - For Firefox if requested"
echo ""
echo "📋 Next Steps:"
echo "   1. Review PUBLISHING_GUIDE.md for detailed instructions"
echo "   2. Create extension icons (if not done)"
echo "   3. Take screenshots of your extension"
echo "   4. Write privacy policy"
echo "   5. Register for Chrome Web Store (\$5 fee)"
echo "   6. Upload $PACKAGE_NAME to stores"
echo ""
echo "🌐 Store Links:"
echo "   • Chrome: https://chrome.google.com/webstore/devconsole"
echo "   • Firefox: https://addons.mozilla.org/developers/"
echo "   • Edge: https://partner.microsoft.com/dashboard/microsoftedge/"
echo ""
echo -e "${YELLOW}⚠️  Important Reminders:${NC}"
echo "   • Test extension in each browser before submitting"
echo "   • Create privacy policy (required by all stores)"
echo "   • Prepare 3-5 screenshots (1280×800px)"
echo "   • Write clear, honest description"
