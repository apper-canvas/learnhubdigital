import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import { notesService } from "@/services/api/notesService";

const NotesPanel = ({ isOpen, onClose, lesson, currentTime, courseId }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newNote, setNewNote] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    if (isOpen && lesson) {
      loadNotes();
    }
  }, [isOpen, lesson]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const lessonNotes = await notesService.getByLessonId(lesson.id);
      setNotes(lessonNotes.sort((a, b) => a.timestamp - b.timestamp));
    } catch (error) {
      toast.error("Failed to load notes");
      console.error("Error loading notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCreateNote = async () => {
    if (!newNote.trim()) return;

    try {
      const noteData = {
        lessonId: lesson.id,
        courseId: courseId,
        text: newNote.trim(),
        timestamp: currentTime || 0
      };

      const createdNote = await notesService.create(noteData);
      setNotes(prev => [...prev, createdNote].sort((a, b) => a.timestamp - b.timestamp));
      setNewNote("");
      toast.success("Note created successfully!");
    } catch (error) {
      toast.error("Failed to create note");
      console.error("Error creating note:", error);
    }
  };

  const handleUpdateNote = async (noteId) => {
    if (!editText.trim()) return;

    try {
      const updatedNote = await notesService.update(noteId, { text: editText.trim() });
      setNotes(prev => prev.map(note => 
        note.Id === noteId ? updatedNote : note
      ));
      setEditingNote(null);
      setEditText("");
      toast.success("Note updated successfully!");
    } catch (error) {
      toast.error("Failed to update note");
      console.error("Error updating note:", error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      await notesService.delete(noteId);
      setNotes(prev => prev.filter(note => note.Id !== noteId));
      toast.success("Note deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete note");
      console.error("Error deleting note:", error);
    }
  };

  const startEditing = (note) => {
    setEditingNote(note.Id);
    setEditText(note.text);
  };

  const cancelEditing = () => {
    setEditingNote(null);
    setEditText("");
  };

  const filteredNotes = notes.filter(note =>
    note.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-elevation z-50 lg:relative lg:w-80 lg:shadow-premium"
          >
            <Card className="h-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Notes</h3>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={onClose}
                    className="lg:hidden"
                  >
                    <ApperIcon name="X" size={20} />
                  </Button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Input
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  <ApperIcon 
                    name="Search" 
                    size={16} 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>

              {/* Notes List */}
              <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredNotes.map((note) => (
                      <motion.div
                        key={note.Id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
                            {formatTime(note.timestamp)}
                          </span>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="small"
                              onClick={() => startEditing(note)}
                              className="h-6 w-6 p-0 hover:bg-gray-200"
                            >
                              <ApperIcon name="Edit" size={12} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="small"
                              onClick={() => handleDeleteNote(note.Id)}
                              className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                            >
                              <ApperIcon name="Trash2" size={12} />
                            </Button>
                          </div>
                        </div>

                        {editingNote === note.Id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                              rows="3"
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <Button
                                size="small"
                                onClick={() => handleUpdateNote(note.Id)}
                                className="flex-1"
                              >
                                Save
                              </Button>
                              <Button
                                variant="outline"
                                size="small"
                                onClick={cancelEditing}
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {note.text}
                          </p>
                        )}
                      </motion.div>
                    ))}

                    {filteredNotes.length === 0 && !loading && (
                      <div className="text-center py-8 text-gray-500">
                        {searchTerm ? "No notes match your search" : "No notes yet"}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* New Note Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ApperIcon name="Clock" size={12} />
                    <span>Current time: {formatTime(currentTime || 0)}</span>
                  </div>
                  
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note at current time..."
                    className="w-full p-3 border border-gray-300 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows="3"
                  />
                  
                  <Button
                    onClick={handleCreateNote}
                    disabled={!newNote.trim()}
                    className="w-full"
                  >
                    <ApperIcon name="Plus" size={16} />
                    Add Note
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotesPanel;