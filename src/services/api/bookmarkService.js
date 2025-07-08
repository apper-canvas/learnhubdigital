import bookmarksData from "@/services/mockData/bookmarks.json";

// Simulate API delay for realistic loading states
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Track next ID for new bookmarks
let nextId = Math.max(...bookmarksData.map(b => b.Id), 0) + 1;

export const bookmarkService = {
  async getAll() {
    await delay(300);
    return [...bookmarksData];
  },

  async getById(id) {
    await delay(200);
    const bookmark = bookmarksData.find(bookmark => bookmark.Id === id);
    if (!bookmark) {
      throw new Error("Bookmark not found");
    }
    return { ...bookmark };
  },

  async create(bookmarkData) {
    await delay(300);
    const newBookmark = {
      ...bookmarkData,
      Id: nextId++,
      userId: 1, // Assuming current user ID is 1
      createdAt: new Date().toISOString()
    };
    bookmarksData.push(newBookmark);
    return { ...newBookmark };
  },

  async delete(courseId) {
    await delay(300);
    const index = bookmarksData.findIndex(bookmark => bookmark.courseId === courseId);
    if (index === -1) {
      throw new Error("Bookmark not found");
    }
    const deletedBookmark = bookmarksData.splice(index, 1)[0];
    return { ...deletedBookmark };
  },

  async update(id, updateData) {
    await delay(300);
    const index = bookmarksData.findIndex(bookmark => bookmark.Id === id);
    if (index === -1) {
      throw new Error("Bookmark not found");
    }
    bookmarksData[index] = { ...bookmarksData[index], ...updateData };
    return { ...bookmarksData[index] };
  }
};