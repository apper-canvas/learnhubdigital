import { courseService } from "@/services/api/courseService";
import { progressService } from "@/services/api/progressService";

// Simulate API delay for realistic loading states
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const certificateService = {
  async getCertificate(courseId) {
    await delay(300);
    
    const course = await courseService.getById(parseInt(courseId));
    const progress = await progressService.getByCourseId(courseId);
    
    if (!course || !progress || progress.overallProgress !== 100) {
      throw new Error("Certificate not available");
    }
    
    return {
      certificateId: progress.certificateId,
      course: {
        title: course.title,
        instructor: course.instructor,
        category: course.category,
        duration: course.duration
      },
      studentName: "John Doe", // In real app, this would come from user context
      completedDate: progress.completedDate || progress.lastAccessed,
      overallScore: Math.round(
        Object.values(progress.quizScores).reduce((sum, score) => sum + score, 0) / 
        Object.values(progress.quizScores).length
      )
    };
  },

  async downloadCertificate(courseId) {
    await delay(300);
    
    try {
      const certificate = await this.getCertificate(courseId);
      
      // Create certificate canvas
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      
      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Border
      ctx.strokeStyle = '#4f46e5';
      ctx.lineWidth = 8;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
      
      // Inner border
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
      
      // Title
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Certificate of Completion', canvas.width / 2, 150);
      
      // Subtitle
      ctx.font = '24px Arial';
      ctx.fillStyle = '#6b7280';
      ctx.fillText('This is to certify that', canvas.width / 2, 220);
      
      // Student name
      ctx.font = 'bold 42px Arial';
      ctx.fillStyle = '#4f46e5';
      ctx.fillText(certificate.studentName, canvas.width / 2, 300);
      
      // Completion text
      ctx.font = '24px Arial';
      ctx.fillStyle = '#6b7280';
      ctx.fillText('has successfully completed the course', canvas.width / 2, 360);
      
      // Course title
      ctx.font = 'bold 36px Arial';
      ctx.fillStyle = '#1f2937';
      ctx.fillText(certificate.course.title, canvas.width / 2, 430);
      
      // Course details
      ctx.font = '20px Arial';
      ctx.fillStyle = '#6b7280';
      ctx.fillText(`Instructor: ${certificate.course.instructor}`, canvas.width / 2, 480);
      ctx.fillText(`Category: ${certificate.course.category}`, canvas.width / 2, 510);
      ctx.fillText(`Final Score: ${certificate.overallScore}%`, canvas.width / 2, 540);
      
      // Date
      ctx.font = '18px Arial';
      const completedDate = new Date(certificate.completedDate).toLocaleDateString();
      ctx.fillText(`Completed on: ${completedDate}`, canvas.width / 2, 600);
      
      // Certificate ID
      ctx.font = '14px Arial';
      ctx.fillStyle = '#9ca3af';
      ctx.fillText(`Certificate ID: ${certificate.certificateId}`, canvas.width / 2, 720);
      
      // Convert to blob and download
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `certificate-${certificate.course.title.replace(/\s+/g, '-').toLowerCase()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          resolve();
        }, 'image/png');
      });
      
    } catch (error) {
      throw new Error("Failed to generate certificate");
    }
  }
};