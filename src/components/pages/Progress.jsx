import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Progress from "@/components/atoms/Progress";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { courseService } from "@/services/api/courseService";
import { progressService } from "@/services/api/progressService";
const ProgressPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [coursesData, progressData] = await Promise.all([
        courseService.getAll(),
        progressService.getAll()
      ]);
      
      setCourses(coursesData);
      setUserProgress(progressData);
    } catch (err) {
      setError("Failed to load progress data. Please try again.");
      console.error("Error loading progress:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const enrolledCourses = userProgress.map(progress => {
    const course = courses.find(c => c.Id === parseInt(progress.courseId));
    return course ? { ...course, progress } : null;
  }).filter(Boolean);

  const completedCourses = enrolledCourses.filter(course => course.progress.overallProgress === 100);
  const totalLessonsCompleted = userProgress.reduce((total, progress) => total + progress.completedLessons.length, 0);
  const totalLessons = enrolledCourses.reduce((total, course) => total + course.lessons.length, 0);
  const overallProgress = totalLessons > 0 ? (totalLessonsCompleted / totalLessons) * 100 : 0;

  const avgQuizScore = userProgress.reduce((total, progress) => {
    const scores = Object.values(progress.quizScores);
    const avg = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
    return total + avg;
  }, 0) / (userProgress.length || 1);

  const stats = [
    {
      title: "Overall Progress",
      value: `${Math.round(overallProgress)}%`,
      icon: "TrendingUp",
      color: "primary"
    },
    {
      title: "Courses Completed",
      value: `${completedCourses.length}/${enrolledCourses.length}`,
      icon: "Award",
      color: "success"
    },
    {
      title: "Lessons Completed",
      value: `${totalLessonsCompleted}/${totalLessons}`,
      icon: "CheckCircle",
      color: "accent"
    },
    {
      title: "Average Quiz Score",
      value: `${Math.round(avgQuizScore)}%`,
      icon: "Target",
      color: "secondary"
    }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Learning Progress</h1>
        <p className="text-gray-600 mt-1">
          Track your achievements and see how far you've come
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                  <ApperIcon name={stat.icon} size={24} className={`text-${stat.color}-600`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Overall Progress */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Learning Progress</h2>
        <Progress value={overallProgress} showText={true} size="large" />
        <div className="mt-4 text-sm text-gray-600">
          You've completed {totalLessonsCompleted} out of {totalLessons} lessons across all enrolled courses
        </div>
      </Card>

      {/* Course Progress */}
      {enrolledCourses.length > 0 ? (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Progress</h2>
          
          <div className="space-y-6">
            {enrolledCourses.map((course) => {
              const completedLessons = course.progress.completedLessons.length;
              const totalLessons = course.lessons.length;
              const progress = course.progress.overallProgress;
              const quizScores = Object.values(course.progress.quizScores);
              const avgQuizScore = quizScores.length > 0 ? quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length : 0;

              return (
                <motion.div
                  key={course.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border border-gray-200 rounded-xl p-6"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={course.thumbnail} 
                      alt={course.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                      <p className="text-gray-600">{course.instructor}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {progress === 100 && (
                          <Badge variant="success" size="small">
                            Completed
                          </Badge>
                        )}
                        <Badge variant="gray" size="small">
                          {course.category}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Course Progress</span>
                        <span className="text-sm text-gray-600">{completedLessons}/{totalLessons} lessons</span>
                      </div>
                      <Progress value={progress} showText={true} />
                    </div>

                    {quizScores.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Average Quiz Score</span>
                          <div className="text-2xl font-bold text-gray-900 mt-1">
                            {Math.round(avgQuizScore)}%
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Quizzes Completed</span>
                          <div className="text-2xl font-bold text-gray-900 mt-1">
                            {quizScores.length}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      ) : (
        <Empty
          title="No progress to show"
          description="Start learning by enrolling in a course to see your progress here."
          actionLabel="Browse Courses"
          onAction={() => navigate("/courses")}
          icon="TrendingUp"
        />
      )}
    </div>
  );
};

export default ProgressPage;