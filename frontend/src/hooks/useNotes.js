import { useState, useEffect, useCallback } from "react";
import * as API from "../api/api";

export function useNotes(token) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadNotes = useCallback(async () => {
    if (!token) {
      setNotes([]);
      return;
    }
    setLoading(true);
    try {
      const data = await API.fetchNotes(token);
      setNotes(data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const createNote = async (note) => {
    try {
      await API.createNote(token, note);
      await loadNotes();
    } catch (err) {
      throw err;
    }
  };

  const updateNote = async (id, note) => {
    try {
      await API.updateNote(token, id, note);
      await loadNotes();
    } catch (err) {
      throw err;
    }
  };

  const deleteNote = async (id) => {
    try {
      await API.deleteNote(token, id);
      await loadNotes();
    } catch (err) {
      throw err;
    }
  };

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    reload: loadNotes,
  };
}
