import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Empty = ({ 
  title = "No data found", 
  description = "There's nothing here yet.", 
  actionLabel = "Get Started",
  onAction,
  icon = "BookOpen"
}) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full"
      >
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name={icon} size={32} className="text-white" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {title}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {description}
          </p>
          
          {onAction && (
            <Button onClick={onAction} variant="primary" size="large">
              <ApperIcon name="Plus" size={16} />
              {actionLabel}
            </Button>
          )}
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <ApperIcon name="BookOpen" size={14} />
                <span>1000+ Courses</span>
              </div>
              <div className="flex items-center gap-1">
                <ApperIcon name="Users" size={14} />
                <span>Expert Instructors</span>
              </div>
              <div className="flex items-center gap-1">
                <ApperIcon name="Award" size={14} />
                <span>Certificates</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Empty;