const NOTES_STORAGE_KEY = 'learnhub_notes';

// Get all notes from localStorage
const getAllNotes = () => {
  try {
    const notes = localStorage.getItem(NOTES_STORAGE_KEY);
    return notes ? JSON.parse(notes) : [];
  } catch (error) {
    console.error('Error reading notes from localStorage:', error);
    return [];
  }
};

// Save notes to localStorage
const saveNotes = (notes) => {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving notes to localStorage:', error);
  }
};

// Generate next ID
const generateId = () => {
  const notes = getAllNotes();
  return notes.length > 0 ? Math.max(...notes.map(note => note.Id)) + 1 : 1;
};

// Get notes by lesson ID
const getByLessonId = async (lessonId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allNotes = getAllNotes();
      const lessonNotes = allNotes.filter(note => note.lessonId === lessonId);
      resolve([...lessonNotes]);
    }, 200);
  });
};

// Create a new note
const create = async (noteData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const notes = getAllNotes();
      const newNote = {
        Id: generateId(),
        ...noteData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      notes.push(newNote);
      saveNotes(notes);
      resolve({ ...newNote });
    }, 300);
  });
};

// Update an existing note
const update = async (id, noteData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const notes = getAllNotes();
      const index = notes.findIndex(note => note.Id === id);
      
      if (index === -1) {
        reject(new Error('Note not found'));
        return;
      }
      
      notes[index] = {
        ...notes[index],
        ...noteData,
        Id: id, // Ensure ID cannot be changed
        updatedAt: new Date().toISOString()
      };
      
      saveNotes(notes);
      resolve({ ...notes[index] });
    }, 300);
  });
};

// Delete a note
const remove = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const notes = getAllNotes();
      const index = notes.findIndex(note => note.Id === id);
      
      if (index === -1) {
        reject(new Error('Note not found'));
        return;
      }
      
      notes.splice(index, 1);
      saveNotes(notes);
      resolve(true);
    }, 200);
  });
};

// Get all notes
const getAll = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...getAllNotes()]);
    }, 200);
  });
};

// Get note by ID
const getById = async (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const notes = getAllNotes();
      const note = notes.find(note => note.Id === id);
      
      if (!note) {
        reject(new Error('Note not found'));
        return;
      }
      
      resolve({ ...note });
    }, 200);
  });
};

export const notesService = {
  getAll,
  getById,
  getByLessonId,
  create,
  update,
  delete: remove
};