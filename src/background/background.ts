// Background service worker for Passify extension

// Browser API compatibility layer
declare const browser: typeof chrome | undefined;
const browserAPI = (typeof browser !== 'undefined' ? browser : chrome) as typeof chrome;

// Listen for extension installation
browserAPI.runtime.onInstalled.addListener(() => {
  console.log('Passify extension installed');
});

// Listen for messages from content script
browserAPI.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.action === 'openPopup') {
    // Chrome: No action needed (uses inline popup)
    sendResponse({ success: true });
  } else if (message.action === 'openPopupTab') {
    // Firefox: Open popup in new tab
    browserAPI.tabs.create({
      url: browserAPI.runtime.getURL('popup.html'),
      active: true
    }).then(() => {
      sendResponse({ success: true });
    }).catch((error) => {
      console.error('Error opening popup tab:', error);
      sendResponse({ success: false, error: error.message });
    });
    return true; // Keep channel open for async response
  } else if (message.action === 'openManager') {
    // Open password manager in new tab
    browserAPI.tabs.create({
      url: browserAPI.runtime.getURL('manager.html'),
      active: true
    }).then(() => {
      sendResponse({ success: true });
    }).catch((error) => {
      console.error('Error opening manager:', error);
      sendResponse({ success: false, error: error.message });
    });
    return true; // Keep channel open for async response
  }
  return true;
});

// Handle keyboard shortcuts (optional)
browserAPI.commands?.onCommand.addListener((command) => {
  if (command === 'generate-password') {
    if (typeof browser !== 'undefined') {
      browserAPI.tabs.create({
        url: browserAPI.runtime.getURL('popup.html'),
        active: true
      });
    } else {
      browserAPI.action.openPopup();
    }
  }
});

console.log('Passify background script loaded');


