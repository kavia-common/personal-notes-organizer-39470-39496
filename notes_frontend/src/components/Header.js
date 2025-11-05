import React from "react";
import { theme } from "../theme";

// PUBLIC_INTERFACE
export function Header() {
  const envRemote = Boolean(process.env.REACT_APP_API_BASE);
  return (
    <header style={styles.header}>
      <div style={styles.brand}>
        <div style={styles.logo}>🗒️</div>
        <div>
          <div style={styles.title}>Personal Notes</div>
          <div style={styles.subtitle}>Ocean Professional</div>
        </div>
      </div>
      <div style={styles.envBadge} title={envRemote ? "Using backend API" : "Local-only mode"}>
        {envRemote ? "Remote API" : "Local Mode"}
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 18px",
    background: `linear-gradient(90deg, ${theme.colors.gradientFrom}, ${theme.colors.gradientTo})`,
    borderBottom: `1px solid ${theme.colors.border}`,
    position: "sticky",
    top: 0,
    zIndex: 10
  },
  brand: { display: "flex", gap: 12, alignItems: "center" },
  logo: {
    width: 36,
    height: 36,
    background: theme.colors.primary,
    color: "white",
    display: "grid",
    placeItems: "center",
    borderRadius: theme.radius.md,
    boxShadow: theme.shadow.sm
  },
  title: { color: theme.colors.text, fontWeight: 700, letterSpacing: 0.2 },
  subtitle: { color: theme.colors.textMuted, fontSize: 12 },
  envBadge: {
    fontSize: 12,
    padding: "6px 10px",
    borderRadius: theme.radius.pill,
    border: `1px solid ${theme.colors.border}`,
    color: theme.colors.textMuted,
    background: theme.colors.surface,
    boxShadow: theme.shadow.sm
  }
};
