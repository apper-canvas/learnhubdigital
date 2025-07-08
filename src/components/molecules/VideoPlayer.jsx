import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import { downloadService } from "@/services/api/downloadService";

const VideoPlayer = ({ lesson, onProgress, onComplete, showNotesPanel, onToggleNotes, showTranscriptPanel, onToggleTranscript }) => {
  const videoRef = useRef(null)
  const progressRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [showControls, setShowControls] = useState(false)
  const [videoLoading, setVideoLoading] = useState(false)
  const [videoError, setVideoError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  
  // Validate lesson data
  useEffect(() => {
    if (!lesson) {
      setVideoError('GENERIC')
      return
    }
    
    if (!lesson.videoUrl) {
      setVideoError('NOT_FOUND')
      return
    }
    
    // Reset error state when lesson changes
    setVideoError(null)
    setRetryCount(0)
}, [lesson])
  
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDownloaded, setIsDownloaded] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const handleVideoError = (e) => {
    const video = e.target
    const error = video.error
    
    setVideoLoading(false)
    
    if (!error) {
      setVideoError('GENERIC')
      return
    }
    
    // Map HTML5 video error codes to user-friendly messages
    switch (error.code) {
      case error.MEDIA_ERR_ABORTED:
        setVideoError('GENERIC')
        break
      case error.MEDIA_ERR_NETWORK:
        setVideoError('NETWORK_ERROR')
        break
      case error.MEDIA_ERR_DECODE:
        setVideoError('FORMAT_ERROR')
        break
      case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
        setVideoError('FORMAT_ERROR')
        break
      default:
        setVideoError('GENERIC')
    }
    
    console.error('Video error:', error.message || 'Unknown video error')
  }

  const handleRetryVideo = () => {
    if (retryCount >= 3) {
      toast.error('Unable to load video after multiple attempts. Please try again later.')
      return
    }
    
    setRetryCount(prev => prev + 1)
    setVideoError(null)
    setVideoLoading(true)
    
    const video = videoRef.current
    if (video) {
      // Force reload of video element
      video.load()
    }
  }

  const handleVideoKeyboard = (e) => {
    if (!videoRef.current) return
    
    switch (e.key) {
      case ' ':
      case 'k':
        e.preventDefault()
        togglePlay()
        break
      case 'ArrowLeft':
        e.preventDefault()
        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10)
        break
      case 'ArrowRight':
        e.preventDefault()
        videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10)
        break
      case 'ArrowUp':
        e.preventDefault()
        setVolume(prev => Math.min(1, prev + 0.1))
        break
      case 'ArrowDown':
        e.preventDefault()
        setVolume(prev => Math.max(0, prev - 0.1))
        break
      case 'm':
        e.preventDefault()
        setVolume(prev => prev === 0 ? 1 : 0)
        break
    }
  }

  const handleTimeUpdate = () => {
    const video = videoRef.current
    if (video && !videoError) {
      setCurrentTime(video.currentTime)
      onProgress?.(video.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    const video = videoRef.current
    if (video && !videoError) {
      setDuration(video.duration)
      setVideoLoading(false)
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
    onComplete?.()
    };

const togglePlay = async () => {
    const video = videoRef.current
    if (video && !videoError) {
      try {
        if (isPlaying) {
          video.pause()
          setIsPlaying(false)
        } else {
          await video.play()
          setIsPlaying(true)
        }
      } catch (error) {
        console.error('Error playing video:', error)
        if (error.name === 'NotAllowedError') {
          toast.error('Video autoplay blocked. Please click the play button.')
        } else if (error.name === 'NotSupportedError') {
          setVideoError('FORMAT_ERROR')
        } else {
          toast.error('Unable to play video. Please try again.')
        }
      }
    }
  }
const handleSeek = (e) => {
    const video = videoRef.current
    const progressBar = progressRef.current
    if (video && progressBar && !videoError && duration > 0) {
      const rect = progressBar.getBoundingClientRect()
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      const newTime = percent * video.duration
      video.currentTime = newTime
      setCurrentTime(newTime)
    }
  }

const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    const video = videoRef.current;
    if (video) {
      video.volume = newVolume;
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = async () => {
    if (!lesson?.videoUrl) {
      toast.error('Video URL not available for download')
      return
try {
      setIsDownloading(true)
      setDownloadProgress(0)
      
      // Simulate download progress
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)
      
      await downloadService.downloadVideo(lesson.id, lesson.videoUrl)
      
      clearInterval(progressInterval)
      setDownloadProgress(100)
      setIsDownloaded(true)
      toast.success('Video downloaded successfully!')
    } catch (error) {
      toast.error('Failed to download video')
      console.error('Download error:', error)
    } finally {
      setIsDownloading(false)
      setDownloadProgress(0)
    }
  }

  // Update video volume when state changes
  useEffect(() => {
    const video = videoRef.current
    if (video && !videoError) {
      video.volume = volume
    }
  }, [volume, videoError])

  // Prevent rendering if no lesson data
  if (!lesson) {
    return (
      <div className="relative bg-black rounded-xl overflow-hidden aspect-video flex items-center justify-center">
        <div className="text-center text-white p-6">
          <ApperIcon name="AlertCircle" size={32} className="mx-auto mb-4 text-red-400" />
          <h3 className="text-lg font-semibold mb-2">No Lesson Data</h3>
          <p className="text-sm text-gray-300">Unable to load lesson information.</p>
        </div>
      </div>
)
  }

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;
  
  return (
<div className="relative bg-black rounded-xl overflow-hidden group">
      {/* Video Loading State */}
      {videoLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm">Loading video...</p>
          </div>
        </div>
      )}
      
      {/* Video Error State */}
      {videoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-center text-white p-6">
            <ApperIcon name="AlertCircle" size={32} className="mx-auto mb-4 text-red-400" />
            <h3 className="text-lg font-semibold mb-2">Video Unavailable</h3>
            <p className="text-sm text-gray-300 mb-4">
              {videoError === 'NETWORK_ERROR' && 'Network connection issue. Please check your internet connection.'}
              {videoError === 'FORMAT_ERROR' && 'This video format is not supported by your browser.'}
              {videoError === 'CORS_ERROR' && 'Unable to load video due to security restrictions.'}
              {videoError === 'NOT_FOUND' && 'Video file not found or has been moved.'}
              {videoError === 'GENERIC' && 'An error occurred while loading the video.'}
            </p>
            <Button
              variant="outline"
              size="small"
              onClick={handleRetryVideo}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ApperIcon name="RotateCcw" size={16} />
              Retry
            </Button>
          </div>
        </div>
      )}
      
      {/* Video Element */}
      <video
        ref={videoRef}
onLoadStart={() => setVideoLoading(true)}
        onLoadedData={() => {
          setVideoLoading(false);
          setVideoError(null);
        }}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={handleVideoError}
        onCanPlay={() => setVideoLoading(false)}
        preload="metadata"
        playsInline
        aria-label={`Video lesson: ${lesson?.title || 'Course video'}`}
        role="application"
        tabIndex={0}
        onKeyDown={handleVideoKeyboard}
        aria-label={`Video lesson: ${lesson?.title || 'Course video'}`}
        role="application"
        tabIndex={0}
        onKeyDown={handleVideoKeyboard}
        style={{ display: videoError ? 'none' : 'block' }}
      >
        <track kind="captions" srcLang="en" label="English" default />
        <p className="text-white text-center p-4">
          Your browser does not support the video tag. Please try a different browser or 
          <a href={lesson?.videoUrl} className="text-blue-400 underline ml-1" target="_blank" rel="noopener noreferrer">
            download the video directly
          </a>.
        </p>
      </video>
      
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
              onClick={() => {
                const video = videoRef.current;
                if (video && video.requestFullscreen) {
                  video.requestFullscreen();
                }
              }}
              className="text-white hover:bg-white/20"
            >
              <ApperIcon name="Maximize" size={20} />
              <ApperIcon name="Maximize" size={20} />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VideoPlayer;