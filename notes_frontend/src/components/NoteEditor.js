import React, { useEffect, useMemo, useState } from "react";
import { useNotes } from "../context/NotesContext";
import { theme } from "../theme";

// PUBLIC_INTERFACE
export function NoteEditor() {
  const {
    state: { notes, selectedId, tags },
    actions
  } = useNotes();

  const note = useMemo(() => notes.find(n => n.id === selectedId) || null, [notes, selectedId]);

  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [selectedTags, setSelectedTags] = useState(note?.tags || []);

  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
    setSelectedTags(note?.tags || []);
  }, [note?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handler = setTimeout(() => {
      if (note) {
        actions.updateNote(note.id, { title, content, tags: selectedTags });
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [title, content, selectedTags, note, actions]);

  if (!note) {
    return (
      <div style={styles.placeholder}>
        <div style={styles.placeholderCard}>
          <div style={{ fontSize: 18, fontWeight: 600, color: theme.colors.text }}>No note selected</div>
          <div style={{ color: theme.colors.textMuted, marginTop: 6 }}>Select a note or create a new one.</div>
          <button style={{ ...styles.createBtn, marginTop: 12 }} onClick={actions.createNote}>+ New Note</button>
        </div>
      </div>
    );
  }

  const toggleTag = t => {
    setSelectedTags(prev => (prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]));
  };

  return (
    <div style={styles.editor}>
      <div style={styles.toolbar}>
        <input
          style={styles.titleInput}
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <button style={styles.deleteBtn} onClick={() => actions.deleteNote(note.id)}>Delete</button>
      </div>

      <div style={styles.tagsRow}>
        {tags.map(t => (
          <button
            key={t}
            type="button"
            onClick={() => toggleTag(t)}
            style={{ ...styles.tagBtn, ...(selectedTags.includes(t) ? styles.tagBtnActive : {}) }}
          >
            {t}
          </button>
        ))}
      </div>

      <textarea
        style={styles.textarea}
        placeholder="Write your note..."
        value={content}
        onChange={e => setContent(e.target.value)}
      />
    </div>
  );
}

const styles = {
  placeholder: { display: "grid", placeItems: "center", height: "100%" },
  placeholderCard: {
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.lg,
    padding: 24,
    background: "#fff",
    boxShadow: theme.shadow.md,
    textAlign: "center"
  },
  editor: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: 16,
    gap: 12
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    gap: 8
  },
  titleInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: 600,
    padding: "10px 12px",
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.colors.border}`,
    outline: "none"
  },
  deleteBtn: {
    padding: "10px 12px",
    background: "transparent",
    color: theme.colors.error,
    border: `1px solid ${theme.colors.error}`,
    borderRadius: theme.radius.sm,
    cursor: "pointer"
  },
  tagsRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  tagBtn: {
    padding: "6px 10px",
    fontSize: 12,
    borderRadius: theme.radius.pill,
    border: `1px solid ${theme.colors.border}`,
    background: "#fff",
    color: theme.colors.text,
    cursor: "pointer"
  },
  tagBtnActive: {
    borderColor: theme.colors.primary,
    background: theme.colors.gradientFrom
  },
  textarea: {
    flex: 1,
    resize: "none",
    padding: 12,
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.border}`,
    outline: "none",
    fontFamily: "inherit",
    lineHeight: 1.6,
    background: "#fff",
    boxShadow: theme.shadow.sm
  },
  createBtn: {
    padding: "10px 12px",
    background: theme.colors.primary,
    color: "#fff",
    border: "none",
    borderRadius: theme.radius.md,
    cursor: "pointer"
  }
};
