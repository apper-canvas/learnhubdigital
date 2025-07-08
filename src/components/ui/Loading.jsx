import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";

const Loading = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded-lg w-64 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded-lg w-96"></div>
      </div>

      {/* Filters Skeleton */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="h-10 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </Card>

      {/* Course Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <div className="animate-pulse">
                {/* Image Skeleton */}
                <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse"></div>
                
                {/* Content Skeleton */}
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded-lg mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Loading;