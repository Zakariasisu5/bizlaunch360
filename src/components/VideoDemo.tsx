
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
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
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full bg-white">
        <div className="relative w-full aspect-video bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 rounded-xl overflow-hidden">
          {/* Video Preview Image */}
          <img 
            src="/lovable-uploads/342ce04e-04df-45ac-9400-e8fd47701354.png" 
            alt="BizLaunch360 Dashboard Demo"
            className="w-full h-full object-cover"
          />
          
          {/* Video Overlay */}
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-between">
            {/* Top overlay with title */}
            <div className="p-6">
              <h3 className="text-white text-2xl font-bold mb-2">BizLaunch360 Demo</h3>
              <p className="text-white/90">See how our platform transforms your business</p>
            </div>

            {/* Center play button */}
            <div className="flex-1 flex items-center justify-center">
              <Button
                onClick={handlePlayPause}
                size="lg"
                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/50"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" />
                )}
              </Button>
            </div>

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
                    className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
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

          {/* Hidden audio element - Replace with your own audio file */}
          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
          >
            {/* Add your audio source here */}
            {/* <source src="/path-to-your-audio-file.mp3" type="audio/mpeg" /> */}
            <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+LyvmAaCEBdqOHotnwpBiq+2/LSeC0FKHzL8N2QQAoUXrPp66hVFApGnt/xwGEcBTti1/LKdSgFKHzL8N2QQAoUXrPp66hVFApGnt/xwGEcBTti1/LKdSgFKHzL8N2QQAoUXrPp66hVFApGnt/xwGEcBTti1/LKdSgFKHzL8N2QQAoUXrPp66hVFApGnt/xwGEcBTti1/LKdSgFKHzL8N2QQAoUXrPp66hVFApGnt/xwGEcBTti1/LKdSgFKHzL8N2QQAoUXrPp66hVFApGnt/xwGEcBTti1/LKdSgFKHzL8N2QQAoUXrPp66hVFApGnt/xwGEcBTti1/LKdSgFKHzL8N2QQAoUXrPp66hVFApGnt/xwGEcBTti1/LKdSgFKHzL8N2QQAoUXrPp66hVFApGnt/xwGEAAA==" type="audio/wav" />
          </audio>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoDemo;
