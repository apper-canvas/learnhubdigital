import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Progress from "@/components/atoms/Progress";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { courseService } from "@/services/api/courseService";
import { progressService } from "@/services/api/progressService";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [courseData, progressData] = await Promise.all([
        courseService.getById(parseInt(courseId)),
        progressService.getByCourseId(courseId)
      ]);
      
      setCourse(courseData);
      setUserProgress(progressData);
    } catch (err) {
      setError("Failed to load course details. Please try again.");
      console.error("Error loading course:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [courseId]);

  const handleEnroll = async () => {
    try {
      await progressService.create({
        courseId: courseId,
        completedLessons: [],
        quizScores: {},
        lastAccessed: new Date().toISOString(),
        overallProgress: 0
      });
      
      toast.success("Successfully enrolled in course!");
      navigate(`/courses/${courseId}/learn`);
    } catch (err) {
      toast.error("Failed to enroll in course. Please try again.");
      console.error("Error enrolling:", err);
    }
  };

  const handleContinue = () => {
    navigate(`/courses/${courseId}/learn`);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!course) return <Error message="Course not found" onRetry={loadData} />;

  const isEnrolled = userProgress !== null;
  const progress = userProgress?.overallProgress || 0;

  const difficultyColors = {
    beginner: "success",
    intermediate: "warning",
    advanced: "error"
  };

  const categoryColors = {
    "Web Development": "primary",
    "Data Science": "secondary",
    "Mobile Development": "accent",
    "Design": "gray"
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative p-8 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="accent" size="small">
                  {course.category}
                </Badge>
                <Badge variant="secondary" size="small">
                  {course.difficulty}
                </Badge>
              </div>
              
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-white/90 mb-6">{course.description}</p>
              
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <ApperIcon name="User" size={20} />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Clock" size={20} />
                  <span>{formatDuration(course.duration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="BookOpen" size={20} />
                  <span>{course.lessons.length} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Star" size={20} className="fill-current text-accent-400" />
                  <span>4.8 (1,234 reviews)</span>
                </div>
              </div>

              {isEnrolled && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Your Progress</span>
                    <span className="text-sm">{Math.round(progress)}% complete</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div 
                      className="bg-accent-400 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
              
              <Button
                onClick={isEnrolled ? handleContinue : handleEnroll}
                variant="accent"
                size="large"
                className="w-full sm:w-auto"
              >
                {isEnrolled ? "Continue Learning" : "Enroll Now"}
              </Button>
            </div>
            
            <div className="relative">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-full rounded-xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-black/20 rounded-xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <ApperIcon name="Play" size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Course Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Curriculum */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Curriculum</h2>
            
            <div className="space-y-4">
              {course.lessons.map((lesson, index) => {
                const isCompleted = userProgress?.completedLessons.includes(lesson.id);
                
                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      isCompleted 
                        ? "border-green-200 bg-green-50" 
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isCompleted 
                            ? "bg-green-500 text-white" 
                            : "bg-gray-200 text-gray-600"
                        }`}>
                          {isCompleted ? (
                            <ApperIcon name="Check" size={16} />
                          ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <ApperIcon name="Play" size={12} />
                              {formatDuration(lesson.duration)}
                            </span>
                            {lesson.quiz && (
                              <span className="flex items-center gap-1">
                                <ApperIcon name="FileText" size={12} />
                                Quiz
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {isEnrolled && (
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => navigate(`/courses/${courseId}/learn?lesson=${lesson.id}`)}
                        >
                          {isCompleted ? "Review" : "Start"}
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>

          {/* About Instructor */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Instructor</h2>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{course.instructor}</h3>
                <p className="text-gray-600 mt-2">
                  Expert instructor with years of experience in {course.category.toLowerCase()}. 
                  Passionate about teaching and helping students achieve their learning goals.
                </p>
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  <span>50+ Courses</span>
                  <span>10,000+ Students</span>
                  <span>4.9 Rating</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Information</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Difficulty</span>
                <Badge variant={difficultyColors[course.difficulty]}>
                  {course.difficulty}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{formatDuration(course.duration)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Lessons</span>
                <span className="font-medium">{course.lessons.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Students</span>
                <span className="font-medium">1,234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Rating</span>
                <div className="flex items-center gap-1">
                  <ApperIcon name="Star" size={16} className="fill-current text-accent-500" />
                  <span className="font-medium">4.8</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Skills You'll Learn */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills You'll Learn</h3>
            <div className="flex flex-wrap gap-2">
              {["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB"].map((skill) => (
                <Badge key={skill} variant="gray" size="small">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Certificate */}
          <Card className="p-6">
            <div className="text-center">
              <ApperIcon name="Award" size={48} className="text-accent-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Certified</h3>
              <p className="text-gray-600 text-sm">
                Earn a certificate upon successful completion of this course.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;