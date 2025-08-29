
// Types
export type Note = {
  id: number;
  title: string;
  content: string;
  category: string;
};

export type AppContextType = {
  // State
  notes: Note[];
  filterCategory: string;
  
  // Filter actions
  setFilterCategory: (category: string) => void;
  
  // Notes actions
  addNote: (title: string, content: string, category: string) => void;
  deleteNote: (id: number) => void;
  editNote: (id: number, newTitle: string, newContent: string) => void;
}