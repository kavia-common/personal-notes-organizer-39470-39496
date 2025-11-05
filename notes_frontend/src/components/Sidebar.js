import React, { useState } from "react";
import { useNotes } from "../context/NotesContext";
import { theme } from "../theme";

// PUBLIC_INTERFACE
export function Sidebar() {
  const {
    state: { tags, filters },
    actions
  } = useNotes();
  const [newTag, setNewTag] = useState("");

  const handleAddTag = async e => {
    e.preventDefault();
    const tag = newTag.trim();
    if (tag) {
      await actions.addTag(tag);
      setNewTag("");
    }
  };

  return (
    <aside style={styles.wrapper}>
      <div style={styles.section}>
        <button style={styles.createBtn} onClick={actions.createNote}>+ New Note</button>
      </div>

      <div style={styles.section}>
        <label style={styles.label}>Search</label>
        <input
          aria-label="Search notes"
          placeholder="Search notes..."
          value={filters.search}
          onChange={e => actions.setSearch(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.section}>
        <label style={styles.label}>Tags</label>
        <div style={styles.tags}>
          <Tag
            text="All"
            active={!filters.tag}
            onClick={() => actions.setTagFilter("")}
          />
          {tags.map(tag => (
            <Tag
              key={tag}
              text={tag}
              active={filters.tag === tag}
              onClick={() => actions.setTagFilter(tag)}
              removable
              onRemove={() => actions.removeTag(tag)}
            />
          ))}
        </div>
        <form onSubmit={handleAddTag} style={{ marginTop: 8, display: "flex", gap: 8 }}>
          <input
            aria-label="New tag"
            placeholder="Add tag..."
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            style={{ ...styles.input, flex: 1 }}
          />
          <button style={styles.addBtn} type="submit">Add</button>
        </form>
      </div>
    </aside>
  );
}

function Tag({ text, active, onClick, removable, onRemove }) {
  return (
    <div style={{ ...styles.tag, ...(active ? styles.tagActive : {}) }} onClick={onClick}>
      <span>{text}</span>
      {removable && (
        <button
          type="button"
          aria-label={`Remove ${text}`}
          onClick={e => {
            e.stopPropagation();
            onRemove && onRemove();
          }}
          style={styles.removeTagBtn}
          title="Remove tag"
        >
          ×
        </button>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    width: 280,
    minWidth: 240,
    padding: 16,
    borderRight: `1px solid ${theme.colors.border}`,
    background: theme.colors.surface,
    boxShadow: theme.shadow.sm,
  },
  section: { marginBottom: 18 },
  createBtn: {
    width: "100%",
    padding: "10px 12px",
    background: theme.colors.primary,
    color: "#fff",
    border: "none",
    borderRadius: theme.radius.md,
    cursor: "pointer",
    boxShadow: theme.shadow.md,
    transition: theme.transition
  },
  label: { display: "block", fontSize: 12, color: theme.colors.textMuted, marginBottom: 6 },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.colors.border}`,
    outline: "none",
    transition: theme.transition,
    background: "white"
  },
  addBtn: {
    padding: "10px 12px",
    background: theme.colors.secondary,
    color: "#111827",
    border: "none",
    borderRadius: theme.radius.sm,
    cursor: "pointer",
    transition: theme.transition
  },
  tags: { display: "flex", gap: 8, flexWrap: "wrap" },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: theme.radius.pill,
    border: `1px solid ${theme.colors.border}`,
    background: "#fff",
    color: theme.colors.text,
    cursor: "pointer",
    boxShadow: theme.shadow.sm
  },
  tagActive: {
    background: theme.colors.gradientFrom,
    borderColor: theme.colors.primary,
    boxShadow: theme.shadow.md
  },
  removeTagBtn: {
    border: "none",
    background: "transparent",
    color: theme.colors.textMuted,
    cursor: "pointer",
    fontSize: 14,
    lineHeight: 1
  }
};
