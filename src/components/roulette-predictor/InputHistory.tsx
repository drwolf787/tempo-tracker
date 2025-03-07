import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";

interface InputEvent {
  id: number;
  type: "video" | "audio" | "manual";
  data: string;
  timestamp: string;
  processed: boolean;
}

export default function InputHistory() {
  const [inputEvents, setInputEvents] = useState<InputEvent[]>([]);

  // Generate mock input events on mount
  useEffect(() => {
    const mockEvents: InputEvent[] = [
      {
        id: 1,
        type: "video",
        data: "Frame captured: wheel position 127°",
        timestamp: new Date(Date.now() - 5000).toLocaleTimeString(),
        processed: true,
      },
      {
        id: 2,
        type: "audio",
        data: "Audio pattern: dealer announcement",
        timestamp: new Date(Date.now() - 10000).toLocaleTimeString(),
        processed: true,
      },
      {
        id: 3,
        type: "video",
        data: "Ball detected: position 32",
        timestamp: new Date(Date.now() - 15000).toLocaleTimeString(),
        processed: true,
      },
      {
        id: 4,
        type: "manual",
        data: "User input: Red 14",
        timestamp: new Date(Date.now() - 30000).toLocaleTimeString(),
        processed: true,
      },
      {
        id: 5,
        type: "audio",
        data: "Audio pattern: ball movement",
        timestamp: new Date(Date.now() - 45000).toLocaleTimeString(),
        processed: true,
      },
    ];

    setInputEvents(mockEvents);

    // Simulate new input events coming in
    const interval = setInterval(() => {
      const types = ["video", "audio", "manual"] as const;
      const randomType = types[Math.floor(Math.random() * types.length)];

      let data = "";
      switch (randomType) {
        case "video":
          data =
            Math.random() > 0.5
              ? `Frame captured: wheel position ${Math.floor(Math.random() * 360)}°`
              : `Ball detected: position ${Math.floor(Math.random() * 37)}`;
          break;
        case "audio":
          data =
            Math.random() > 0.5
              ? "Audio pattern: dealer announcement"
              : "Audio pattern: ball movement";
          break;
        case "manual":
          const colors = ["Red", "Black", "Green"];
          const color = colors[Math.floor(Math.random() * colors.length)];
          const number = Math.floor(Math.random() * 37);
          data = `User input: ${color} ${number}`;
          break;
      }

      const newEvent: InputEvent = {
        id: Date.now(),
        type: randomType,
        data,
        timestamp: new Date().toLocaleTimeString(),
        processed: false,
      };

      setInputEvents((prev) => [newEvent, ...prev].slice(0, 100)); // Keep last 100 events

      // Mark as processed after a delay
      setTimeout(() => {
        setInputEvents((prev) =>
          prev.map((event) =>
            event.id === newEvent.id ? { ...event, processed: true } : event,
          ),
        );
      }, 2000);
    }, 5000); // New input every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const clearHistory = () => {
    setInputEvents([]);
  };

  const downloadHistory = () => {
    const data = JSON.stringify(inputEvents, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `roulette-input-history-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return "🎥";
      case "audio":
        return "🔊";
      case "manual":
        return "👤";
      default:
        return "📝";
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case "video":
        return "bg-blue-600 border-blue-700";
      case "audio":
        return "bg-purple-600 border-purple-700";
      case "manual":
        return "bg-orange-600 border-orange-700";
      default:
        return "bg-gray-600 border-gray-700";
    }
  };

  return (
    <Card className="bg-black/60 border-2 border-yellow-500/30">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-yellow-400 text-sm font-bold uppercase tracking-wider">
          Input History
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
            onClick={downloadHistory}
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-red-500/30 text-red-400 hover:bg-red-500/10"
            onClick={clearHistory}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px] w-full">
          <div className="p-4">
            {inputEvents.length === 0 ? (
              <div className="text-center py-8 text-yellow-400/50">
                No input events recorded yet
              </div>
            ) : (
              <div className="space-y-2">
                {inputEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`bg-black/40 p-3 rounded-lg border border-yellow-500/20 ${!event.processed ? "animate-pulse" : ""}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Badge
                        variant="outline"
                        className={`${getTypeBadgeClass(event.type)} text-white font-bold`}
                      >
                        {getTypeIcon(event.type)} {event.type.toUpperCase()}
                      </Badge>
                      <span className="text-yellow-400/70 text-xs font-medium">
                        {event.timestamp}
                      </span>
                    </div>
                    <div className="text-white text-sm">{event.data}</div>
                    <div className="text-right mt-1">
                      <Badge
                        variant="outline"
                        className={
                          event.processed
                            ? "bg-green-600 text-white border-green-700 font-bold"
                            : "bg-yellow-600 text-black border-yellow-700 font-bold"
                        }
                      >
                        {event.processed ? "Processed" : "Processing..."}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
