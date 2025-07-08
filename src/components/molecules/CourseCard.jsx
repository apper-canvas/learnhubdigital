import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import Progress from "@/components/atoms/Progress";
const CourseCard = ({ course, userProgress, isBookmarked, onBookmarkToggle }) => {
  const navigate = useNavigate();
  
  const progress = userProgress?.overallProgress || 0;
  const isEnrolled = userProgress !== undefined;

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

  const handleCardClick = () => {
    navigate(`/courses/${course.Id}`);
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

  const handleBookmarkClick = async (e) => {
    e.stopPropagation();
    try {
      await onBookmarkToggle(course.Id);
      toast.success(
        isBookmarked ? "Course removed from wishlist" : "Course added to wishlist"
      );
    } catch (err) {
      toast.error("Failed to update wishlist");
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden cursor-pointer group" onClick={handleCardClick}>
        <div className="relative">
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
/>
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={handleBookmarkClick}
              className={`p-2 rounded-full transition-all duration-200 ${
                isBookmarked 
                  ? "bg-red-500 text-white hover:bg-red-600" 
                  : "bg-white/80 text-gray-600 hover:bg-white hover:text-red-500"
              }`}
              title={isBookmarked ? "Remove from wishlist" : "Add to wishlist"}
            >
              <ApperIcon 
                name="Heart" 
                size={16} 
                className={isBookmarked ? "fill-current" : ""} 
              />
            </button>
            <Badge variant={difficultyColors[course.difficulty]} size="small">
              {course.difficulty}
            </Badge>
          </div>
          <div className="absolute top-4 left-4">
            <Badge variant={categoryColors[course.category] || "gray"} size="small">
              {course.category}
            </Badge>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {course.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {course.description}
          </p>
          
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <ApperIcon name="User" size={14} />
              <span>{course.instructor}</span>
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="Clock" size={14} />
              <span>{formatDuration(course.duration)}</span>
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="BookOpen" size={14} />
              <span>{course.lessons.length} lessons</span>
            </div>
          </div>

          {isEnrolled && (
            <div className="mb-4">
              <Progress value={progress} showText={true} />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-accent-600">
              <ApperIcon name="Star" size={16} className="fill-current" />
              <span className="text-sm font-medium">4.8</span>
              <span className="text-sm text-gray-500">(1,234)</span>
            </div>
            
            <Button 
              variant={isEnrolled ? "secondary" : "primary"} 
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                if (isEnrolled) {
                  navigate(`/courses/${course.Id}/learn`);
                } else {
                  navigate(`/courses/${course.Id}`);
                }
              }}
            >
              {isEnrolled ? "Continue" : "View Course"}
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CourseCard;