const API_BASE = process.env.REACT_APP_API_BASE;

/**
 * Simple local storage fallback for notes when no backend is configured.
 * Notes structure: { id, title, content, tags: string[], updatedAt, createdAt }
 */
class LocalNotesStore {
  constructor() {
    this.key = "kavia_notes_store_v1";
    this.tagsKey = "kavia_notes_tags_v1";
    this._init();
  }

  _init() {
    if (!localStorage.getItem(this.key)) {
      localStorage.setItem(this.key, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.tagsKey)) {
      localStorage.setItem(this.tagsKey, JSON.stringify(["Work", "Personal", "Ideas"]));
    }
  }

  _read() {
    try {
      return JSON.parse(localStorage.getItem(this.key)) || [];
    } catch {
      return [];
    }
  }

  _write(notes) {
    localStorage.setItem(this.key, JSON.stringify(notes));
  }

  _readTags() {
    try {
      return JSON.parse(localStorage.getItem(this.tagsKey)) || [];
    } catch {
      return [];
    }
  }

  _writeTags(tags) {
    localStorage.setItem(this.tagsKey, JSON.stringify(tags));
  }

  async listNotes({ search = "", tag = "" } = {}) {
    let notes = this._read();
    if (search) {
      const q = search.toLowerCase();
      notes = notes.filter(
        n =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          (n.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    if (tag) {
      notes = notes.filter(n => (n.tags || []).includes(tag));
    }
    // sort by updatedAt desc
    return notes.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  async getNote(id) {
    return this._read().find(n => n.id === id) || null;
  }

  async createNote(note) {
    const now = new Date().toISOString();
    const newNote = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title: note.title || "Untitled",
      content: note.content || "",
      tags: Array.isArray(note.tags) ? note.tags : [],
      createdAt: now,
      updatedAt: now
    };
    const notes = this._read();
    notes.push(newNote);
    this._write(notes);
    return newNote;
  }

  async updateNote(id, updates) {
    const notes = this._read();
    const idx = notes.findIndex(n => n.id === id);
    if (idx === -1) return null;
    notes[idx] = {
      ...notes[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this._write(notes);
    return notes[idx];
  }

  async deleteNote(id) {
    const notes = this._read();
    const next = notes.filter(n => n.id !== id);
    this._write(next);
    return { ok: true };
  }

  async listTags() {
    return this._readTags();
  }

  async addTag(tag) {
    const tags = this._readTags();
    if (!tags.includes(tag)) {
      tags.push(tag);
      this._writeTags(tags);
    }
    return tags;
  }

  async removeTag(tag) {
    const tags = this._readTags().filter(t => t !== tag);
    this._writeTags(tags);
    // Also remove from notes
    const notes = this._read().map(n => ({
      ...n,
      tags: (n.tags || []).filter(t => t !== tag)
    }));
    this._write(notes);
    return tags;
  }
}

const localStore = new LocalNotesStore();

async function http(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

// PUBLIC_INTERFACE
export const api = {
  /** If backend URL is set, use network; otherwise local store */
  isRemote: Boolean(API_BASE),

  // PUBLIC_INTERFACE
  async listNotes(params = {}) {
    if (!API_BASE) return localStore.listNotes(params);
    const query = new URLSearchParams(params).toString();
    return http(`/notes${query ? `?${query}` : ""}`);
  },

  // PUBLIC_INTERFACE
  async getNote(id) {
    if (!API_BASE) return localStore.getNote(id);
    return http(`/notes/${id}`);
  },

  // PUBLIC_INTERFACE
  async createNote(note) {
    if (!API_BASE) return localStore.createNote(note);
    return http(`/notes`, { method: "POST", body: JSON.stringify(note) });
  },

  // PUBLIC_INTERFACE
  async updateNote(id, updates) {
    if (!API_BASE) return localStore.updateNote(id, updates);
    return http(`/notes/${id}`, { method: "PUT", body: JSON.stringify(updates) });
  },

  // PUBLIC_INTERFACE
  async deleteNote(id) {
    if (!API_BASE) return localStore.deleteNote(id);
    return http(`/notes/${id}`, { method: "DELETE" });
  },

  // PUBLIC_INTERFACE
  async listTags() {
    if (!API_BASE) return localStore.listTags();
    return http(`/tags`);
  },

  // PUBLIC_INTERFACE
  async addTag(tag) {
    if (!API_BASE) return localStore.addTag(tag);
    return http(`/tags`, { method: "POST", body: JSON.stringify({ tag }) });
  },

  // PUBLIC_INTERFACE
  async removeTag(tag) {
    if (!API_BASE) return localStore.removeTag(tag);
    return http(`/tags/${encodeURIComponent(tag)}`, { method: "DELETE" });
  }
};
