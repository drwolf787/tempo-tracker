import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { addSpinResult, getColorFromNumber } from "@/lib/roulette-predictor";

interface SpinSimulatorProps {
  onSpinComplete: (number: number) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
}

export default function SpinSimulator({
  onSpinComplete,
  isSpinning,
  setIsSpinning,
}: SpinSimulatorProps) {
  const [spinResult, setSpinResult] = useState<number | null>(null);
  const [spinAnimation, setSpinAnimation] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Handle spin button click
  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setSpinAnimation(true);
    setCountdown(5);

    // Clear previous result
    setSpinResult(null);
  };

  // Handle manual number selection
  const handleNumberSelect = (color: "red" | "black" | "green") => {
    if (isSpinning) return;

    let number: number;
    if (color === "red") {
      // Random red number
      const redNumbers = [
        1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
      ];
      number = redNumbers[Math.floor(Math.random() * redNumbers.length)];
    } else if (color === "black") {
      // Random black number
      const blackNumbers = [
        2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35,
      ];
      number = blackNumbers[Math.floor(Math.random() * blackNumbers.length)];
    } else {
      // Green (zero)
      number = 0;
    }

    setIsSpinning(true);
    setSpinAnimation(true);
    setCountdown(5);

    // Pre-determine the result but don't show it yet
    setSpinResult(number);
  };

  // Countdown effect
  useEffect(() => {
    if (!isSpinning) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && spinAnimation) {
      // Spin complete
      setSpinAnimation(false);

      // If no pre-selected result, generate a random one
      const finalResult =
        spinResult !== null ? spinResult : Math.floor(Math.random() * 37);
      setSpinResult(finalResult);

      // Add to history
      addSpinResult(finalResult);

      // Notify parent
      onSpinComplete(finalResult);

      // Reset after showing result
      const resetTimer = setTimeout(() => {
        setIsSpinning(false);
      }, 3000);

      return () => clearTimeout(resetTimer);
    }
  }, [
    countdown,
    isSpinning,
    spinAnimation,
    spinResult,
    onSpinComplete,
    setIsSpinning,
  ]);

  return (
    <div className="bg-black/60 border-2 border-yellow-500/30 rounded-lg p-6 text-center">
      {!isSpinning ? (
        <>
          <div className="flex justify-center mb-6">
            <Button
              onClick={handleSpin}
              className="w-20 h-20 rounded-full bg-black border-4 border-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-500/20 hover:bg-black/80 hover:border-yellow-400"
            >
              <div className="w-10 h-10 text-yellow-500 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-full h-full"
                >
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </div>
            </Button>
          </div>
          <h3 className="text-yellow-400 font-bold text-xl mb-2">
            START TRACKING
          </h3>
          <p className="text-white/70 mb-4">
            Click to begin analyzing the roulette wheel
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            <Button
              onClick={() => handleNumberSelect("red")}
              className="bg-red-600 hover:bg-red-700 text-white border-2 border-red-700 rounded-lg font-bold"
            >
              RED
            </Button>
            <Button
              onClick={() => handleNumberSelect("black")}
              className="bg-black hover:bg-gray-900 text-white border-2 border-gray-700 rounded-lg font-bold"
            >
              BLACK
            </Button>
            <Button
              onClick={() => handleNumberSelect("green")}
              className="bg-green-600 hover:bg-green-700 text-white border-2 border-green-700 rounded-lg font-bold"
            >
              ZERO
            </Button>
          </div>
        </>
      ) : (
        <div className="py-8">
          {spinAnimation ? (
            <div className="space-y-6">
              <div className="relative w-32 h-32 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin"></div>
                <div className="absolute inset-2 rounded-full border-4 border-yellow-400/50 border-b-transparent animate-spin animation-delay-150"></div>
                <div className="absolute inset-4 rounded-full border-4 border-yellow-300/30 border-l-transparent animate-spin animation-delay-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-yellow-400 font-bold text-3xl">
                    {countdown}
                  </span>
                </div>
              </div>
              <h3 className="text-yellow-400 font-bold text-xl animate-pulse">
                ANALYZING SPIN...
              </h3>
            </div>
          ) : spinResult !== null ? (
            <div className="space-y-6">
              <div className="relative w-32 h-32 mx-auto">
                <div
                  className={`w-32 h-32 rounded-full flex items-center justify-center ${getColorFromNumber(spinResult) === "red" ? "bg-red-600" : getColorFromNumber(spinResult) === "black" ? "bg-black border-2 border-white/20" : "bg-green-600"} shadow-lg animate-bounce-once`}
                >
                  <span className="text-white font-bold text-4xl">
                    {spinResult}
                  </span>
                </div>
              </div>
              <h3 className="text-yellow-400 font-bold text-xl">
                RESULT: {getColorFromNumber(spinResult).toUpperCase()}{" "}
                {spinResult}
              </h3>
              <p className="text-white/70">Updating prediction model...</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
