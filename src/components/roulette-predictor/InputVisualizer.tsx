import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InputVisualizerProps {
  activeInput?: "video" | "audio" | "both";
}

export default function InputVisualizer({
  activeInput = "both",
}: InputVisualizerProps) {
  const videoCanvasRef = useRef<HTMLCanvasElement>(null);
  const audioCanvasRef = useRef<HTMLCanvasElement>(null);
  const [activeTab, setActiveTab] = useState<string>("live");

  // Simulate video input visualization
  useEffect(() => {
    if (
      !videoCanvasRef.current ||
      (activeInput !== "video" && activeInput !== "both")
    )
      return;

    const canvas = videoCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 320;
    canvas.height = 180;

    let frameCount = 0;

    const drawFrame = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw simulated roulette wheel
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 20;

      // Draw outer rim
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.lineWidth = 5;
      ctx.strokeStyle = "#ffd700";
      ctx.stroke();

      // Draw inner circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 5, 0, Math.PI * 2);
      ctx.fillStyle = "#111";
      ctx.fill();

      // Draw pockets (simplified)
      const pocketCount = 37; // 0-36
      const sliceAngle = (Math.PI * 2) / pocketCount;

      // Apply rotation based on frame count
      const rotation = (frameCount * 0.01) % (Math.PI * 2);

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      for (let i = 0; i < pocketCount; i++) {
        const startAngle = i * sliceAngle;
        const endAngle = (i + 1) * sliceAngle;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius - 5, startAngle, endAngle);
        ctx.closePath();

        // Alternate colors
        if (i === 0) {
          ctx.fillStyle = "#00b300"; // Green for 0
        } else if (i % 2 === 0) {
          ctx.fillStyle = "#ff0000"; // Red
        } else {
          ctx.fillStyle = "#000000"; // Black
        }

        ctx.fill();
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore();

      // Draw ball
      const ballAngle = (frameCount * 0.03) % (Math.PI * 2);
      const ballDistance = radius - 15;
      const ballX = centerX + Math.cos(ballAngle) * ballDistance;
      const ballY = centerY + Math.sin(ballAngle) * ballDistance;

      ctx.beginPath();
      ctx.arc(ballX, ballY, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // Draw detection overlay
      if (frameCount % 30 < 15) {
        // Flash detection overlay
        ctx.strokeStyle = "rgba(0, 255, 0, 0.5)";
        ctx.lineWidth = 2;
        ctx.strokeRect(ballX - 10, ballY - 10, 20, 20);

        // Add text label
        ctx.fillStyle = "rgba(0, 255, 0, 0.8)";
        ctx.font = "10px Arial";
        ctx.fillText("BALL", ballX + 12, ballY);
      }

      // Draw frame counter and detection info
      ctx.fillStyle = "rgba(255, 215, 0, 0.8)";
      ctx.font = "12px Arial";
      ctx.fillText(`Frame: ${frameCount}`, 10, 20);
      ctx.fillText(
        `Wheel Position: ${Math.floor(rotation * (180 / Math.PI))}°`,
        10,
        40,
      );
      ctx.fillText(
        `Ball Position: ${Math.floor(ballAngle * (180 / Math.PI))}°`,
        10,
        60,
      );

      // Add timestamp
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = "10px Arial";
      ctx.fillText(
        new Date().toLocaleTimeString(),
        canvas.width - 70,
        canvas.height - 10,
      );

      // Increment frame counter
      frameCount++;
    };

    const interval = setInterval(drawFrame, 50); // 20 fps

    return () => clearInterval(interval);
  }, [activeInput]);

  // Simulate audio input visualization
  useEffect(() => {
    if (
      !audioCanvasRef.current ||
      (activeInput !== "audio" && activeInput !== "both")
    )
      return;

    const canvas = audioCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 320;
    canvas.height = 100;

    let frameCount = 0;

    const drawAudioWaveform = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      ctx.strokeStyle = "rgba(255, 215, 0, 0.2)";
      ctx.lineWidth = 1;

      // Horizontal grid lines
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Vertical grid lines
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw waveform
      const centerY = canvas.height / 2;
      const amplitude = 30;

      ctx.beginPath();
      ctx.moveTo(0, centerY);

      // Generate a complex waveform with multiple frequencies
      for (let x = 0; x < canvas.width; x++) {
        // Base frequency
        const y1 = Math.sin((x + frameCount) * 0.05) * amplitude * 0.5;

        // Add some higher frequencies with lower amplitudes
        const y2 = Math.sin((x + frameCount) * 0.1) * amplitude * 0.3;
        const y3 = Math.sin((x + frameCount) * 0.2) * amplitude * 0.2;

        // Add occasional "spikes" to simulate speech or events
        const spike = frameCount % 100 < 10 && x % 40 < 5 ? amplitude * 0.8 : 0;

        const y = centerY + y1 + y2 + y3 + spike;
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = "rgba(0, 255, 255, 0.8)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw detection markers
      if (frameCount % 120 < 30) {
        // Simulate detected audio event
        const eventX = canvas.width * 0.7;
        const eventWidth = 40;

        ctx.fillStyle = "rgba(255, 255, 0, 0.3)";
        ctx.fillRect(eventX - eventWidth / 2, 0, eventWidth, canvas.height);

        ctx.fillStyle = "rgba(255, 255, 0, 0.8)";
        ctx.font = "12px Arial";
        ctx.fillText("DETECTED", eventX - 30, 20);
      }

      // Draw audio level meter
      const level =
        0.5 + 0.3 * Math.sin(frameCount * 0.05) + 0.2 * Math.random();
      const meterWidth = 20;
      const meterHeight = canvas.height - 20;
      const meterX = canvas.width - meterWidth - 10;
      const meterY = 10;

      // Draw meter background
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(meterX, meterY, meterWidth, meterHeight);

      // Draw level
      const levelHeight = meterHeight * level;

      // Gradient for level
      const gradient = ctx.createLinearGradient(
        0,
        meterY + meterHeight,
        0,
        meterY,
      );
      gradient.addColorStop(0, "#00ff00");
      gradient.addColorStop(0.6, "#ffff00");
      gradient.addColorStop(1, "#ff0000");

      ctx.fillStyle = gradient;
      ctx.fillRect(
        meterX,
        meterY + meterHeight - levelHeight,
        meterWidth,
        levelHeight,
      );

      // Draw meter border
      ctx.strokeStyle = "rgba(255, 215, 0, 0.5)";
      ctx.lineWidth = 1;
      ctx.strokeRect(meterX, meterY, meterWidth, meterHeight);

      // Add timestamp
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = "10px Arial";
      ctx.fillText(new Date().toLocaleTimeString(), 10, canvas.height - 10);

      // Increment frame counter
      frameCount++;
    };

    const interval = setInterval(drawAudioWaveform, 50); // 20 fps

    return () => clearInterval(interval);
  }, [activeInput]);

  return (
    <Card className="bg-black/60 border-2 border-yellow-500/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-yellow-400 text-sm font-bold uppercase tracking-wider">
          Input Visualizer
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 bg-black border border-yellow-500/30 p-1 rounded-lg mx-4 mt-4">
            <TabsTrigger
              value="live"
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black font-bold text-yellow-400"
            >
              Live Input
            </TabsTrigger>
            <TabsTrigger
              value="analysis"
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black font-bold text-yellow-400"
            >
              Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="p-4 space-y-4">
            <div className="space-y-4">
              {(activeInput === "video" || activeInput === "both") && (
                <div>
                  <div className="text-yellow-400 text-xs font-bold mb-2 uppercase">
                    Video Input
                  </div>
                  <div className="relative border-2 border-yellow-500/30 rounded-md overflow-hidden">
                    <canvas
                      ref={videoCanvasRef}
                      width="320"
                      height="180"
                      className="w-full"
                    />
                    <div className="absolute top-2 right-2 bg-red-600 w-3 h-3 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-2 left-2 bg-black/70 text-yellow-400 text-xs px-2 py-1 rounded">
                      LIVE CAPTURE
                    </div>
                  </div>
                </div>
              )}

              {(activeInput === "audio" || activeInput === "both") && (
                <div>
                  <div className="text-yellow-400 text-xs font-bold mb-2 uppercase">
                    Audio Input
                  </div>
                  <div className="relative border-2 border-yellow-500/30 rounded-md overflow-hidden">
                    <canvas
                      ref={audioCanvasRef}
                      width="320"
                      height="100"
                      className="w-full"
                    />
                    <div className="absolute top-2 right-2 bg-blue-600 w-3 h-3 rounded-full animate-pulse"></div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="p-4">
            <div className="space-y-4">
              <div className="bg-black/40 p-3 rounded-lg border border-yellow-500/20">
                <h3 className="text-yellow-400 font-bold text-sm mb-2">
                  INPUT ANALYSIS
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Video Frame Rate</span>
                    <span className="text-yellow-400 font-bold">20 fps</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Audio Sample Rate</span>
                    <span className="text-yellow-400 font-bold">44.1 kHz</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Detection Accuracy</span>
                    <span className="text-yellow-400 font-bold">92%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Processing Latency</span>
                    <span className="text-yellow-400 font-bold">48ms</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 p-3 rounded-lg border border-yellow-500/20">
                <h3 className="text-yellow-400 font-bold text-sm mb-2">
                  DETECTION STATISTICS
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Wheel Detections</span>
                    <span className="text-yellow-400 font-bold">1,243</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Ball Detections</span>
                    <span className="text-yellow-400 font-bold">856</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Audio Events</span>
                    <span className="text-yellow-400 font-bold">327</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white">False Positives</span>
                    <span className="text-yellow-400 font-bold">12</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
