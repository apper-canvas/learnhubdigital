import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import { certificateService } from "@/services/api/certificateService";

const CertificateModal = ({ course, progress, onClose }) => {
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCertificate();
  }, [course.Id]);

  const loadCertificate = async () => {
    try {
      setLoading(true);
      setError("");
      const certificateData = await certificateService.getCertificate(course.Id.toString());
      setCertificate(certificateData);
    } catch (err) {
      setError("Failed to load certificate. Please try again.");
      console.error("Error loading certificate:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await certificateService.downloadCertificate(course.Id.toString());
      toast.success("Certificate downloaded successfully!");
    } catch (err) {
      toast.error("Failed to download certificate. Please try again.");
      console.error("Error downloading certificate:", err);
    } finally {
      setDownloading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <ApperIcon name="Award" size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Certificate of Completion</h2>
              <p className="text-sm text-gray-600">{course.title}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="small"
            onClick={onClose}
            className="!p-2"
          >
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loading />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="AlertCircle" size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Certificate</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={loadCertificate} variant="outline">
                Try Again
              </Button>
            </div>
          ) : certificate ? (
            <div className="space-y-6">
              {/* Certificate Preview */}
              <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-primary-200">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <ApperIcon name="Award" size={28} className="text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900">Certificate of Completion</h3>
                  <p className="text-gray-600">This is to certify that</p>
                  
                  <div className="py-4">
                    <h4 className="text-3xl font-bold text-gradient mb-2">{certificate.studentName}</h4>
                    <p className="text-gray-600">has successfully completed the course</p>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="text-xl font-semibold text-gray-900">{certificate.course.title}</h5>
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <ApperIcon name="User" size={14} />
                        {certificate.course.instructor}
                      </span>
                      <span className="flex items-center gap-1">
                        <ApperIcon name="Clock" size={14} />
                        {formatDuration(certificate.course.duration)}
                      </span>
                      <span className="flex items-center gap-1">
                        <ApperIcon name="BookOpen" size={14} />
                        {certificate.course.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Completed: {formatDate(certificate.completedDate)}</span>
                      <span>Final Score: {certificate.overallScore}%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Certificate ID: {certificate.certificateId}</p>
                  </div>
                </div>
              </Card>

              {/* Course Details */}
              <Card className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Course Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Course Title</p>
                    <p className="font-medium text-gray-900">{certificate.course.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Instructor</p>
                    <p className="font-medium text-gray-900">{certificate.course.instructor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Category</p>
                    <p className="font-medium text-gray-900">{certificate.course.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Duration</p>
                    <p className="font-medium text-gray-900">{formatDuration(certificate.course.duration)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Completion Date</p>
                    <p className="font-medium text-gray-900">{formatDate(certificate.completedDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Final Score</p>
                    <p className="font-medium text-gray-900">{certificate.overallScore}%</p>
                  </div>
                </div>
              </Card>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="sm:w-auto w-full"
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={handleDownload}
                  disabled={downloading}
                  className="sm:w-auto w-full"
                >
                  {downloading ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Download" size={16} />
                      Download Certificate
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CertificateModal;