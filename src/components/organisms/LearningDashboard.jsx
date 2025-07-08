import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Progress from "@/components/atoms/Progress";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import CertificateModal from "@/components/molecules/CertificateModal";
import { courseService } from "@/services/api/courseService";
import { progressService } from "@/services/api/progressService";

const LearningDashboard = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
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
      setError("Failed to load dashboard data. Please try again.");
      console.error("Error loading dashboard:", err);
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
  const inProgressCourses = enrolledCourses.filter(course => course.progress.overallProgress > 0 && course.progress.overallProgress < 100);
  const totalLessonsCompleted = userProgress.reduce((total, progress) => total + progress.completedLessons.length, 0);

  const stats = [
    {
      title: "Courses Enrolled",
      value: enrolledCourses.length,
      icon: "BookOpen",
      color: "primary"
    },
    {
      title: "Courses Completed",
      value: completedCourses.length,
      icon: "Award",
      color: "success"
    },
    {
      title: "Lessons Completed",
      value: totalLessonsCompleted,
      icon: "CheckCircle",
      color: "accent"
    },
    {
      title: "Total Study Time",
      value: "47h 32m",
      icon: "Clock",
      color: "secondary"
    }
  ];

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Learning Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Track your progress and continue your learning journey
          </p>
        </div>
        
        <Button onClick={() => navigate("/courses")}>
          <ApperIcon name="Plus" size={16} />
          Browse More Courses
        </Button>
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

      {/* Continue Learning */}
      {inProgressCourses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Continue Learning</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {inProgressCourses.slice(0, 2).map((course) => (
                <div key={course.Id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{course.instructor}</p>
                    <Progress value={course.progress.overallProgress} showText={true} />
                  </div>
                  <Button
                    variant="primary"
                    size="small"
                    onClick={() => navigate(`/courses/${course.Id}/learn`)}
                  >
                    Continue
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Enrolled Courses */}
      {enrolledCourses.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">My Courses</h2>
              <Button variant="outline" onClick={() => navigate("/courses")}>
                View All Courses
              </Button>
            </div>
            
            <div className="space-y-4">
              {enrolledCourses.map((course) => (
                <div key={course.Id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
<div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{course.title}</h3>
                      {course.progress.overallProgress === 100 && (
                        <Badge variant="success" size="small">
                          Completed
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span>{course.instructor}</span>
                      <span>{formatDuration(course.duration)}</span>
                      <span>{course.lessons.length} lessons</span>
                      <span>Last accessed: {formatDate(course.progress.lastAccessed)}</span>
                    </div>
                    
                    <Progress value={course.progress.overallProgress} showText={true} />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="primary"
                      size="small"
                      onClick={() => navigate(`/courses/${course.Id}/learn`)}
                    >
                      {course.progress.overallProgress === 100 ? "Review" : "Continue"}
                    </Button>
                    <Button
                      variant="outline"
                      size="small"
                      onClick={() => navigate(`/courses/${course.Id}`)}
                    >
                      View Details
                    </Button>
                    {course.progress.overallProgress === 100 && course.progress.certificateId && (
                      <Button
                        variant="accent"
                        size="small"
                        onClick={() => {
                          setSelectedCertificate({ course, progress: course.progress });
                          setShowCertificateModal(true);
                        }}
                      >
                        <ApperIcon name="Award" size={14} />
                        View Certificate
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      ) : (
        <Empty
          title="No courses enrolled yet"
          description="Start your learning journey by enrolling in a course that interests you."
          actionLabel="Browse Courses"
onAction={() => navigate("/courses")}
        />
      )}

      {/* Certificate Modal */}
      {showCertificateModal && selectedCertificate && (
        <CertificateModal
          course={selectedCertificate.course}
          progress={selectedCertificate.progress}
          onClose={() => {
            setShowCertificateModal(false);
            setSelectedCertificate(null);
          }}
        />
      )}
    </div>
  );
};

export default LearningDashboard;