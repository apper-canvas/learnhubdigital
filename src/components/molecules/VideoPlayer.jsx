import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { downloadService } from "@/services/api/downloadService";

const VideoPlayer = ({ lesson, onProgress, onComplete, showNotesPanel, onToggleNotes, showTranscriptPanel, onToggleTranscript }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const videoRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onProgress?.(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onComplete?.();
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
    };
  }, [onProgress, onComplete]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleDownload = async () => {
    if (isDownloading || isDownloaded) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);
    
    try {
      toast.info("Download started...", { position: "bottom-right" });
      
      await downloadService.downloadVideo(lesson, (progress) => {
        setDownloadProgress(progress);
        if (progress % 25 === 0) {
          toast.info(`Download progress: ${progress}%`, { position: "bottom-right" });
        }
      });
      
      setIsDownloaded(true);
      toast.success("Video downloaded successfully!", { position: "bottom-right" });
    } catch (error) {
      toast.error("Download failed. Please try again.", { position: "bottom-right" });
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;
  return (
    <div className="relative bg-black rounded-xl overflow-hidden group">
      <video
        ref={videoRef}
        src={lesson.videoUrl}
        className="w-full aspect-video"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
      />

      {/* Play/Pause Button Overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: !isPlaying ? 1 : 0, scale: !isPlaying ? 1 : 0.8 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Button
          variant="primary"
          size="large"
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
        >
          <ApperIcon name={isPlaying ? "Pause" : "Play"} size={24} />
        </Button>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent"
      >
        {/* Progress Bar */}
        <div 
          ref={progressRef}
          className="w-full h-2 bg-white/20 rounded-full cursor-pointer mb-3"
          onClick={handleSeek}
        >
          <div 
            className="h-full bg-gradient-primary rounded-full"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="small"
              onClick={togglePlay}
              className="text-white hover:bg-white/20"
            >
              <ApperIcon name={isPlaying ? "Pause" : "Play"} size={20} />
            </Button>
            
            <div className="flex items-center gap-2">
              <ApperIcon name="Volume2" size={16} className="text-white" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
</div>
          
<div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="small"
              onClick={onToggleNotes}
              className={`text-white hover:bg-white/20 ${showNotesPanel ? 'bg-white/20' : ''}`}
            >
              <ApperIcon name="FileText" size={20} />
            </Button>
            
            <Button
              variant="ghost"
              size="small"
              onClick={onToggleTranscript}
              className={`text-white hover:bg-white/20 ${showTranscriptPanel ? 'bg-white/20' : ''}`}
            >
              <ApperIcon name="MessageSquare" size={20} />
            </Button>
            <Button
              variant="ghost"
              size="small"
              onClick={handleDownload}
              disabled={isDownloading}
              className={`text-white hover:bg-white/20 ${isDownloaded ? 'bg-green-500/20' : ''}`}
              title={isDownloaded ? "Downloaded" : isDownloading ? `Downloading ${downloadProgress}%` : "Download for offline viewing"}
            >
              {isDownloading ? (
                <div className="flex items-center gap-1">
                  <ApperIcon name="Loader" size={16} className="animate-spin" />
                  <span className="text-xs">{downloadProgress}%</span>
                </div>
              ) : (
                <ApperIcon name={isDownloaded ? "CheckCircle" : "Download"} size={20} />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="small"
              onClick={() => videoRef.current.requestFullscreen()}
              className="text-white hover:bg-white/20"
            >
              <ApperIcon name="Maximize" size={20} />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VideoPlayer;