import { toast } from "react-toastify";
import downloadedVideos from "@/services/mockData/downloadedVideos.json";

// Simulate download storage
let downloadedVideosList = [...downloadedVideos];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const downloadService = {
  async getDownloadedVideos() {
    await delay(200);
    return [...downloadedVideosList];
  },

  async downloadVideo(lesson, onProgress) {
    await delay(300);
    
    // Check if already downloaded
    const existing = downloadedVideosList.find(d => d.videoUrl === lesson.videoUrl);
    if (existing) {
      throw new Error("Video already downloaded");
    }

    // Simulate download progress
    const totalSteps = 20;
    for (let i = 0; i <= totalSteps; i++) {
      const progress = Math.round((i / totalSteps) * 100);
      onProgress(progress);
      await delay(150);
    }

    // Add to downloaded videos
    const newDownload = {
      Id: Math.max(...downloadedVideosList.map(d => d.Id), 0) + 1,
      videoUrl: lesson.videoUrl,
      lessonTitle: lesson.title,
      courseTitle: lesson.courseTitle || "Unknown Course",
      duration: lesson.duration || 0,
      downloadedAt: new Date().toISOString(),
      fileSize: "125 MB"
    };

    downloadedVideosList.push(newDownload);
    return newDownload;
  },

  async deleteDownload(Id) {
    await delay(200);
    const index = downloadedVideosList.findIndex(d => d.Id === Id);
    if (index === -1) {
      throw new Error("Downloaded video not found");
    }
    
    downloadedVideosList.splice(index, 1);
    return true;
  },

  async getDownloadById(Id) {
    await delay(200);
    return downloadedVideosList.find(d => d.Id === Id) || null;
  }
};

export { downloadService };