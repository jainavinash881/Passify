import { useState, useEffect } from 'react';
import { PasswordStorage, type SavedPassword } from '../utils/storage';
import { calculatePasswordStrength, generatePassword, type PasswordStrength } from '../utils/passwordGenerator';
import '../styles/liquidGlass.css';
import './PasswordManager.css';

function PasswordManager() {
  const [passwords, setPasswords] = useState<SavedPassword[]>([]);
  const [filteredPasswords, setFilteredPasswords] = useState<SavedPassword[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ website: '', username: '', password: '' });
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPassword, setNewPassword] = useState({ website: '', username: '', password: '' });
  const [generatorStrength, setGeneratorStrength] = useState<PasswordStrength>('medium');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    loadPasswords();
  }, []);

  useEffect(() => {
    filterPasswords();
  }, [searchQuery, passwords]);

  const loadPasswords = async () => {
    const allPasswords = await PasswordStorage.getAll();
    setPasswords(allPasswords);
  };

  const filterPasswords = () => {
    if (!searchQuery.trim()) {
      setFilteredPasswords(passwords);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = passwords.filter(
      (p) =>
        p.website.toLowerCase().includes(query) ||
        p.username.toLowerCase().includes(query)
    );
    setFilteredPasswords(filtered);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this password?')) {
      await PasswordStorage.delete(id);
      await loadPasswords();
    }
  };

  const handleEdit = (password: SavedPassword) => {
    setEditingId(password.id);
    setEditForm({
      website: password.website,
      username: password.username,
      password: password.password,
    });
  };

  const handleSaveEdit = async () => {
    if (editingId) {
      await PasswordStorage.update(editingId, editForm);
      setEditingId(null);
      setEditForm({ website: '', username: '', password: '' });
      await loadPasswords();
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ website: '', username: '', password: '' });
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPassword((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleAddPassword = async () => {
    if (newPassword.website && newPassword.username && newPassword.password) {
      await PasswordStorage.save(newPassword);
      setNewPassword({ website: '', username: '', password: '' });
      setShowAddForm(false);
      await loadPasswords();
    }
  };

  const handleGeneratePassword = () => {
    const generated = generatePassword(generatorStrength);
    if (editingId) {
      setEditForm({ ...editForm, password: generated });
    } else {
      setNewPassword({ ...newPassword, password: generated });
    }
  };

  const getPasswordStrength = (password: string) => {
    return calculatePasswordStrength(password);
  };

  return (
    <div className="manager-container">
      <header className="manager-header glass-container">
        <div className="header-content">
          <h1 className="manager-title">🔐 Passify Password Manager</h1>
          <p className="manager-subtitle">Manage all your passwords in one secure place</p>
        </div>
        <button
          className="glass-button primary add-password-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '✕ Cancel' : '+ Add Password'}
        </button>
      </header>

      {showAddForm && (
        <div className="glass-container add-form-container fade-in">
          <h2 className="section-title">Add New Password</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Website</label>
              <input
                type="text"
                className="glass-input"
                placeholder="example.com"
                value={newPassword.website}
                onChange={(e) => setNewPassword({ ...newPassword, website: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Username/Email</label>
              <input
                type="text"
                className="glass-input"
                placeholder="user@example.com"
                value={newPassword.username}
                onChange={(e) => setNewPassword({ ...newPassword, username: e.target.value })}
              />
            </div>
            <div className="form-group full-width">
              <label>Password</label>
              <div className="password-input-group">
                <input
                  type="text"
                  className="glass-input"
                  placeholder="Enter or generate password"
                  value={newPassword.password}
                  onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })}
                />
                <div className="generator-controls">
                  <select
                    className="glass-input strength-select"
                    value={generatorStrength}
                    onChange={(e) => setGeneratorStrength(e.target.value as PasswordStrength)}
                  >
                    <option value="easy">Easy (8)</option>
                    <option value="medium">Medium (12)</option>
                    <option value="hard">Hard (16)</option>
                  </select>
                  <button className="glass-button secondary" onClick={handleGeneratePassword}>
                    ⚡ Generate
                  </button>
                </div>
              </div>
              {newPassword.password && (
                <div className="strength-indicator-inline">
                  <div
                    className="strength-bar"
                    style={{
                      width: `${getPasswordStrength(newPassword.password).score}%`,
                      background: getPasswordStrength(newPassword.password).color,
                    }}
                  />
                  <span style={{ color: getPasswordStrength(newPassword.password).color }}>
                    {getPasswordStrength(newPassword.password).label}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="form-actions">
            <button className="glass-button primary" onClick={handleAddPassword}>
              💾 Save Password
            </button>
            <button className="glass-button" onClick={() => setShowAddForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="search-container glass-container">
        <input
          type="text"
          className="glass-input search-input"
          placeholder="🔍 Search passwords by website or username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="password-count">
          {filteredPasswords.length} of {passwords.length} passwords
        </div>
      </div>

      <div className="passwords-grid">
        {filteredPasswords.length === 0 ? (
          <div className="glass-container empty-state">
            <div className="empty-icon">🔒</div>
            <h3>No passwords found</h3>
            <p>{searchQuery ? 'Try a different search term' : 'Add your first password to get started'}</p>
          </div>
        ) : (
          filteredPasswords.map((password) => (
            <div key={password.id} className="glass-card password-card fade-in">
              {editingId === password.id ? (
                <div className="edit-form">
                  <div className="form-group">
                    <label>Website</label>
                    <input
                      type="text"
                      className="glass-input"
                      value={editForm.website}
                      onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      className="glass-input"
                      value={editForm.username}
                      onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <div className="password-input-group">
                      <input
                        type="text"
                        className="glass-input"
                        value={editForm.password}
                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                      />
                      <button className="glass-button secondary" onClick={handleGeneratePassword}>
                        ⚡
                      </button>
                    </div>
                  </div>
                  <div className="edit-actions">
                    <button className="glass-button primary" onClick={handleSaveEdit}>
                      ✓ Save
                    </button>
                    <button className="glass-button" onClick={handleCancelEdit}>
                      ✕ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="password-header">
                    <div className="website-info">
                      <div className="website-icon">🌐</div>
                      <div>
                        <h3 className="website-name">{password.website}</h3>
                        <p className="username">{password.username}</p>
                      </div>
                    </div>
                    <div className="password-actions">
                      <button
                        className="glass-button icon-btn"
                        onClick={() => handleEdit(password)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="glass-button icon-btn"
                        onClick={() => handleDelete(password.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="password-content">
                    <div className="password-field">
                      <label>Password</label>
                      <div className="password-display">
                        <code className="password-text">
                          {showPassword[password.id] ? password.password : '•'.repeat(12)}
                        </code>
                        <div className="password-controls">
                          <button
                            className="glass-button icon-btn"
                            onClick={() => togglePasswordVisibility(password.id)}
                            title={showPassword[password.id] ? 'Hide' : 'Show'}
                          >
                            {showPassword[password.id] ? '🙈' : '👁️'}
                          </button>
                          <button
                            className="glass-button icon-btn"
                            onClick={() => handleCopy(password.password, password.id)}
                            title="Copy"
                          >
                            {copied === password.id ? '✓' : '📋'}
                          </button>
                        </div>
                      </div>
                    </div>
                    {showPassword[password.id] && (
                      <div className="strength-info-card">
                        <span>Strength: </span>
                        <span style={{ color: getPasswordStrength(password.password).color, fontWeight: 'bold' }}>
                          {getPasswordStrength(password.password).label}
                        </span>
                        <div className="strength-indicator-inline">
                          <div
                            className="strength-bar"
                            style={{
                              width: `${getPasswordStrength(password.password).score}%`,
                              background: getPasswordStrength(password.password).color,
                            }}
                          />
                        </div>
                      </div>
                    )}
                    <div className="password-meta">
                      <span>Created: {new Date(password.createdAt).toLocaleDateString()}</span>
                      {password.updatedAt !== password.createdAt && (
                        <span>Updated: {new Date(password.updatedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PasswordManager;
