import coursesData from "@/services/mockData/courses.json";

// Simulate API delay for realistic loading states
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const courseService = {
  async getAll() {
    await delay(300);
    return [...coursesData];
  },

  async getById(id) {
    await delay(200);
    const course = coursesData.find(course => course.Id === id);
    if (!course) {
      throw new Error("Course not found");
    }
    return { ...course };
  },

  async create(courseData) {
    await delay(400);
    const newCourse = {
      ...courseData,
      Id: Math.max(...coursesData.map(c => c.Id)) + 1,
      createdAt: new Date().toISOString()
    };
    coursesData.push(newCourse);
    return { ...newCourse };
  },

  async update(id, updateData) {
    await delay(300);
    const index = coursesData.findIndex(course => course.Id === id);
    if (index === -1) {
      throw new Error("Course not found");
    }
    coursesData[index] = { ...coursesData[index], ...updateData };
    return { ...coursesData[index] };
  },

  async delete(id) {
    await delay(300);
    const index = coursesData.findIndex(course => course.Id === id);
    if (index === -1) {
      throw new Error("Course not found");
    }
    const deletedCourse = coursesData.splice(index, 1)[0];
    return { ...deletedCourse };
  }
};