import progressData from "@/services/mockData/progress.json";

// Simulate API delay for realistic loading states
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const progressService = {
  async getAll() {
    await delay(300);
    return [...progressData];
  },

  async getById(id) {
    await delay(200);
    const progress = progressData.find(p => p.Id === id);
    if (!progress) {
      throw new Error("Progress not found");
    }
    return { ...progress };
  },

  async getByCourseId(courseId) {
    await delay(200);
    const progress = progressData.find(p => p.courseId === courseId);
    return progress ? { ...progress } : null;
  },

  async create(progressItem) {
    await delay(400);
    const newProgress = {
      ...progressItem,
      Id: Math.max(...progressData.map(p => p.Id)) + 1,
      createdAt: new Date().toISOString()
    };
    progressData.push(newProgress);
    return { ...newProgress };
  },

  async update(id, updateData) {
    await delay(300);
    const index = progressData.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Progress not found");
    }
    progressData[index] = { ...progressData[index], ...updateData };
    return { ...progressData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = progressData.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Progress not found");
    }
    const deletedProgress = progressData.splice(index, 1)[0];
    return { ...deletedProgress };
  }
};