import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full"
      >
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="AlertCircle" size={32} className="text-red-600" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          
          <p className="text-gray-600 mb-6">
            {message}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && (
              <Button onClick={onRetry} variant="primary">
                <ApperIcon name="RefreshCw" size={16} />
                Try Again
              </Button>
            )}
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline"
            >
              <ApperIcon name="RotateCcw" size={16} />
              Refresh Page
            </Button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              If the problem persists, please contact support.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Error;