export interface SavedPassword {
  id: string;
  website: string;
  username: string;
  password: string;
  createdAt: number;
  updatedAt: number;
}

export class PasswordStorage {
  private static STORAGE_KEY = 'passify_passwords';

  static async getAll(): Promise<SavedPassword[]> {
    try {
      const result = await chrome.storage.local.get(this.STORAGE_KEY);
      return (result[this.STORAGE_KEY] as SavedPassword[]) || [];
    } catch (error) {
      console.error('Error getting passwords:', error);
      return [];
    }
  }

  static async save(password: Omit<SavedPassword, 'id' | 'createdAt' | 'updatedAt'>): Promise<SavedPassword> {
    const passwords = await this.getAll();
    const newPassword: SavedPassword = {
      ...password,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    passwords.push(newPassword);
    await chrome.storage.local.set({ [this.STORAGE_KEY]: passwords });
    return newPassword;
  }

  static async update(id: string, updates: Partial<Omit<SavedPassword, 'id' | 'createdAt'>>): Promise<void> {
    const passwords = await this.getAll();
    const index = passwords.findIndex(p => p.id === id);
    
    if (index !== -1) {
      passwords[index] = {
        ...passwords[index],
        ...updates,
        updatedAt: Date.now(),
      };
      await chrome.storage.local.set({ [this.STORAGE_KEY]: passwords });
    }
  }

  static async delete(id: string): Promise<void> {
    const passwords = await this.getAll();
    const filtered = passwords.filter(p => p.id !== id);
    await chrome.storage.local.set({ [this.STORAGE_KEY]: filtered });
  }

  static async findByWebsite(website: string): Promise<SavedPassword[]> {
    const passwords = await this.getAll();
    return passwords.filter(p => p.website.includes(website) || website.includes(p.website));
  }

  static async clear(): Promise<void> {
    await chrome.storage.local.remove(this.STORAGE_KEY);
  }
}


