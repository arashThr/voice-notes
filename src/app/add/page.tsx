"use client";

import { useState } from "react";
import { useAppContext } from "../context";
import { useRouter } from "next/navigation";

export default function AddNote() {
  const {addNote} = useAppContext()
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("personal");
  const router = useRouter()

  const handleAddNote = () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      alert("Please fill in both title and content");
      return;
    }

    addNote(noteTitle, noteContent, selectedCategory);
    setNoteTitle("");
    setNoteContent("");
    router.push('/')
  };

  return (
    <div className="min-h-screen bg-gray-50">
    <div className="max-w-4xl mx-auto px-4 py-8 my-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Note</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="personal">Personal</option>
            <option value="work">Work</option>
            <option value="shopping">Shopping</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            placeholder="Enter note title..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg h-24 resize-none focus:outline-none focus:border-blue-500"
            placeholder="Enter note content..."
          />
        </div>

        <button
          onClick={handleAddNote}
          disabled={!noteTitle.trim() || !noteContent.trim()}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
            noteTitle.trim() && noteContent.trim()
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Add Note
        </button>
      </div>
    </div>
    </div>
  );
}
