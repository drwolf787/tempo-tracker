import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { generatePrediction } from "@/lib/roulette-predictor";

interface SpinResult {
  number: number;
  color: "red" | "black" | "green";
  timestamp: string;
}

interface ResultItem extends SpinResult {
  id: number;
  predicted: boolean;
}

interface HistoricalResultsProps {
  results?: SpinResult[];
}

export default function HistoricalResults({
  results = [],
}: HistoricalResultsProps) {
  const [displayResults, setDisplayResults] = useState<ResultItem[]>([]);

  // Process results when they change
  useEffect(() => {
    if (results.length === 0) return;

    // Convert SpinResults to ResultItems with prediction status
    const processedResults = results.map((result, index) => {
      // Simulate if prediction was correct (random for demo)
      const predicted = Math.random() > 0.3; // 70% correct predictions

      return {
        ...result,
        id: index + 1,
        predicted,
      };
    });

    setDisplayResults(processedResults);
  }, [results]);

  // Simulate occasional new results coming in
  useEffect(() => {
    const interval = setInterval(() => {
      // 20% chance of adding a new result
      if (Math.random() < 0.2) {
        const number = Math.floor(Math.random() * 37);
        let color: "red" | "black" | "green";

        if (number === 0) {
          color = "green";
        } else if (
          [
            1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
          ].includes(number)
        ) {
          color = "red";
        } else {
          color = "black";
        }

        const newResult: ResultItem = {
          id: displayResults.length + 1,
          number,
          color,
          timestamp: new Date().toLocaleTimeString(),
          predicted: Math.random() > 0.3,
        };

        setDisplayResults((prev) => [newResult, ...prev.slice(0, 9)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [displayResults]);

  // If no results provided, use default mock data
  useEffect(() => {
    if (results.length === 0) {
      // Mock data for historical results
      const mockResults: ResultItem[] = [
        {
          id: 1,
          number: 32,
          color: "red",
          timestamp: "12:45:32",
          predicted: true,
        },
        {
          id: 2,
          number: 15,
          color: "black",
          timestamp: "12:44:18",
          predicted: true,
        },
        {
          id: 3,
          number: 19,
          color: "red",
          timestamp: "12:43:05",
          predicted: false,
        },
        {
          id: 4,
          number: 0,
          color: "green",
          timestamp: "12:41:52",
          predicted: false,
        },
        {
          id: 5,
          number: 4,
          color: "black",
          timestamp: "12:40:39",
          predicted: true,
        },
        {
          id: 6,
          number: 21,
          color: "red",
          timestamp: "12:39:26",
          predicted: true,
        },
        {
          id: 7,
          number: 2,
          color: "black",
          timestamp: "12:38:13",
          predicted: true,
        },
        {
          id: 8,
          number: 25,
          color: "red",
          timestamp: "12:37:00",
          predicted: false,
        },
        {
          id: 9,
          number: 17,
          color: "black",
          timestamp: "12:35:47",
          predicted: true,
        },
        {
          id: 10,
          number: 34,
          color: "red",
          timestamp: "12:34:34",
          predicted: true,
        },
      ];

      setDisplayResults(mockResults);
    }
  }, [results]);

  const getColorClass = (color: string) => {
    switch (color) {
      case "red":
        return "bg-red-600";
      case "black":
        return "bg-black border border-yellow-500/50";
      case "green":
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <Card className="bg-black/60 border-2 border-yellow-500/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-yellow-400 text-sm font-bold uppercase tracking-wider">
          Historical Results
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[180px] w-full">
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="text-yellow-400/80 text-xs border-b border-yellow-500/30">
                  <th className="pb-2 text-left font-bold">Number</th>
                  <th className="pb-2 text-left font-bold">Color</th>
                  <th className="pb-2 text-left font-bold">Time</th>
                  <th className="pb-2 text-right font-bold">Prediction</th>
                </tr>
              </thead>
              <tbody>
                {displayResults.map((result, index) => (
                  <tr
                    key={result.id}
                    className={`border-b border-yellow-500/10 text-sm hover:bg-black/40 ${index === 0 ? "animate-highlight" : ""}`}
                  >
                    <td className="py-2 text-white font-medium">
                      {result.number}
                    </td>
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded-full ${getColorClass(result.color)} shadow-sm`}
                        ></div>
                        <span className="text-white capitalize font-medium">
                          {result.color}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 text-yellow-400/70 font-medium">
                      {result.timestamp}
                    </td>
                    <td className="py-2 text-right">
                      {result.predicted ? (
                        <Badge className="bg-yellow-500 text-black border-yellow-600 font-bold">
                          Correct
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-red-400 border-red-700/50 font-bold"
                        >
                          Missed
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
