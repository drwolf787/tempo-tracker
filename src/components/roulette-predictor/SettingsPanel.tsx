import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Camera,
  Volume2,
  Cpu,
  Bell,
  Brain,
  Shield,
  Eye,
  Save,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { loadSettings, saveSettings } from "@/lib/storage";

interface SettingsPanelProps {
  trackingEnabled: boolean;
  onTrackingToggle: () => void;
  notificationsEnabled?: boolean;
  onNotificationsToggle?: () => void;
  audioAlertsEnabled?: boolean;
  onAudioAlertsToggle?: () => void;
}

export default function SettingsPanel({
  trackingEnabled = true,
  onTrackingToggle = () => {},
  notificationsEnabled = true,
  onNotificationsToggle = () => {},
  audioAlertsEnabled = true,
  onAudioAlertsToggle = () => {},
}: SettingsPanelProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("tracking");
  const [visualSensitivity, setVisualSensitivity] = useState(75);
  const [audioSensitivity, setAudioSensitivity] = useState(60);
  const [processingPower, setProcessingPower] = useState(50);
  const [notificationLevel, setNotificationLevel] = useState("medium");
  const [confidenceThreshold, setConfidenceThreshold] = useState(65);

  // Load settings from storage on mount
  useEffect(() => {
    const storedSettings = loadSettings();
    if (storedSettings) {
      setVisualSensitivity(storedSettings.visualSensitivity || 75);
      setAudioSensitivity(storedSettings.audioSensitivity || 60);
      setProcessingPower(storedSettings.processingPower || 50);
      setNotificationLevel(storedSettings.notificationLevel || "medium");
      setConfidenceThreshold(storedSettings.confidenceThreshold || 65);
    }
  }, []);

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 bg-black border border-yellow-500/30 p-1 rounded-lg">
          <TabsTrigger
            value="tracking"
            className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black font-bold text-yellow-400"
          >
            <Eye className="w-4 h-4 mr-2" />
            Tracking
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black font-bold text-yellow-400"
          >
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="advanced"
            className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black font-bold text-yellow-400"
          >
            <Brain className="w-4 h-4 mr-2" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracking" className="space-y-4 mt-4">
          <Card className="bg-black/60 border-2 border-yellow-500/30">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-yellow-500/20">
                  <div className="space-y-0.5">
                    <Label className="text-yellow-400 font-bold">
                      ENABLE TRACKING
                    </Label>
                    <p className="text-yellow-400/60 text-xs font-medium">
                      Capture and analyze screen data
                    </p>
                  </div>
                  <Switch
                    checked={trackingEnabled}
                    onCheckedChange={onTrackingToggle}
                    className="data-[state=checked]:bg-yellow-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-yellow-400" />
                      <Label className="text-yellow-400 font-bold">
                        VISUAL SENSITIVITY
                      </Label>
                    </div>
                    <span className="text-yellow-400 text-sm font-bold">
                      {visualSensitivity}%
                    </span>
                  </div>
                  <Slider
                    value={[visualSensitivity]}
                    onValueChange={(value) => setVisualSensitivity(value[0])}
                    max={100}
                    step={1}
                    className="[&>span]:bg-yellow-500"
                  />
                  <p className="text-yellow-400/60 text-xs font-medium">
                    Higher values improve accuracy but may increase CPU usage
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-yellow-400" />
                      <Label className="text-yellow-400 font-bold">
                        AUDIO SENSITIVITY
                      </Label>
                    </div>
                    <span className="text-yellow-400 text-sm font-bold">
                      {audioSensitivity}%
                    </span>
                  </div>
                  <Slider
                    value={[audioSensitivity]}
                    onValueChange={(value) => setAudioSensitivity(value[0])}
                    max={100}
                    step={1}
                    className="[&>span]:bg-yellow-500"
                  />
                  <p className="text-yellow-400/60 text-xs font-medium">
                    Adjust sensitivity for audio pattern recognition
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-yellow-400 font-bold">
                    TRACKING MODE
                  </Label>
                  <Select defaultValue="auto">
                    <SelectTrigger className="bg-black/60 border-yellow-500/30 text-yellow-400 font-medium">
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-yellow-500/30 text-yellow-400">
                      <SelectItem value="auto">
                        Automatic (AI-driven)
                      </SelectItem>
                      <SelectItem value="manual">Manual Control</SelectItem>
                      <SelectItem value="hybrid">Hybrid Mode</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold mt-4"
                  onClick={() => {
                    // Save tracking settings to storage
                    const currentSettings = loadSettings() || {
                      trackingEnabled: true,
                      notificationsEnabled: true,
                      audioAlertsEnabled: true,
                      activeTab: "tracking",
                      confidenceThreshold: 65,
                      notificationLevel: "medium",
                      processingPower: 50,
                    };

                    saveSettings({
                      ...currentSettings,
                      visualSensitivity,
                      audioSensitivity,
                      trackingEnabled: trackingEnabled,
                    });

                    toast({
                      title: "Settings Saved",
                      description: "Your tracking settings have been saved",
                      className:
                        "bg-black border-2 border-green-500/50 text-green-400",
                    });
                  }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  SAVE TRACKING SETTINGS
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-4">
          <Card className="bg-black/60 border-2 border-yellow-500/30">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-yellow-500/20">
                  <div className="space-y-0.5">
                    <Label className="text-yellow-400 font-bold">
                      VISUAL NOTIFICATIONS
                    </Label>
                    <p className="text-yellow-400/60 text-xs font-medium">
                      Show badges and alerts
                    </p>
                  </div>
                  <Switch
                    defaultChecked
                    className="data-[state=checked]:bg-yellow-500"
                  />
                </div>

                <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-yellow-500/20">
                  <div className="space-y-0.5">
                    <Label className="text-yellow-400 font-bold">
                      AUDIO ALERTS
                    </Label>
                    <p className="text-yellow-400/60 text-xs font-medium">
                      Play sound on high-confidence predictions
                    </p>
                  </div>
                  <Switch
                    defaultChecked
                    className="data-[state=checked]:bg-yellow-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-yellow-400 font-bold">
                    NOTIFICATION LEVEL
                  </Label>
                  <Select
                    value={notificationLevel}
                    onValueChange={setNotificationLevel}
                  >
                    <SelectTrigger className="bg-black/60 border-yellow-500/30 text-yellow-400 font-medium">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-yellow-500/30 text-yellow-400">
                      <SelectItem value="low">
                        Low (Only High Confidence)
                      </SelectItem>
                      <SelectItem value="medium">Medium (Balanced)</SelectItem>
                      <SelectItem value="high">
                        High (All Predictions)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-yellow-400 font-bold">
                      CONFIDENCE THRESHOLD
                    </Label>
                    <span className="text-yellow-400 text-sm font-bold">
                      {confidenceThreshold}%
                    </span>
                  </div>
                  <Slider
                    value={[confidenceThreshold]}
                    onValueChange={(value) => setConfidenceThreshold(value[0])}
                    max={100}
                    step={5}
                    className="[&>span]:bg-yellow-500"
                  />
                  <p className="text-yellow-400/60 text-xs font-medium">
                    Only notify when confidence exceeds this threshold
                  </p>
                </div>

                <Button
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold mt-4"
                  onClick={() => {
                    // Save notification settings to storage
                    const currentSettings = loadSettings() || {
                      trackingEnabled: true,
                      notificationsEnabled: true,
                      audioAlertsEnabled: true,
                      activeTab: "notifications",
                      visualSensitivity: 75,
                      audioSensitivity: 60,
                      processingPower: 50,
                    };

                    saveSettings({
                      ...currentSettings,
                      notificationsEnabled,
                      audioAlertsEnabled,
                      notificationLevel,
                      confidenceThreshold,
                    });

                    toast({
                      title: "Settings Saved",
                      description: "Your notification settings have been saved",
                      className:
                        "bg-black border-2 border-green-500/50 text-green-400",
                    });
                  }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  SAVE NOTIFICATION SETTINGS
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4 mt-4">
          <Card className="bg-black/60 border-2 border-yellow-500/30">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-yellow-400" />
                      <Label className="text-yellow-400 font-bold">
                        PROCESSING POWER
                      </Label>
                    </div>
                    <span className="text-yellow-400 text-sm font-bold">
                      {processingPower}%
                    </span>
                  </div>
                  <Slider
                    value={[processingPower]}
                    onValueChange={(value) => setProcessingPower(value[0])}
                    max={100}
                    step={10}
                    className="[&>span]:bg-yellow-500"
                  />
                  <p className="text-yellow-400/60 text-xs font-medium">
                    Allocate CPU resources for prediction algorithms
                  </p>
                </div>

                <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-yellow-500/20">
                  <div className="space-y-0.5">
                    <Label className="text-yellow-400 font-bold">
                      EDGE PROCESSING
                    </Label>
                    <p className="text-yellow-400/60 text-xs font-medium">
                      Process data locally for lower latency
                    </p>
                  </div>
                  <Switch
                    defaultChecked
                    className="data-[state=checked]:bg-yellow-500"
                  />
                </div>

                <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-yellow-500/20">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-yellow-400" />
                      <Label className="text-yellow-400 font-bold">
                        ENHANCED SECURITY
                      </Label>
                    </div>
                    <p className="text-yellow-400/60 text-xs font-medium">
                      Encrypt all tracking data
                    </p>
                  </div>
                  <Switch
                    defaultChecked
                    className="data-[state=checked]:bg-yellow-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-yellow-400 font-bold">AI MODEL</Label>
                  <Select defaultValue="advanced">
                    <SelectTrigger className="bg-black/60 border-yellow-500/30 text-yellow-400 font-medium">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-yellow-500/30 text-yellow-400">
                      <SelectItem value="basic">
                        Basic (Low Resource Usage)
                      </SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="advanced">
                        Advanced (High Accuracy)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-yellow-500/20">
                  <div className="space-y-0.5">
                    <Label className="text-yellow-400 font-bold">
                      CLOUD SYNC
                    </Label>
                    <p className="text-yellow-400/60 text-xs font-medium">
                      Sync data for long-term analysis
                    </p>
                  </div>
                  <Switch className="data-[state=checked]:bg-yellow-500" />
                </div>

                <Button
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold mt-4"
                  onClick={() => {
                    // Save advanced settings to storage
                    const currentSettings = loadSettings() || {
                      trackingEnabled: true,
                      notificationsEnabled: true,
                      audioAlertsEnabled: true,
                      activeTab: "advanced",
                      visualSensitivity: 75,
                      audioSensitivity: 60,
                      confidenceThreshold: 65,
                      notificationLevel: "medium",
                    };

                    saveSettings({
                      ...currentSettings,
                      processingPower,
                    });

                    toast({
                      title: "Settings Saved",
                      description: "Your advanced settings have been saved",
                      className:
                        "bg-black border-2 border-green-500/50 text-green-400",
                    });
                  }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  SAVE ADVANCED SETTINGS
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
