import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SpinResult {
  number: number;
  color: "red" | "black" | "green";
  timestamp: string;
}

interface PatternHeatmapProps {
  results?: SpinResult[];
}

export default function PatternHeatmap({ results = [] }: PatternHeatmapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Add real-time updates to heatmap
  useEffect(() => {
    // Redraw heatmap periodically to simulate analysis activity
    const updateInterval = setInterval(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Randomly highlight a cell to simulate activity
      const randomRow = Math.floor(Math.random() * 3);
      const randomCol = Math.floor(Math.random() * 12);
      const x = randomCol * (canvas.width / 12);
      const y = randomRow * (canvas.height / 3);
      const cellWidth = canvas.width / 12;
      const cellHeight = canvas.height / 3;

      // Flash highlight
      ctx.fillStyle = "rgba(255, 215, 0, 0.4)";
      ctx.fillRect(x, y, cellWidth, cellHeight);

      // Fade back after a moment
      setTimeout(() => {
        drawHeatmap();
      }, 300);
    }, 2000);

    return () => clearInterval(updateInterval);
  }, []);

  // Draw the heatmap
  const drawHeatmap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 260;
    canvas.height = 180;

    // Draw heatmap grid
    const cellWidth = canvas.width / 12;
    const cellHeight = canvas.height / 3;

    // Define the roulette board layout
    const board = [
      [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
      [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
      [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
    ];

    // Generate heat values based on results or random if no results
    const heatValues: Record<number, number> = {};

    if (results.length > 0) {
      // Initialize all numbers with a base heat value
      for (let i = 0; i <= 36; i++) {
        heatValues[i] = 0.1; // Base value
      }

      // Count occurrences of each number in results
      const numberCounts: Record<number, number> = {};
      results.forEach((result) => {
        numberCounts[result.number] = (numberCounts[result.number] || 0) + 1;
      });

      // Calculate max count for normalization
      const maxCount = Math.max(...Object.values(numberCounts), 1);

      // Convert counts to heat values (normalized)
      Object.entries(numberCounts).forEach(([number, count]) => {
        heatValues[parseInt(number)] = 0.3 + (count / maxCount) * 0.7;
      });
    } else {
      // Generate random heat values if no results
      for (let i = 0; i <= 36; i++) {
        heatValues[i] = Math.random();
      }
    }

    // Draw background
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw cells
    board.forEach((row, rowIndex) => {
      row.forEach((number, colIndex) => {
        const x = colIndex * cellWidth;
        const y = rowIndex * cellHeight;

        // Get heat value for this number
        const heat = heatValues[number];

        // Determine color based on heat (yellow gradient)
        const intensity = Math.floor(heat * 255);
        const color = `rgba(${intensity}, ${Math.floor(intensity * 0.8)}, 0, ${0.3 + heat * 0.7})`;

        // Draw cell
        ctx.fillStyle = color;
        ctx.fillRect(x, y, cellWidth, cellHeight);

        // Draw border
        ctx.strokeStyle = "rgba(255, 215, 0, 0.2)"; // Gold borders
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellWidth, cellHeight);

        // Draw number
        ctx.fillStyle = "white";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(number.toString(), x + cellWidth / 2, y + cellHeight / 2);
      });
    });

    // Draw zero separately
    const zeroHeat = heatValues[0];
    const greenIntensity = Math.floor(zeroHeat * 179) + 50; // Ensure some green is visible
    ctx.fillStyle = `rgba(0, ${greenIntensity}, 0, ${0.5 + zeroHeat * 0.5})`; // Dynamic green based on heat
    ctx.fillRect(0, 0, cellWidth / 3, cellHeight * 3);
    ctx.strokeStyle = "rgba(255, 215, 0, 0.3)"; // Gold border
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, cellWidth / 3, cellHeight * 3);
    ctx.fillStyle = "white";
    ctx.font = "bold 12px Arial";
    ctx.fillText("0", cellWidth / 6, canvas.height / 2);

    // Add hotspot indicators for the highest values
    const topNumbers = Object.entries(heatValues)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((entry) => parseInt(entry[0]));

    board.forEach((row, rowIndex) => {
      row.forEach((number, colIndex) => {
        if (topNumbers.includes(number)) {
          const x = colIndex * cellWidth + cellWidth / 2;
          const y = rowIndex * cellHeight + cellHeight / 2;

          // Draw pulsing circle around hot numbers
          ctx.beginPath();
          ctx.arc(x, y, cellWidth / 3, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255, 215, 0, 0.7)";
          ctx.lineWidth = 2;
          ctx.stroke();

          // Add second circle
          ctx.beginPath();
          ctx.arc(x, y, cellWidth / 4, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(255, 215, 0, 0.4)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    });

    // Check if zero is a hot number
    if (topNumbers.includes(0)) {
      const x = cellWidth / 6;
      const y = canvas.height / 2;

      ctx.beginPath();
      ctx.arc(x, y, cellWidth / 4, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 215, 0, 0.7)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  // Initialize the heatmap on component mount
  useEffect(() => {
    drawHeatmap();
  }, [results]);

  return (
    <Card className="bg-black/60 border-2 border-yellow-500/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-yellow-400 text-sm font-bold uppercase tracking-wider">
          Pattern Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-auto rounded-md border-2 border-yellow-500/20 shadow-md"
          />
          <div className="absolute bottom-2 right-2 bg-black/80 text-yellow-400 text-xs px-2 py-1 rounded border border-yellow-500/30 font-medium">
            Frequency Analysis
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
