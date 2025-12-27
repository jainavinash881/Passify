import { useState, useEffect, useCallback } from 'react';
import { generatePassword, calculatePasswordStrength, type PasswordStrength } from '../utils/passwordGenerator';
import { PasswordStorage, type SavedPassword } from '../utils/storage';
import '../styles/liquidGlass.css';
import './Popup.css';

// Browser API compatibility
declare const browser: typeof chrome | undefined;
const browserAPI = (typeof browser !== 'undefined' ? browser : chrome) as typeof chrome;

function Popup() {
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState<PasswordStrength>('medium');
  const [savedPasswords, setSavedPasswords] = useState<SavedPassword[]>([]);
  const [showSaved, setShowSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentWebsite, setCurrentWebsite] = useState('');
  const [username, setUsername] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);

  const loadSavedPasswords = useCallback(async () => {
    const passwords = await PasswordStorage.getAll();
    setSavedPasswords(passwords);
  }, []);

  const getCurrentWebsite = useCallback(async () => {
    try {
      const [tab] = await browserAPI.tabs.query({ active: true, currentWindow: true });
      if (tab.url) {
        const url = new URL(tab.url);
        setCurrentWebsite(url.hostname);
      }
    } catch (error) {
      console.error('Error getting current website:', error);
    }
  }, []);

  useEffect(() => {
    void loadSavedPasswords();
    void getCurrentWebsite();
  }, [loadSavedPasswords, getCurrentWebsite]);

  const handleGenerate = () => {
    const newPassword = generatePassword(strength);
    setPassword(newPassword);
    setCopied(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying password:', error);
    }
  };

  const handleSave = async () => {
    if (!password || !username) return;
    
    try {
      await PasswordStorage.save({
        website: currentWebsite,
        username,
        password,
      });
      await loadSavedPasswords();
      setShowSaveForm(false);
      setUsername('');
    } catch (error) {
      console.error('Error saving password:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await PasswordStorage.delete(id);
      await loadSavedPasswords();
    } catch (error) {
      console.error('Error deleting password:', error);
    }
  };

  const handleAutofill = async (savedPassword: SavedPassword) => {
    try {
      // Check if we're in an iframe (inline popup)
      if (window.self !== window.top) {
        // In iframe: Send message to parent (content script)
        window.parent.postMessage({
          type: 'PASSIFY_AUTOFILL',
          username: savedPassword.username,
          password: savedPassword.password,
        }, '*');
      } else {
        // In regular page: Use tabs API
        const [tab] = await browserAPI.tabs.query({ active: true, currentWindow: true });
        if (tab.id) {
          await browserAPI.tabs.sendMessage(tab.id, {
            action: 'autofill',
            username: savedPassword.username,
            password: savedPassword.password,
          });
        }
      }
    } catch (error) {
      console.error('Error autofilling password:', error);
    }
  };

  const passwordStrengthInfo = password ? calculatePasswordStrength(password) : null;

  const openPasswordManager = () => {
    // Check if we're in an iframe
    if (window.self !== window.top) {
      // In iframe: Send message to parent to open manager
      window.parent.postMessage({
        type: 'PASSIFY_OPEN_MANAGER'
      }, '*');
    } else {
      // In regular page: Open directly
      browserAPI.tabs.create({ url: browserAPI.runtime.getURL('manager.html') });
    }
  };

  return (
    <div className="popup-container">
      <div className="popup-header glass-container">
        <h1 className="popup-title">🔐 Passify</h1>
        <p className="popup-subtitle">Secure Password Manager</p>
      </div>

      <div className="popup-content">
        {!showSaved ? (
          <>
            <div className="glass-container fade-in">
              <h2 className="section-title">Generate Password</h2>
              
              <div className="strength-selector">
                <button
                  className={`glass-button ${strength === 'easy' ? 'primary' : ''}`}
                  onClick={() => setStrength('easy')}
                >
                  Easy (8 chars)
                </button>
                <button
                  className={`glass-button ${strength === 'medium' ? 'primary' : ''}`}
                  onClick={() => setStrength('medium')}
                >
                  Medium (12 chars)
                </button>
                <button
                  className={`glass-button ${strength === 'hard' ? 'primary' : ''}`}
                  onClick={() => setStrength('hard')}
                >
                  Hard (16 chars)
                </button>
              </div>

              <button className="glass-button primary generate-btn" onClick={handleGenerate}>
                ⚡ Generate Password
              </button>

              {password && (
                <div className="password-display fade-in">
                  <div className="password-box glass-container">
                    <code className="password-text">{password}</code>
                    <button className="glass-button copy-btn" onClick={handleCopy}>
                      {copied ? '✓ Copied!' : '📋 Copy'}
                    </button>
                  </div>

                  {passwordStrengthInfo && (
                    <div className="strength-info">
                      <div className="strength-label">
                        <span>Strength: </span>
                        <span style={{ color: passwordStrengthInfo.color, fontWeight: 'bold' }}>
                          {passwordStrengthInfo.label}
                        </span>
                      </div>
                      <div className="strength-indicator">
                        <div
                          className="strength-bar"
                          style={{
                            width: `${passwordStrengthInfo.score}%`,
                            background: passwordStrengthInfo.color,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {!showSaveForm ? (
                    <button
                      className="glass-button secondary save-btn"
                      onClick={() => setShowSaveForm(true)}
                    >
                      💾 Save Password
                    </button>
                  ) : (
                    <div className="save-form fade-in">
                      <input
                        type="text"
                        className="glass-input"
                        placeholder="Username or Email"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                      <div className="save-form-buttons">
                        <button className="glass-button primary" onClick={handleSave}>
                          Save
                        </button>
                        <button
                          className="glass-button"
                          onClick={() => {
                            setShowSaveForm(false);
                            setUsername('');
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="quick-actions">
              <button
                className="glass-button view-saved-btn"
                onClick={() => setShowSaved(true)}
              >
                📚 View Saved ({savedPasswords.length})
              </button>
              <button
                className="glass-button secondary view-saved-btn"
                onClick={openPasswordManager}
              >
                🔓 Open Password Manager
              </button>
            </div>
          </>
        ) : (
          <div className="glass-container fade-in">
            <div className="saved-header">
              <h2 className="section-title">Saved Passwords</h2>
              <button className="glass-button" onClick={() => setShowSaved(false)}>
                ← Back
              </button>
            </div>

            <div className="saved-list">
              {savedPasswords.length === 0 ? (
                <p className="empty-message">No saved passwords yet</p>
              ) : (
                savedPasswords.map((saved) => (
                  <div key={saved.id} className="glass-card saved-item">
                    <div className="saved-info">
                      <div className="saved-website">🌐 {saved.website}</div>
                      <div className="saved-username">👤 {saved.username}</div>
                      <div className="saved-password">
                        <code>{'•'.repeat(12)}</code>
                      </div>
                    </div>
                    <div className="saved-actions">
                      <button
                        className="glass-button primary"
                        onClick={() => handleAutofill(saved)}
                      >
                        ⚡ Autofill
                      </button>
                      <button
                        className="glass-button"
                        onClick={async () => {
                          await navigator.clipboard.writeText(saved.password);
                        }}
                      >
                        📋
                      </button>
                      <button
                        className="glass-button"
                        onClick={() => handleDelete(saved.id)}
                        style={{ background: 'rgba(239, 68, 68, 0.2)' }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <div className="popup-footer">
        <p className="footer-text">Made with ❤️ by Avinash</p>
      </div>
    </div>
  );
}

export default Popup;
