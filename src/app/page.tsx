'use client'
import { createContext, useContext, useEffect, useState } from "react";

type Note = {
  id: number
  title: string
  content: string
  category: string
};

type FilterContextType = {
  filterCategory: string;
  setFilterCategory: (category: string) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined)

function FilterProvider({children}: {children: React.ReactNode}) {
  const [filterCategory, setFilterCategory] = useState('all')

  return (
    <FilterContext.Provider value={{filterCategory, setFilterCategory}}>
      {children}
    </FilterContext.Provider>
  )
}

function useFilter() {
  const context = useContext(FilterContext);
  console.log("Context value:", context); // ADD THIS LINE
  if (!context) {
    throw new Error('useFilter must be used within FilterProvider');
  }
  return context;
}

function useNote() {
  const [notes, setNotes] = useState<Note[]>([]);
  // const appContext = useAppContext()

  const addNote = (noteTitle: string, noteContent: string, noteCategory: string) => {
    const newNote = {
      id: Date.now(),
      title: noteTitle,
      content: noteContent,
      category: noteCategory,
    }

    setNotes([...notes, newNote])
  }
  
  const deleteNote = (id: number) => {
    // Immutability: If you change in place with splice, React thinks "same array reference = no change"
    // React uses Object.is() to compare old state vs new state
    setNotes(notes.filter(note => note.id !== id))
  }

  const saveNote = (id: number, newTitle: string, newContent: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id 
        ? { ...note, title: newTitle, content: newContent }
        : note
    ));
  }

  // useEffect handles side effects - code that interacts with the outside world:
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes')
    if (!savedNotes || savedNotes.trim() === '') {
      return
    }
    setNotes(JSON.parse(savedNotes))
  }, [])

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  return {notes, addNote, deleteNote, saveNote}
}

function FilterButtons() {
  const { filterCategory, setFilterCategory } = useFilter();
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={() => setFilterCategory('all')}
        className={`px-3 py-1 rounded-full text-sm ${
          filterCategory === 'all'
            ? 'bg-gray-800 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        All
      </button>
      <button
        onClick={() => setFilterCategory('personal')}
        className={`px-3 py-1 rounded-full text-sm ${
          filterCategory === 'personal'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Personal
      </button>
      <button
        onClick={() => setFilterCategory('work')}
        className={`px-3 py-1 rounded-full text-sm ${
          filterCategory === 'work'
            ? 'bg-green-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Work
      </button>
      <button
        onClick={() => setFilterCategory('shopping')}
        className={`px-3 py-1 rounded-full text-sm ${
          filterCategory === 'shopping'
            ? 'bg-purple-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Shopping
      </button>
    </div>
  );
}

export default function Home() {
  return (
    <FilterProvider>
      <HomeContent/>
    </FilterProvider>
  )
}

function HomeContent() {
  const {notes, addNote, saveNote, deleteNote} = useNote()

  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const {filterCategory} = useFilter()

  const handleAddNote = () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      alert('Please fill in both title and content')
      return
    }
    addNote(noteTitle, noteContent, filterCategory)
    setNoteTitle('')
    setNoteContent('')
  }

  const filteredNote = filterCategory === 'all'
    ? notes
    : notes.filter(note => note.category === filterCategory)


  return (
    <div className="p-5 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Test drive bookings</h1>

      <FilterButtons/>
      
      <div className="mb-6">
        <div className="mb-3">
          <label className="block mr-3">Note title</label>
          <input type="text" className="border border-gray-200 border-b border-b-gray-200 shadow rounded py-1 px-2 w-1/2 h-12"
            placeholder="Enter note title..." value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} />
        </div>
        <div className="mb-3">
          <textarea value={noteContent} placeholder="Enter note content..." onChange={(e) => setNoteContent(e.target.value)}
            className="border border-gray-200 border-b border-b-gray-200 shadow rounded py-1 px-2 w-2/3"
            />
        </div>
        <button onClick={handleAddNote} disabled={!noteTitle.trim() || !noteContent.trim  ()}
          // Template literals - Using backticks for dynamic className strings
          className={`rounded shadow p-2 ${
            noteTitle.trim() && noteContent.trim()
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}>Add note</button>
      </div>

      <div className="py-10">
        <h2 className="pb-5 text-gray-300">Your notes will appear here...</h2>
        {filteredNote.map(note => (
          // Keys are about DOM efficiency for reconciliation when re-rendering a list
          <NoteCard key={note.id} note={note} deleteNote={deleteNote} saveNote={saveNote}/>
        ))}
      </div>
    </div>
  );
}

function NoteCard({note, deleteNote, saveNote}: {
  note: Note,
  deleteNote: (id: number) => void,
  saveNote: (id: number, title: string, content: string) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(note.title)
  const [editedContent, setEditedContent] = useState(note.content)

  const editNote = () => {
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setEditedTitle(note.title)
    setEditedContent(note.content)
    setIsEditing(false)
  }

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'personal': return 'bg-blue-500';
      case 'work': return 'bg-green-500';
      case 'shopping': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  }

  const editing = (
    <div>
      <input type="text" className="border border-gray-200 border-b border-b-gray-200 shadow rounded py-1 px-2 w-1/2 h-12"
        placeholder="Enter note title..." value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
      <textarea value={editedContent} placeholder="Enter note content..." onChange={(e) => setEditedContent(e.target.value)}
        className="border border-gray-200 border-b border-b-gray-200 shadow rounded py-1 px-2 w-2/3"
        />
      <div className="flex gap-2">
        <button className={`p-2 my-4 bg-red-300 rounded`} onClick={() => {
          saveNote(note.id, editedTitle, editedContent)
          setIsEditing(false)
        }}>Save</button>
        <button className={`p-2 my-4 bg-green-300 rounded`} onClick={() => cancelEdit()}>Cancel</button>
      </div>
    </div>
  )

  const showing = (
    <div>
      <h3 className="font-bold">{note.title}</h3>
      <p>{note.content}</p>
      <div className="flex gap-2">
        <button className={`p-2 my-4 bg-red-300 rounded`} onClick={() => deleteNote(note.id)}>Delete</button>
        <button className={`p-2 my-4 bg-green-300 rounded`} onClick={() => editNote()}>Edit</button>
      </div>
    </div>
  )
  
  return (
    <div key={note.id} className="border border-gray-100 border-b-2 shadow rounded-2xl p-5 my-5">
      <div>
        <div className={`w-3 h-3 ${getCategoryColor(note.category)}`}></div>
        <span>{note.category}</span>
      </div>
      {isEditing ? editing : showing}
    </div>
  )
}
