import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowUp, ArrowDown, TrendingUp, Minus } from "lucide-react";
import { useState, useEffect } from "react";

interface PredictionDisplayProps {
  prediction: string;
  confidence: number;
  trending?: "up" | "down" | "stable";
  lastUpdated?: string;
}

export default function PredictionDisplay({
  prediction = "Red 32",
  confidence = 87,
  trending = "up",
  lastUpdated = new Date().toLocaleTimeString(),
}: PredictionDisplayProps) {
  // Add real-time clock update
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString(),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  // Determine if prediction is red or black
  const isRed = prediction.toLowerCase().includes("red");
  const isBlack = prediction.toLowerCase().includes("black");
  const isGreen = !isRed && !isBlack;

  // Get pattern strength based on confidence
  const getPatternStrength = () => {
    if (confidence > 85) return "Very High";
    if (confidence > 75) return "High";
    if (confidence > 65) return "Medium";
    return "Low";
  };

  return (
    <div className="bg-black/60 border-2 border-yellow-500/30 rounded-lg p-4 backdrop-blur-sm">
      <h3 className="text-yellow-400 text-sm font-bold mb-2 uppercase tracking-wider">
        Current Prediction
      </h3>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center ${isRed ? "bg-red-600" : isBlack ? "bg-black border-2 border-yellow-500/50" : "bg-green-600"} shadow-lg ${trending === "up" ? "animate-pulse-slow" : ""}`}
          >
            <span className="text-white font-bold text-xl">
              {prediction.split(" ")[1] || "?"}
            </span>
          </div>

          <div>
            <h2 className="text-white font-bold text-2xl">{prediction}</h2>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`${isRed ? "bg-red-600 border-red-700" : isBlack ? "bg-black border-yellow-500/50" : "bg-green-600 border-green-700"} text-white font-bold`}
              >
                {isRed ? "RED" : isBlack ? "BLACK" : "GREEN"}
              </Badge>
              {trending === "up" ? (
                <Badge
                  variant="outline"
                  className="bg-green-600 border-green-700 text-white font-bold"
                >
                  <ArrowUp className="w-3 h-3 mr-1" /> Trending Up
                </Badge>
              ) : trending === "down" ? (
                <Badge
                  variant="outline"
                  className="bg-red-600 border-red-700 text-white font-bold"
                >
                  <ArrowDown className="w-3 h-3 mr-1" /> Trending Down
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-yellow-600 border-yellow-700 text-white font-bold"
                >
                  <Minus className="w-3 h-3 mr-1" /> Stable
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="text-right bg-black/40 p-3 rounded-lg border border-yellow-500/30">
          <div
            className={`text-yellow-400 font-bold text-3xl ${trending === "up" ? "animate-bounce-subtle" : ""}`}
          >
            {confidence}%
          </div>
          <div className="text-yellow-400/70 text-sm font-medium">
            Confidence
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-yellow-400/80 font-medium">
            Confidence Score
          </span>
          <span className="text-yellow-400 font-bold">{confidence}%</span>
        </div>
        <Progress
          value={confidence}
          className="h-3 bg-black border border-yellow-500/30"
          indicatorClassName={`${confidence > 80 ? "bg-yellow-500" : confidence > 50 ? "bg-yellow-600" : "bg-red-500"}`}
        />

        <div className="flex items-center justify-between mt-4 bg-black/40 p-2 rounded border border-yellow-500/20">
          <div className="flex items-center gap-1 text-yellow-400/80 text-xs font-medium">
            <TrendingUp className="w-3 h-3 text-yellow-400" />
            <span>Pattern strength: {getPatternStrength()}</span>
          </div>
          <div className="text-yellow-400/80 text-xs font-medium flex justify-between">
            <span>Updated {lastUpdated}</span>
            <span className="text-yellow-400/90 font-bold">{currentTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
