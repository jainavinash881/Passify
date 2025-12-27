// Content script for detecting password fields and autofilling

// Browser API compatibility layer
declare const browser: typeof chrome | undefined;
const browserAPI = (typeof browser !== 'undefined' ? browser : chrome) as typeof chrome;

interface AutofillMessage {
  action: 'autofill';
  username: string;
  password: string;
}

interface SavedPassword {
  id: string;
  website: string;
  username: string;
  password: string;
  createdAt: number;
  updatedAt: number;
}

// Detect password fields on the page
function detectPasswordFields(): void {
  const passwordInputs = document.querySelectorAll('input[type="password"]');
  
  passwordInputs.forEach((input) => {
    if (!input.hasAttribute('data-passify-detected')) {
      input.setAttribute('data-passify-detected', 'true');
      addPassifyButton(input as HTMLInputElement);
    }
  });
}

// Add Passify button next to password field
function addPassifyButton(passwordInput: HTMLInputElement): void {
  // Check if button already exists
  if (passwordInput.parentElement?.querySelector('.passify-autofill-btn')) {
    return;
  }

  const button = document.createElement('button');
  button.className = 'passify-autofill-btn';
  button.textContent = '🔐';
  button.title = 'Autofill with Passify';
  button.type = 'button';
  
  button.style.cssText = `
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 30px;
    height: 30px;
    border: 1px solid rgba(37, 99, 235, 0.3);
    border-radius: 6px;
    background: #2563eb;
    color: white;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.2s ease;
  `;

  button.addEventListener('mouseenter', () => {
    button.style.transform = 'translateY(-50%) scale(1.05)';
    button.style.background = '#1d4ed8';
    button.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
    button.style.borderColor = 'rgba(37, 99, 235, 0.5)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translateY(-50%) scale(1)';
    button.style.background = '#2563eb';
    button.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
    button.style.borderColor = 'rgba(37, 99, 235, 0.3)';
  });

  button.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Both browsers: Show inline popup
    showInlinePopup();
  });

  // Make parent position relative if it's not already positioned
  const parent = passwordInput.parentElement;
  if (parent) {
    const position = window.getComputedStyle(parent).position;
    if (position === 'static') {
      parent.style.position = 'relative';
    }
    parent.appendChild(button);
  }
}

// Show inline popup for Firefox (embedded in page)
function showInlinePopup(): void {
  // Remove existing inline popup if any
  const existingPopup = document.getElementById('passify-inline-popup');
  if (existingPopup) {
    existingPopup.remove();
    return; // Toggle behavior
  }

  // Create iframe to load popup.html
  const iframe = document.createElement('iframe');
  iframe.id = 'passify-inline-popup';
  iframe.src = browserAPI.runtime.getURL('popup.html');
  
  iframe.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    width: 400px;
    height: 600px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 12px;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5);
    z-index: 10003;
    background: transparent;
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(iframe);

  // Close on outside click
  const closeHandler = (e: MouseEvent) => {
    if (!iframe.contains(e.target as Node)) {
      iframe.remove();
      document.removeEventListener('click', closeHandler);
    }
  };
  
  setTimeout(() => {
    document.addEventListener('click', closeHandler);
  }, 100);

  // Auto-close after 30 seconds
  setTimeout(() => {
    if (iframe.parentElement) {
      iframe.remove();
      document.removeEventListener('click', closeHandler);
    }
  }, 30000);
}

// Listen for autofill messages from popup
browserAPI.runtime.onMessage.addListener((message: AutofillMessage, _sender: chrome.runtime.MessageSender, sendResponse: (response?: { success: boolean }) => void) => {
  if (message.action === 'autofill') {
    autofillCredentials(message.username, message.password);
    sendResponse({ success: true });
  }
  return true;
});

// Listen for postMessage from iframe popup
window.addEventListener('message', (event) => {
  // Security: verify message is from our extension
  if (event.data && event.data.type) {
    if (event.data.type === 'PASSIFY_AUTOFILL') {
      // Autofill credentials
      autofillCredentials(event.data.username, event.data.password);
      // Close the inline popup
      const popup = document.getElementById('passify-inline-popup');
      if (popup) {
        popup.remove();
      }
    } else if (event.data.type === 'PASSIFY_OPEN_MANAGER') {
      // Send message to background to open manager
      browserAPI.runtime.sendMessage({ action: 'openManager' });
      // Close the inline popup
      const popup = document.getElementById('passify-inline-popup');
      if (popup) {
        popup.remove();
      }
    }
  }
});

// Autofill credentials into form fields
function autofillCredentials(username: string, password: string): void {
  // Find username field (email or text input before password)
  const passwordInputs = document.querySelectorAll('input[type="password"]');
  
  passwordInputs.forEach((passwordInput) => {
    // Fill password
    const passwordElement = passwordInput as HTMLInputElement;
    passwordElement.value = password;
    passwordElement.dispatchEvent(new Event('input', { bubbles: true }));
    passwordElement.dispatchEvent(new Event('change', { bubbles: true }));

    // Find username field
    const form = passwordElement.closest('form');
    if (form) {
      const usernameInput = form.querySelector('input[type="email"], input[type="text"], input[name*="user"], input[name*="email"]') as HTMLInputElement;
      if (usernameInput) {
        usernameInput.value = username;
        usernameInput.dispatchEvent(new Event('input', { bubbles: true }));
        usernameInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  });

  // Show success notification
  showNotification('Credentials autofilled successfully! 🎉');
}

// Show notification
function showNotification(message: string): void {
  const notification = document.createElement('div');
  notification.className = 'passify-notification';
  notification.textContent = message;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 14px 20px;
    background: rgba(30, 30, 35, 0.98);
    backdrop-filter: blur(16px);
    color: #f8fafc;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    z-index: 10001;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 13px;
    font-weight: 500;
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Check for saved passwords on page load
async function checkForSavedPasswords(): Promise<void> {
  try {
    const hostname = window.location.hostname;
    const result = await browserAPI.storage.local.get('passify_passwords');
    const passwords: SavedPassword[] = (result.passify_passwords as SavedPassword[]) || [];
    
    const matchingPasswords = passwords.filter(p => 
      p.website.includes(hostname) || hostname.includes(p.website)
    );

    if (matchingPasswords.length > 0 && document.querySelectorAll('input[type="password"]').length > 0) {
      showCredentialsPopup(matchingPasswords);
    }
  } catch (error) {
    console.error('Error checking for saved passwords:', error);
  }
}

// Show autofill popup with saved credentials
function showCredentialsPopup(passwords: SavedPassword[]): void {
  // Remove existing popup if any
  const existingPopup = document.getElementById('passify-autofill-popup');
  if (existingPopup) {
    existingPopup.remove();
  }

  const popup = document.createElement('div');
  popup.id = 'passify-autofill-popup';
  popup.className = 'passify-autofill-popup';
  
  // Create header
  const header = document.createElement('div');
  header.className = 'passify-popup-header';
  
  const title = document.createElement('div');
  title.className = 'passify-popup-title';
  
  const icon = document.createElement('span');
  icon.className = 'passify-popup-icon';
  icon.textContent = '🔐';
  
  const titleText = document.createElement('span');
  titleText.textContent = 'Passify - Saved Passwords';
  
  title.appendChild(icon);
  title.appendChild(titleText);
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'passify-popup-close';
  closeBtn.id = 'passify-close-popup';
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', () => popup.remove());
  
  header.appendChild(title);
  header.appendChild(closeBtn);
  
  // Create content
  const content = document.createElement('div');
  content.className = 'passify-popup-content';
  
  const subtitle = document.createElement('p');
  subtitle.className = 'passify-popup-subtitle';
  subtitle.textContent = `Found ${passwords.length} saved ${passwords.length === 1 ? 'password' : 'passwords'} for this site`;
  
  const credentialsList = document.createElement('div');
  credentialsList.className = 'passify-credentials-list';
  
  // Create credential items
  passwords.forEach(p => {
    const item = document.createElement('div');
    item.className = 'passify-credential-item';
    item.setAttribute('data-id', p.id);
    
    const info = document.createElement('div');
    info.className = 'passify-credential-info';
    
    const usernameDiv = document.createElement('div');
    usernameDiv.className = 'passify-credential-username';
    usernameDiv.textContent = `👤 ${p.username}`;
    
    const passwordDiv = document.createElement('div');
    passwordDiv.className = 'passify-credential-password';
    passwordDiv.textContent = `🔒 ${'•'.repeat(12)}`;
    
    info.appendChild(usernameDiv);
    info.appendChild(passwordDiv);
    
    const autofillBtn = document.createElement('button');
    autofillBtn.className = 'passify-autofill-btn-small';
    autofillBtn.textContent = '⚡ Autofill';
    autofillBtn.setAttribute('data-username', p.username);
    autofillBtn.setAttribute('data-password', p.password);
    autofillBtn.addEventListener('click', () => {
      autofillCredentials(p.username, p.password);
      popup.remove();
    });
    
    item.appendChild(info);
    item.appendChild(autofillBtn);
    credentialsList.appendChild(item);
  });
  
  content.appendChild(subtitle);
  content.appendChild(credentialsList);
  
  popup.appendChild(header);
  popup.appendChild(content);
  
  document.body.appendChild(popup);

  // Close on outside click
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.remove();
    }
  });

  // Auto-hide after 10 seconds
  setTimeout(() => {
    if (popup.parentElement) {
      popup.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => popup.remove(), 300);
    }
  }, 10000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }

  .passify-autofill-popup {
    position: fixed;
    top: 80px;
    right: 20px;
    width: 360px;
    background: rgba(30, 30, 35, 0.98);
    backdrop-filter: blur(20px);
    border-radius: 12px;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.08);
    z-index: 10002;
    animation: slideIn 0.3s ease-out;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }

  .passify-popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 18px;
    background: rgba(37, 99, 235, 0.15);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .passify-popup-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    font-size: 13px;
    color: #f8fafc;
    letter-spacing: -0.01em;
  }

  .passify-popup-icon {
    font-size: 16px;
  }

  .passify-popup-close {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #cbd5e1;
    width: 26px;
    height: 26px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }

  .passify-popup-close:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.15);
    color: #f8fafc;
  }

  .passify-popup-content {
    padding: 18px;
  }

  .passify-popup-subtitle {
    margin: 0 0 14px 0;
    font-size: 12px;
    color: #94a3b8;
    font-weight: 400;
  }

  .passify-credentials-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .passify-credential-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 14px;
    background: rgba(40, 40, 50, 0.5);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    transition: all 0.2s;
  }

  .passify-credential-item:hover {
    background: rgba(50, 50, 60, 0.6);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .passify-credential-info {
    flex: 1;
    min-width: 0;
  }

  .passify-credential-username {
    font-size: 13px;
    font-weight: 600;
    color: #f8fafc;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: -0.01em;
  }

  .passify-credential-password {
    font-size: 11px;
    color: #94a3b8;
    font-family: 'SF Mono', 'Monaco', monospace;
    letter-spacing: 0.05em;
  }

  .passify-autofill-btn-small {
    background: #2563eb;
    color: white;
    border: 1px solid rgba(37, 99, 235, 0.5);
    padding: 7px 14px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .passify-autofill-btn-small:hover {
    background: #1d4ed8;
    border-color: rgba(37, 99, 235, 0.8);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }
`;
document.head.appendChild(style);

// Initialize
detectPasswordFields();

// Watch for dynamically added password fields
const observer = new MutationObserver(() => {
  detectPasswordFields();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Check for saved passwords when page loads
setTimeout(checkForSavedPasswords, 1000);

console.log('Passify content script loaded');
