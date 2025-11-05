import React from "react";
import { useNotes } from "../context/NotesContext";
import { theme } from "../theme";

// PUBLIC_INTERFACE
export function NotesList() {
  const {
    state: { notes, selectedId, loading, error },
    actions
  } = useNotes();

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <div style={{ fontWeight: 600, color: theme.colors.text }}>Notes</div>
        <div style={{ color: theme.colors.textMuted, fontSize: 12 }}>{notes.length} total</div>
      </div>

      {loading && <div style={styles.info}>Loading...</div>}
      {error && <div style={{ ...styles.info, color: theme.colors.error }}>Error: {error}</div>}
      {!loading && !notes.length && <div style={styles.info}>No notes. Create your first note.</div>}

      <div style={styles.list}>
        {notes.map(n => (
          <div
            key={n.id}
            style={{ ...styles.item, ...(selectedId === n.id ? styles.itemActive : {}) }}
            onClick={() => actions.selectNote(n.id)}
            role="button"
          >
            <div style={styles.itemHeader}>
              <div style={styles.itemTitle}>{n.title || "Untitled"}</div>
              <div style={styles.itemTime}>{new Date(n.updatedAt).toLocaleString()}</div>
            </div>
            {!!(n.tags || []).length && (
              <div style={styles.tagsRow}>
                {(n.tags || []).map(t => (
                  <span key={t} style={styles.tag}>{t}</span>
                ))}
              </div>
            )}
            <div style={styles.preview}>{(n.content || "").slice(0, 80) || "No content"}</div>
            <button
              style={styles.deleteBtn}
              onClick={e => {
                e.stopPropagation();
                actions.deleteNote(n.id);
              }}
              aria-label={`Delete ${n.title}`}
              title="Delete note"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  panel: {
    width: 360,
    minWidth: 260,
    borderRight: `1px solid ${theme.colors.border}`,
    background: theme.colors.surface,
    display: "flex",
    flexDirection: "column"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 14px",
    borderBottom: `1px solid ${theme.colors.border}`,
    background: `linear-gradient(180deg, ${theme.colors.gradientFrom}, transparent)`
  },
  info: {
    padding: 12,
    color: theme.colors.textMuted
  },
  list: {
    overflowY: "auto",
    padding: 12,
    display: "grid",
    gap: 12
  },
  item: {
    padding: 12,
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadow.sm,
    background: "#fff",
    cursor: "pointer",
    transition: theme.transition,
    position: "relative"
  },
  itemActive: {
    borderColor: theme.colors.primary,
    boxShadow: theme.shadow.md,
    background: `linear-gradient(180deg, ${theme.colors.gradientFrom}, #fff)`
  },
  itemHeader: { display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 6 },
  itemTitle: { fontWeight: 600, color: theme.colors.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  itemTime: { fontSize: 12, color: theme.colors.textMuted },
  preview: { fontSize: 13, color: theme.colors.textMuted, marginTop: 6 },
  tagsRow: { display: "flex", gap: 6, flexWrap: "wrap" },
  tag: {
    fontSize: 11,
    padding: "3px 8px",
    borderRadius: theme.radius.pill,
    background: theme.colors.gradientFrom,
    border: `1px solid ${theme.colors.border}`,
    color: theme.colors.text
  },
  deleteBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    border: "none",
    background: "transparent",
    color: theme.colors.error,
    cursor: "pointer",
    fontSize: 12
  }
};
