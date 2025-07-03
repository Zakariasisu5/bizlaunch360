
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Download } from 'lucide-react';

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

  // Demo script for BizLaunch360
  const demoScript = `Welcome to BizLaunch360 - Your Complete Business Success Platform.

Are you ready to transform your business idea into reality? BizLaunch360 is the all-in-one platform that empowers entrepreneurs like you to launch, manage, and grow successful businesses.

AI-Powered Business Plans: Generate comprehensive business plans in minutes with our intelligent AI assistant.

Professional Invoicing: Create beautiful invoices and get paid faster with integrated Stripe payments.

Smart Appointment Booking: Let customers book your services 24/7 with our intuitive scheduling system.

Customer Management: Track every interaction and build stronger relationships with our built-in CRM.

Real-time Analytics: Monitor your revenue, expenses, and business growth from one beautiful dashboard.

Business Setup Assistant: Get help with registration, EIN applications, and staying compliant - all designed for US entrepreneurs.

With BizLaunch360, you're not just getting software - you're getting your business success partner. Join thousands of entrepreneurs who are already growing with our platform.

Ready to start your success story? Try BizLaunch360 free today.`;

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

  const copyScript = () => {
    navigator.clipboard.writeText(demoScript);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-5xl w-full bg-white">
        <DialogTitle className="sr-only">BizLaunch360 Platform Demo Video</DialogTitle>
        <DialogDescription className="sr-only">
          Watch a demonstration of how BizLaunch360 helps transform your business with our comprehensive platform features.
        </DialogDescription>
        
        <div className="space-y-6">
          {/* Video Section */}
          <div className="relative w-full aspect-video bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 rounded-xl overflow-hidden">
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
              {/* Business/startup demo videos */}
              <source src="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4" type="video/mp4" />
              <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Video Overlay Controls */}
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-between opacity-100 hover:opacity-100 transition-opacity">
              {/* Top overlay with title */}
              <div className="p-6">
                <h3 className="text-white text-2xl font-bold mb-2">BizLaunch360 Platform Demo</h3>
                <p className="text-white/90">Your Complete Business Success Platform</p>
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
                      className="flex-1 h-1 bg-white/20 rounded-full cursor-pointer slider-custom"
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

          {/* Demo Script Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">Demo Video Script</h4>
              <Button onClick={copyScript} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Copy Script
              </Button>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {demoScript}
              </p>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              💡 Tip: Use this script with AI tools like ElevenLabs, Synthesia, or D-ID to create your actual demo video with voiceover.
            </div>
          </div>
        </div>
        
        <style dangerouslySetInnerHTML={{
          __html: `
            .slider-custom::-webkit-slider-thumb {
              appearance: none;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: #3b82f6;
              cursor: pointer;
            }
            .slider-custom::-moz-range-thumb {
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: #3b82f6;
              cursor: pointer;
              border: none;
            }
          `
        }} />
      </DialogContent>
    </Dialog>
  );
};

export default VideoDemo;
