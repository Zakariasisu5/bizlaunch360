
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoDemoProps {
  trigger: React.ReactNode;
}

const VideoDemo: React.FC<VideoDemoProps> = ({ trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full bg-white">
        <DialogTitle className="sr-only">BizLaunch360 Platform Demo Video</DialogTitle>
        <DialogDescription className="sr-only">
          Watch a demonstration of how BizLaunch360 helps transform your business with our comprehensive platform features.
        </DialogDescription>
        
        <div className="relative w-full aspect-video bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 rounded-xl overflow-hidden">
          {/* Video Element */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            poster="/lovable-uploads/342ce04e-04df-45ac-9400-e8fd47701354.png"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleVideoEnd}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            {/* Placeholder video - replace with your actual video file */}
            <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
            <source src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Video Overlay Controls */}
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-between opacity-100 hover:opacity-100 transition-opacity">
            {/* Top overlay with title */}
            <div className="p-6">
              <h3 className="text-white text-2xl font-bold mb-2">BizLaunch360 Demo</h3>
              <p className="text-white/90">See how our platform transforms your business</p>
            </div>

            {/* Center play button - only show when paused */}
            {!isPlaying && (
              <div className="flex-1 flex items-center justify-center">
                <Button
                  onClick={handlePlayPause}
                  size="lg"
                  className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/50"
                >
                  <Play className="w-8 h-8 text-white ml-1" />
                </Button>
              </div>
            )}

            {/* Bottom controls */}
            <div className="p-6 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handlePlayPause}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>

                <Button
                  onClick={handleMuteToggle}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </Button>

                <div className="flex-1 flex items-center space-x-2">
                  <span className="text-white text-sm font-mono">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) 100%)`
                    }}
                  />
                  <span className="text-white text-sm font-mono">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
          }
          .slider::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: none;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};

export default VideoDemo;
