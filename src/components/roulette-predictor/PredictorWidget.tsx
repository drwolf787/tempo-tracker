import { useState, useEffect, useCallback, useRef } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  ChevronUp,
  ChevronDown,
  Settings,
  Bell,
  BarChart3,
  Play,
  Volume2,
  Power,
  Database,
  Camera,
  Brain,
} from "lucide-react";
import PredictionDisplay from "./PredictionDisplay";
import RouletteWheel from "./RouletteWheel";
import HistoricalResults from "./HistoricalResults";
import PatternHeatmap from "./PatternHeatmap";
import SettingsPanel from "./SettingsPanel";
import SpinSimulator from "./SpinSimulator";
import StrategyBuilder from "./StrategyBuilder";
import DataCapture from "./DataCapture";
import ExtendedAnalytics from "./ExtendedAnalytics";
import {
  generatePrediction,
  getSpinHistory,
  getColorFromNumber,
  loadLastPrediction,
} from "@/lib/roulette-predictor";
import { saveSettings, loadSettings, StoredSettings } from "@/lib/storage";

export default function PredictorWidget() {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [currentPrediction, setCurrentPrediction] = useState("Red 32");
  const [confidenceScore, setConfidenceScore] = useState(87);
  const [trendDirection, setTrendDirection] = useState<
    "up" | "down" | "stable"
  >("up");
  const [trackingEnabled, setTrackingEnabled] = useState(true);
  const [version] = useState("v1.3.7");
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResults, setSpinResults] = useState(getSpinHistory());
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [audioAlertsEnabled, setAudioAlertsEnabled] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(
    new Date().toLocaleTimeString(),
  );

  // Track if settings have been loaded from storage
  const settingsLoaded = useRef(false);

  // Generate a new prediction
  const updatePrediction = useCallback(() => {
    if (!trackingEnabled) return;

    const prediction = generatePrediction();
    setCurrentPrediction(
      `${prediction.color.charAt(0).toUpperCase() + prediction.color.slice(1)} ${prediction.number}`,
    );
    setConfidenceScore(prediction.confidence);
    setTrendDirection(prediction.trending);
    setLastUpdated(prediction.timestamp);

    // Show notification for high confidence predictions
    if (notificationsEnabled && prediction.confidence > 80) {
      toast({
        title: "High Confidence Prediction",
        description: `${prediction.color.toUpperCase()} ${prediction.number} (${prediction.confidence}% confidence)`,
        variant: "default",
        className: "bg-black border-2 border-yellow-500/50 text-yellow-400",
      });

      // Play sound if enabled
      if (audioAlertsEnabled) {
        const audio = new Audio(
          "https://assets.mixkit.co/sfx/preview/mixkit-casino-notification-1-1101.mp3",
        );
        audio.volume = 0.5;
        audio.play().catch((e) => console.log("Audio play failed:", e));
      }
    }
  }, [trackingEnabled, notificationsEnabled, audioAlertsEnabled, toast]);

  // Handle spin completion
  const handleSpinComplete = useCallback(
    (number: number) => {
      // Update results list
      setSpinResults(getSpinHistory());

      // Generate new prediction after spin
      setTimeout(() => {
        updatePrediction();

        // Show result notification
        toast({
          title: "Spin Result",
          description: `${getColorFromNumber(number).toUpperCase()} ${number}`,
          variant: "default",
          className: `${getColorFromNumber(number) === "red" ? "bg-red-600" : getColorFromNumber(number) === "black" ? "bg-black" : "bg-green-600"} border-2 border-yellow-500/50 text-white`,
        });
      }, 1000);
    },
    [updatePrediction, toast],
  );

  // Toggle power button
  const togglePower = () => {
    const newTrackingState = !trackingEnabled;
    setTrackingEnabled(newTrackingState);

    // Save settings to storage
    saveSettings({
      trackingEnabled: newTrackingState,
      notificationsEnabled,
      audioAlertsEnabled,
      activeTab,
      visualSensitivity: 75, // Default values for other settings
      audioSensitivity: 60,
      processingPower: 50,
      confidenceThreshold: 65,
      notificationLevel: "medium",
    });

    toast({
      title: trackingEnabled ? "Tracking Disabled" : "Tracking Enabled",
      description: trackingEnabled
        ? "AI prediction system is now offline"
        : "AI prediction system is now online",
      variant: "default",
      className: trackingEnabled
        ? "bg-black border-2 border-red-500/50 text-red-400"
        : "bg-black border-2 border-green-500/50 text-green-400",
    });
  };

  // Load settings from storage on mount
  useEffect(() => {
    if (!settingsLoaded.current) {
      const storedSettings = loadSettings();
      if (storedSettings) {
        setTrackingEnabled(storedSettings.trackingEnabled);
        setNotificationsEnabled(storedSettings.notificationsEnabled);
        setAudioAlertsEnabled(storedSettings.audioAlertsEnabled);
        setActiveTab(storedSettings.activeTab || "dashboard");
      }

      // Load last prediction if available
      const lastPrediction = loadLastPrediction();
      if (lastPrediction) {
        setCurrentPrediction(
          `${lastPrediction.color.charAt(0).toUpperCase() + lastPrediction.color.slice(1)} ${lastPrediction.number}`,
        );
        setConfidenceScore(lastPrediction.confidence);
        setTrendDirection(lastPrediction.trending);
        setLastUpdated(lastPrediction.timestamp);
      } else {
        // If no stored prediction, generate a new one
        updatePrediction();
      }

      settingsLoaded.current = true;
    }
  }, [updatePrediction]);

  // Periodic prediction updates
  useEffect(() => {
    if (!trackingEnabled) return;

    const interval = setInterval(() => {
      updatePrediction();
    }, 5000); // Update every 5 seconds for more visible activity

    return () => clearInterval(interval);
  }, [trackingEnabled, updatePrediction]);

  // Simulate data capture activity
  useEffect(() => {
    if (!trackingEnabled) return;

    // Simulate video frame capture
    const frameInterval = setInterval(() => {
      // Update UI to show active capture
      const captureElement = document.getElementById("capture-indicator");
      if (captureElement) {
        captureElement.classList.add("bg-green-500");
        setTimeout(() => {
          captureElement.classList.remove("bg-green-500");
        }, 200);
      }
    }, 800);

    // Simulate audio capture
    const audioInterval = setInterval(() => {
      // Update UI to show active audio capture
      const audioElement = document.getElementById("audio-indicator");
      if (audioElement) {
        audioElement.classList.add("bg-blue-500");
        setTimeout(() => {
          audioElement.classList.remove("bg-blue-500");
        }, 300);
      }
    }, 1200);

    return () => {
      clearInterval(frameInterval);
      clearInterval(audioInterval);
    };
  }, [trackingEnabled]);

  return (
    <div
      className="fixed bottom-4 right-4 z-50 w-auto"
      style={{ maxWidth: "90vw", maxHeight: "90vh", overflow: "auto" }}
    >
      <Collapsible
        open={isExpanded}
        onOpenChange={setIsExpanded}
        className="bg-black/90 backdrop-blur-md border-2 border-yellow-500/50 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out"
      >
        <CollapsibleTrigger asChild>
          <div className="relative">
            <div className="absolute -top-10 left-0 right-0 text-center">
              <div className="inline-block bg-indigo-900/90 px-6 py-1.5 rounded-t-lg border-2 border-b-0 border-yellow-500/50 text-yellow-400 font-bold tracking-wider text-sm shadow-lg">
                SMART ROULETTE TRACKER
              </div>
            </div>
            <div className="flex items-center justify-between p-3 cursor-pointer bg-gradient-to-r from-black to-black/90 hover:from-black hover:to-black/80 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-full ${trackingEnabled ? "bg-gradient-to-br from-green-500 to-green-700 animate-pulse" : "bg-gradient-to-br from-red-500 to-red-700"} flex items-center justify-center border-2 border-white/20 shadow-lg`}
                  >
                    <div className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center">
                      <div
                        className={`w-4 h-4 rounded-full ${trackingEnabled ? "bg-green-500" : "bg-red-500"}`}
                      ></div>
                    </div>
                  </div>
                  {trackingEnabled && (
                    <>
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></span>
                      <span
                        id="capture-indicator"
                        className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-500/50 rounded-full transition-colors duration-200"
                      ></span>
                      <span
                        id="audio-indicator"
                        className="absolute -bottom-1 -right-1 w-2 h-2 bg-yellow-500/50 rounded-full transition-colors duration-200"
                      ></span>
                    </>
                  )}
                </div>
                <div>
                  <h3 className="text-yellow-400 font-bold text-sm tracking-wider">
                    SMART TRACKER {trackingEnabled ? "(ONLINE)" : "(OFFLINE)"}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`${currentPrediction.toLowerCase().includes("red") ? "bg-red-600 border-red-700" : currentPrediction.toLowerCase().includes("black") ? "bg-black border-gray-700" : "bg-green-600 border-green-700"} text-white text-xs font-bold`}
                    >
                      {currentPrediction}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-yellow-400 font-bold">
                        {confidenceScore}%
                      </span>
                      <Progress
                        value={confidenceScore}
                        className="w-16 h-1.5 bg-black border border-yellow-500/30"
                        indicatorClassName="bg-yellow-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={togglePower}
                  className={`rounded-full bg-black border ${trackingEnabled ? "border-yellow-500/50 text-yellow-400 hover:text-yellow-300" : "border-red-500/50 text-red-400 hover:text-red-300"} hover:bg-black/80 hover:border-yellow-400`}
                >
                  <Power className="w-4 h-4" />
                </Button>
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-yellow-400" />
                ) : (
                  <ChevronUp className="w-5 h-5 text-yellow-400" />
                )}
              </div>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="p-4 border-t-2 border-yellow-500/30">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full max-w-[600px]"
          >
            <TabsList className="grid grid-cols-4 mb-4 bg-black border border-yellow-500/30 p-1 rounded-lg">
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black font-bold text-yellow-400"
                onClick={() => {
                  const newTab = "dashboard";
                  setActiveTab(newTab);
                  saveSettings({
                    ...(loadSettings() || {
                      visualSensitivity: 75,
                      audioSensitivity: 60,
                      processingPower: 50,
                      confidenceThreshold: 65,
                      notificationLevel: "medium",
                    }),
                    trackingEnabled,
                    notificationsEnabled,
                    audioAlertsEnabled,
                    activeTab: newTab,
                  });
                }}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black font-bold text-yellow-400"
                onClick={() => {
                  const newTab = "settings";
                  setActiveTab(newTab);
                  saveSettings({
                    ...(loadSettings() || {
                      visualSensitivity: 75,
                      audioSensitivity: 60,
                      processingPower: 50,
                      confidenceThreshold: 65,
                      notificationLevel: "medium",
                    }),
                    trackingEnabled,
                    notificationsEnabled,
                    audioAlertsEnabled,
                    activeTab: newTab,
                  });
                }}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
              <TabsTrigger
                value="strategy"
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black font-bold text-yellow-400"
                onClick={() => {
                  const newTab = "strategy";
                  setActiveTab(newTab);
                  saveSettings({
                    ...(loadSettings() || {
                      visualSensitivity: 75,
                      audioSensitivity: 60,
                      processingPower: 50,
                      confidenceThreshold: 65,
                      notificationLevel: "medium",
                    }),
                    trackingEnabled,
                    notificationsEnabled,
                    audioAlertsEnabled,
                    activeTab: newTab,
                  });
                }}
              >
                <Brain className="w-4 h-4 mr-2" />
                Strategy
              </TabsTrigger>
              <TabsTrigger
                value="capture"
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black font-bold text-yellow-400"
                onClick={() => {
                  const newTab = "capture";
                  setActiveTab(newTab);
                  saveSettings({
                    ...(loadSettings() || {
                      visualSensitivity: 75,
                      audioSensitivity: 60,
                      processingPower: 50,
                      confidenceThreshold: 65,
                      notificationLevel: "medium",
                    }),
                    trackingEnabled,
                    notificationsEnabled,
                    audioAlertsEnabled,
                    activeTab: newTab,
                  });
                }}
              >
                <Camera className="w-4 h-4 mr-2" />
                Capture
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <PredictionDisplay
                    prediction={currentPrediction}
                    confidence={confidenceScore}
                    trending={trendDirection}
                    lastUpdated={lastUpdated}
                  />
                  <RouletteWheel isSpinning={isSpinning} />
                </div>
                <div className="space-y-4">
                  <HistoricalResults results={spinResults} />
                  <PatternHeatmap results={spinResults} />
                  <ExtendedAnalytics />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <SettingsPanel
                trackingEnabled={trackingEnabled}
                onTrackingToggle={() => {
                  const newValue = !trackingEnabled;
                  setTrackingEnabled(newValue);

                  // Save to storage
                  const currentSettings = loadSettings() || {
                    visualSensitivity: 75,
                    audioSensitivity: 60,
                    processingPower: 50,
                    confidenceThreshold: 65,
                    notificationLevel: "medium",
                    activeTab: "tracking",
                    notificationsEnabled,
                    audioAlertsEnabled,
                  };

                  saveSettings({
                    ...currentSettings,
                    trackingEnabled: newValue,
                  });
                }}
                notificationsEnabled={notificationsEnabled}
                onNotificationsToggle={() => {
                  const newValue = !notificationsEnabled;
                  setNotificationsEnabled(newValue);

                  // Save to storage
                  const currentSettings = loadSettings() || {
                    visualSensitivity: 75,
                    audioSensitivity: 60,
                    processingPower: 50,
                    confidenceThreshold: 65,
                    notificationLevel: "medium",
                    activeTab: "notifications",
                    trackingEnabled,
                    audioAlertsEnabled,
                  };

                  saveSettings({
                    ...currentSettings,
                    notificationsEnabled: newValue,
                  });
                }}
                audioAlertsEnabled={audioAlertsEnabled}
                onAudioAlertsToggle={() => {
                  const newValue = !audioAlertsEnabled;
                  setAudioAlertsEnabled(newValue);

                  // Save to storage
                  const currentSettings = loadSettings() || {
                    visualSensitivity: 75,
                    audioSensitivity: 60,
                    processingPower: 50,
                    confidenceThreshold: 65,
                    notificationLevel: "medium",
                    activeTab: "notifications",
                    trackingEnabled,
                    notificationsEnabled,
                  };

                  saveSettings({
                    ...currentSettings,
                    audioAlertsEnabled: newValue,
                  });
                }}
              />
            </TabsContent>

            <TabsContent value="strategy" className="space-y-4">
              <StrategyBuilder />
            </TabsContent>

            <TabsContent value="capture" className="space-y-4">
              <DataCapture />
            </TabsContent>
          </Tabs>

          <div className="flex justify-between items-center mt-4 text-xs text-yellow-400/60">
            <div>Smart Roulette Tracker {version}</div>
            <div className="flex gap-2">
              <a href="#" className="hover:text-yellow-400">
                Privacy Policy
              </a>
              <span>|</span>
              <a href="#" className="hover:text-yellow-400">
                Help
              </a>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
