import React from "react";
import "./App.css";
import { NotesProvider } from "./context/NotesContext";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { NotesList } from "./components/NotesList";
import { NoteEditor } from "./components/NoteEditor";

/**
 * PUBLIC_INTERFACE
 * App: Entry point for the Personal Notes application. Renders a responsive layout
 * with a sidebar, notes list, and editor. Uses NotesProvider for app state and
 * automatically falls back to local storage when REACT_APP_API_BASE is not set.
 */
function App() {
  return (
    <NotesProvider>
      <div className="app-shell">
        <Header />
        <main className="app-main">
          <Sidebar />
          <NotesList />
          <div className="editor-area">
            <NoteEditor />
          </div>
        </main>
      </div>
    </NotesProvider>
  );
}

export default App;
