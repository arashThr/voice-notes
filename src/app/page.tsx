'use client'
import { useEffect, useState } from 'react';
import { useAppContext } from './context';
import Link from 'next/link';
import { Note } from './types';

// Components
function FilterButtons() {
  const { filterCategory, setFilterCategory } = useAppContext();
  
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        onClick={() => setFilterCategory('all')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          filterCategory === 'all'
            ? 'bg-gray-800 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        All Notes
      </button>
      <button
        onClick={() => setFilterCategory('personal')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          filterCategory === 'personal'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Personal
      </button>
      <button
        onClick={() => setFilterCategory('work')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          filterCategory === 'work'
            ? 'bg-green-500 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Work
      </button>
      <button
        onClick={() => setFilterCategory('shopping')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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

function HomeContent() {
  const {notes, deleteNote, editNote, filterCategory} = useAppContext()

  // Filter notes based on selected category
  const filteredNotes = filterCategory === 'all' 
    ? notes 
    : notes.filter(note => note.category === filterCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Voice Notes</h1>
          <p className="text-gray-600">Capture your thoughts, organize your life</p>
        </div>

        {/* Floating Action Button */}
        <Link href="/add">
          <button className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </Link>

        {/* Filter Buttons */}
        <FilterButtons />

        {/* Notes List */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            {filterCategory === 'all' 
              ? `All Notes (${filteredNotes.length})`
              : `${filterCategory.charAt(0).toUpperCase() + filterCategory.slice(1)} Notes (${filteredNotes.length})`
            }
          </h2>
          
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-lg text-gray-500 mb-2">
                {filterCategory === 'all' ? 'No notes yet' : `No ${filterCategory} notes yet`}
              </p>
              <p className="text-sm text-gray-400">Add your first note above to get started!</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredNotes.map(note => (
                <NoteCard 
                  key={note.id} 
                  note={note} 
                  onDelete={deleteNote}
                  onEdit={editNote}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function NoteCard({ 
  note, 
  onDelete, 
  onEdit 
}: { 
  note: Note;
  onDelete: (id: number) => void;
  onEdit: (id: number, title: string, content: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);

  // Reset edit fields when editing mode changes
  useEffect(() => {
    if (isEditing) {
      setEditTitle(note.title);
      setEditContent(note.content);
    }
  }, [isEditing, note.title, note.content]);

  const handleSave = () => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert('Title and content cannot be empty');
      return;
    }
    onEdit(note.id, editTitle.trim(), editContent.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'personal': return 'bg-blue-500';
      case 'work': return 'bg-green-500';
      case 'shopping': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Category indicator */}
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getCategoryColor(note.category)}`}></div>
        <span className="text-sm text-gray-500 capitalize whitespace-nowrap">{note.category}</span>
      </div>

      {/* Note content */}
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-3">
              <input 
                type="text" 
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-lg font-semibold focus:outline-none focus:border-blue-500"
                placeholder="Enter note title..."
              />
              <textarea 
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 h-24 resize-none focus:outline-none focus:border-blue-500"
                placeholder="Enter note content..."
              />
              <div className="flex gap-2">
                <button 
                  onClick={handleSave}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  Save
                </button>
                <button 
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{note.title}</h3>
              <p className="text-gray-700 leading-relaxed mb-4">{note.content}</p>
            </div>
          )}
        </div>
        
        {!isEditing && (
          <div className="ml-4 flex gap-2">
            <button 
              onClick={() => setIsEditing(true)}
              className="text-blue-500 hover:text-blue-700 px-3 py-1 text-sm font-medium transition-colors"
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(note.id)}
              className="text-red-500 hover:text-red-700 px-3 py-1 text-sm font-medium transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Creation date */}
      {!isEditing && (
        <div className="text-sm text-gray-400 mt-4">
          {new Date(note.id).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      )}
    </div>
  );
}

// Main App Component
export default function Home() {
  return (
    <HomeContent />
  );
}