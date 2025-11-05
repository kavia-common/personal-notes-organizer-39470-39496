import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { api } from "../services/api";

const NotesContext = createContext(null);

const initialState = {
  notes: [],
  selectedId: null,
  tags: [],
  filters: {
    search: "",
    tag: ""
  },
  loading: false,
  error: null
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "SET_NOTES":
      return { ...state, notes: action.notes };
    case "SET_TAGS":
      return { ...state, tags: action.tags };
    case "SELECT":
      return { ...state, selectedId: action.id };
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.filters } };
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function NotesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  const refresh = async () => {
    dispatch({ type: "SET_LOADING", loading: true });
    try {
      const [notes, tags] = await Promise.all([
        api.listNotes({ search: state.filters.search, tag: state.filters.tag }),
        api.listTags()
      ]);
      dispatch({ type: "SET_NOTES", notes });
      dispatch({ type: "SET_TAGS", tags });
      dispatch({ type: "SET_ERROR", error: null });
    } catch (e) {
      dispatch({ type: "SET_ERROR", error: e.message || String(e) });
    } finally {
      dispatch({ type: "SET_LOADING", loading: false });
    }
  };

  useEffect(() => {
    refresh().finally(() => setHydrated(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (hydrated) {
      refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.filters.search, state.filters.tag]);

  const actions = useMemo(
    () => ({
      // PUBLIC_INTERFACE
      selectNote: id => dispatch({ type: "SELECT", id }),

      // PUBLIC_INTERFACE
      setSearch: search => dispatch({ type: "SET_FILTERS", filters: { search } }),

      // PUBLIC_INTERFACE
      setTagFilter: tag => dispatch({ type: "SET_FILTERS", filters: { tag } }),

      // PUBLIC_INTERFACE
      async createNote() {
        const created = await api.createNote({ title: "Untitled", content: "", tags: [] });
        await refresh();
        dispatch({ type: "SELECT", id: created.id });
        return created;
      },

      // PUBLIC_INTERFACE
      async updateNote(id, updates) {
        await api.updateNote(id, updates);
        await refresh();
      },

      // PUBLIC_INTERFACE
      async deleteNote(id) {
        await api.deleteNote(id);
        await refresh();
        if (state.selectedId === id) dispatch({ type: "SELECT", id: null });
      },

      // PUBLIC_INTERFACE
      async addTag(tag) {
        if (!tag) return;
        await api.addTag(tag);
        await refresh();
      },

      // PUBLIC_INTERFACE
      async removeTag(tag) {
        await api.removeTag(tag);
        await refresh();
      }
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hydrated, state.selectedId, state.filters.search, state.filters.tag]
  );

  const value = useMemo(
    () => ({ state, actions, isRemote: api.isRemote }),
    [state, actions]
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

// PUBLIC_INTERFACE
export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotes must be used within NotesProvider");
  return ctx;
}
