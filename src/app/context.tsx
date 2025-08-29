'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { AppContextType, Note } from "./types";

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppContextProvider({children}: {children: React.ReactNode}) {
    const [filterCategory, setFilterCategory] = useState('all')
    const {notes, addNote, deleteNote, editNote} = useNotes()

    return (
        <AppContext value={{notes, addNote, deleteNote, editNote, filterCategory, setFilterCategory}}>
            {children}
        </AppContext>
    )
}

export function useAppContext() {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error('useAppContext must be used within an AppContextProvider')
    }
    return context
}

// Custom Hook for Notes Management
function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('voice-notes');
    if (savedNotes && savedNotes.trim() !== '') {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('voice-notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (title: string, content: string, category: string) => {
    const newNote = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      category,
    };
    setNotes(prev => [...prev, newNote]);
  };
  
  const deleteNote = (id: number) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const editNote = (id: number, newTitle: string, newContent: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, title: newTitle, content: newContent }
        : note
    ));
  };

  return { notes, addNote, deleteNote, editNote };
}
