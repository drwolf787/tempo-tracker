import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Camera,
  Volume2,
  Database,
  RefreshCw,
  Laptop,
  Zap,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function DataCapture() {
  const [screenCaptureEnabled, setScreenCaptureEnabled] = useState(true);
  const [audioCaptureEnabled, setAudioCaptureEnabled] = useState(true);
  const [databaseEnabled, setDatabaseEnabled] = useState(true);
  const [screenCaptureStatus, setScreenCaptureStatus] = useState("active"); // active, inactive, error
  const [audioCaptureStatus, setAudioCaptureStatus] = useState("active");
  const [databaseStatus, setDatabaseStatus] = useState("active");
  const [capturedFrames, setCapturedFrames] = useState(1243);
  const [capturedAudio, setCapturedAudio] = useState(856);
  const [processingLoad, setProcessingLoad] = useState(42);

  // Simulate real-time data capture
  useEffect(() => {
    if (!screenCaptureEnabled && !audioCaptureEnabled) return;

    const interval = setInterval(() => {
      if (screenCaptureEnabled) {
        setCapturedFrames((prev) => prev + 1);
      }

      if (audioCaptureEnabled) {
        setCapturedAudio((prev) => prev + Math.floor(Math.random() * 2) + 1);
      }

      // Randomly fluctuate processing load
      setProcessingLoad((prev) => {
        const newValue =
          prev + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3);
        return Math.min(Math.max(newValue, 30), 70); // Keep between 30-70%
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [screenCaptureEnabled, audioCaptureEnabled]);

  const toggleScreenCapture = () => {
    setScreenCaptureEnabled(!screenCaptureEnabled);
    setScreenCaptureStatus(screenCaptureEnabled ? "inactive" : "active");
  };

  const toggleAudioCapture = () => {
    setAudioCaptureEnabled(!audioCaptureEnabled);
    setAudioCaptureStatus(audioCaptureEnabled ? "inactive" : "active");
  };

  const toggleDatabase = () => {
    setDatabaseEnabled(!databaseEnabled);
    setDatabaseStatus(databaseEnabled ? "inactive" : "active");
  };

  const resetCaptureSystems = () => {
    // Simulate resetting capture systems
    setScreenCaptureStatus("active");
    setAudioCaptureStatus("active");
    setDatabaseStatus("active");
    setScreenCaptureEnabled(true);
    setAudioCaptureEnabled(true);
    setDatabaseEnabled(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-500";
      case "inactive":
        return "text-yellow-500";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "inactive":
        return <XCircle className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-black/60 border-2 border-yellow-500/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-yellow-400 text-sm font-bold uppercase tracking-wider">
          Data Capture Systems
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-yellow-500/20">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-yellow-400" />
              <Label className="text-yellow-400 font-bold flex items-center gap-2">
                SCREEN CAPTURE
                {getStatusIcon(screenCaptureStatus)}
              </Label>
            </div>
            <p className="text-yellow-400/60 text-xs font-medium">
              Captures and analyzes roulette wheel visually
            </p>
          </div>
          <Switch
            checked={screenCaptureEnabled}
            onCheckedChange={toggleScreenCapture}
            className="data-[state=checked]:bg-yellow-500"
          />
        </div>

        <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-yellow-500/20">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-yellow-400" />
              <Label className="text-yellow-400 font-bold flex items-center gap-2">
                AUDIO CAPTURE
                {getStatusIcon(audioCaptureStatus)}
              </Label>
            </div>
            <p className="text-yellow-400/60 text-xs font-medium">
              Detects ball movement and dealer announcements
            </p>
          </div>
          <Switch
            checked={audioCaptureEnabled}
            onCheckedChange={toggleAudioCapture}
            className="data-[state=checked]:bg-yellow-500"
          />
        </div>

        <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-yellow-500/20">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-yellow-400" />
              <Label className="text-yellow-400 font-bold flex items-center gap-2">
                DATABASE STORAGE
                {getStatusIcon(databaseStatus)}
              </Label>
            </div>
            <p className="text-yellow-400/60 text-xs font-medium">
              Stores historical data for pattern analysis
            </p>
          </div>
          <Switch
            checked={databaseEnabled}
            onCheckedChange={toggleDatabase}
            className="data-[state=checked]:bg-yellow-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-black/40 p-3 rounded-lg border border-yellow-500/20 text-center">
            <div className="text-yellow-400 font-bold text-2xl">
              {capturedFrames}
            </div>
            <div className="text-yellow-400/70 text-xs font-medium">
              Frames Captured
            </div>
          </div>

          <div className="bg-black/40 p-3 rounded-lg border border-yellow-500/20 text-center">
            <div className="text-yellow-400 font-bold text-2xl">
              {capturedAudio}
            </div>
            <div className="text-yellow-400/70 text-xs font-medium">
              Audio Samples
            </div>
          </div>

          <div className="bg-black/40 p-3 rounded-lg border border-yellow-500/20 text-center">
            <div className="text-yellow-400 font-bold text-2xl">
              {processingLoad}%
            </div>
            <div className="text-yellow-400/70 text-xs font-medium">
              Processing Load
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-yellow-400/80 font-medium">
              System Performance
            </span>
            <span className="text-yellow-400 font-bold">{processingLoad}%</span>
          </div>
          <Progress
            value={processingLoad}
            className="h-3 bg-black border border-yellow-500/30"
            indicatorClassName={`${processingLoad > 80 ? "bg-red-500" : processingLoad > 50 ? "bg-yellow-500" : "bg-green-500"}`}
          />
        </div>

        <Button
          onClick={resetCaptureSystems}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold mt-4"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          RESET CAPTURE SYSTEMS
        </Button>
      </CardContent>
    </Card>
  );
}
