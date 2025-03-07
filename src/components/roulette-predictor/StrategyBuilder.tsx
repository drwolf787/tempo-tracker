import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Brain,
  Save,
  Plus,
  Trash2,
  RefreshCw,
  Lightbulb,
  Sparkles,
  Download,
  Upload,
  Copy,
  Check,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  saveActiveStrategy,
  loadActiveStrategy,
  saveStrategies,
  loadStrategies,
} from "@/lib/storage";

interface Strategy {
  name: string;
  rules: {
    type: string;
    value: string;
    weight: number;
  }[];
  confidenceThreshold: number;
  numbersToPredictCount: number;
  trackRNG: boolean;
  trackTimeGaps: boolean;
  aiGenerated: boolean;
}

export default function StrategyBuilder() {
  const { toast } = useToast();
  const [strategyName, setStrategyName] = useState("New Strategy");
  const [rules, setRules] = useState([
    { type: "pattern", value: "alternating", weight: 60 },
    { type: "hot", value: "numbers", weight: 40 },
  ]);
  const [aiGenerated, setAiGenerated] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(75);
  const [numbersToPredictCount, setNumbersToPredictCount] = useState(3);
  const [trackRNG, setTrackRNG] = useState(true);
  const [trackTimeGaps, setTrackTimeGaps] = useState(true);
  const [savedStrategies, setSavedStrategies] = useState<Strategy[]>([]);

  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [exportText, setExportText] = useState("");
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved strategies and active strategy on mount
  useEffect(() => {
    const strategies = loadStrategies();
    if (strategies && strategies.length > 0) {
      setSavedStrategies(strategies);
    }

    const activeStrategy = loadActiveStrategy();
    if (activeStrategy) {
      setStrategyName(activeStrategy.name);
      setRules(activeStrategy.rules);
      setConfidenceThreshold(activeStrategy.confidenceThreshold);
      setNumbersToPredictCount(activeStrategy.numbersToPredictCount);
      setTrackRNG(activeStrategy.trackRNG);
      setTrackTimeGaps(activeStrategy.trackTimeGaps);
      setAiGenerated(activeStrategy.aiGenerated);
    }
  }, []);

  const addRule = () => {
    setRules([...rules, { type: "pattern", value: "sequence", weight: 50 }]);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const updateRule = (index: number, field: string, value: string | number) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    setRules(newRules);
  };

  const generateAIStrategy = () => {
    // Simulate AI generating a strategy
    setAiGenerated(true);
    setStrategyName("AI Optimized Strategy");
    setRules([
      { type: "pattern", value: "sector", weight: 70 },
      { type: "cold", value: "numbers", weight: 50 },
      { type: "time", value: "gaps", weight: 80 },
      { type: "rng", value: "seed", weight: 90 },
    ]);
    setConfidenceThreshold(85);
    setTrackRNG(true);
    setTrackTimeGaps(true);

    toast({
      title: "AI Strategy Generated",
      description:
        "A new optimized strategy has been created based on pattern analysis",
      className: "bg-black border-2 border-indigo-500/50 text-indigo-400",
    });
  };

  const exportStrategy = () => {
    const strategy: Strategy = {
      name: strategyName,
      rules,
      confidenceThreshold,
      numbersToPredictCount,
      trackRNG,
      trackTimeGaps,
      aiGenerated,
    };

    const strategyJson = JSON.stringify(strategy, null, 2);
    setExportText(strategyJson);
    setExportDialogOpen(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(exportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    toast({
      title: "Strategy Copied",
      description: "Strategy JSON has been copied to clipboard",
      className: "bg-black border-2 border-green-500/50 text-green-400",
    });
  };

  const downloadStrategy = () => {
    const blob = new Blob([exportText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${strategyName.replace(/\s+/g, "_").toLowerCase()}_strategy.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Strategy Downloaded",
      description: "Strategy file has been downloaded",
      className: "bg-black border-2 border-green-500/50 text-green-400",
    });
  };

  const importStrategy = () => {
    try {
      const strategy: Strategy = JSON.parse(importText);

      // Validate the imported data
      if (!strategy.name || !Array.isArray(strategy.rules)) {
        throw new Error("Invalid strategy format");
      }

      // Apply the imported strategy
      setStrategyName(strategy.name);
      setRules(strategy.rules);
      setConfidenceThreshold(strategy.confidenceThreshold || 75);
      setNumbersToPredictCount(strategy.numbersToPredictCount || 3);
      setTrackRNG(strategy.trackRNG !== undefined ? strategy.trackRNG : true);
      setTrackTimeGaps(
        strategy.trackTimeGaps !== undefined ? strategy.trackTimeGaps : true,
      );
      setAiGenerated(strategy.aiGenerated || false);

      // Save to storage
      saveActiveStrategy(strategy);

      // Add to saved strategies if not already present
      const existingIndex = savedStrategies.findIndex(
        (s) => s.name === strategy.name,
      );
      let updatedStrategies = [...savedStrategies];

      if (existingIndex >= 0) {
        // Update existing strategy
        updatedStrategies[existingIndex] = strategy;
      } else {
        // Add new strategy
        updatedStrategies.push(strategy);
      }

      setSavedStrategies(updatedStrategies);
      saveStrategies(updatedStrategies);

      setImportDialogOpen(false);
      setImportText("");

      toast({
        title: "Strategy Imported",
        description: `Successfully imported "${strategy.name}" strategy`,
        className: "bg-black border-2 border-green-500/50 text-green-400",
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Invalid strategy format. Please check your JSON data.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setImportText(content);
    };
    reader.readAsText(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="bg-black/60 border-2 border-yellow-500/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-yellow-400 text-sm font-bold uppercase tracking-wider flex items-center justify-between">
          <span>Strategy Builder</span>
          {aiGenerated && (
            <Badge className="bg-indigo-600 text-white border-indigo-700 font-bold text-xs">
              <Sparkles className="w-3 h-3 mr-1" /> AI Generated
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-yellow-400 font-bold">STRATEGY NAME</Label>
          <Input
            value={strategyName}
            onChange={(e) => setStrategyName(e.target.value)}
            className="bg-black/60 border-yellow-500/30 text-yellow-400 font-medium"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-yellow-400 font-bold">RULES</Label>
            <Button
              onClick={addRule}
              size="sm"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Rule
            </Button>
          </div>

          <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
            {rules.map((rule, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-2 bg-black/40 p-3 rounded-lg border border-yellow-500/20"
              >
                <div className="col-span-4">
                  <Select
                    value={rule.type}
                    onValueChange={(value) => updateRule(index, "type", value)}
                  >
                    <SelectTrigger className="bg-black/60 border-yellow-500/30 text-yellow-400 font-medium">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-yellow-500/30 text-yellow-400">
                      <SelectItem value="pattern">Pattern</SelectItem>
                      <SelectItem value="hot">Hot Numbers</SelectItem>
                      <SelectItem value="cold">Cold Numbers</SelectItem>
                      <SelectItem value="time">Time Analysis</SelectItem>
                      <SelectItem value="rng">RNG Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-4">
                  <Select
                    value={rule.value}
                    onValueChange={(value) => updateRule(index, "value", value)}
                  >
                    <SelectTrigger className="bg-black/60 border-yellow-500/30 text-yellow-400 font-medium">
                      <SelectValue placeholder="Value" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-yellow-500/30 text-yellow-400">
                      {rule.type === "pattern" && (
                        <>
                          <SelectItem value="alternating">
                            Alternating
                          </SelectItem>
                          <SelectItem value="sequence">Sequence</SelectItem>
                          <SelectItem value="sector">Sector</SelectItem>
                        </>
                      )}
                      {(rule.type === "hot" || rule.type === "cold") && (
                        <>
                          <SelectItem value="numbers">Numbers</SelectItem>
                          <SelectItem value="colors">Colors</SelectItem>
                          <SelectItem value="dozens">Dozens</SelectItem>
                        </>
                      )}
                      {rule.type === "time" && (
                        <>
                          <SelectItem value="gaps">Time Gaps</SelectItem>
                          <SelectItem value="timestamp">Timestamp</SelectItem>
                        </>
                      )}
                      {rule.type === "rng" && (
                        <>
                          <SelectItem value="seed">Seed Detection</SelectItem>
                          <SelectItem value="algorithm">Algorithm</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={rule.weight}
                      onChange={(e) =>
                        updateRule(index, "weight", parseInt(e.target.value))
                      }
                      className="bg-black/60 border-yellow-500/30 text-yellow-400 font-medium"
                      min="1"
                      max="100"
                    />
                    <span className="text-yellow-400 font-bold">%</span>
                  </div>
                </div>

                <div className="col-span-1 flex items-center justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRule(index)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
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
            Only predict when confidence exceeds this threshold
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-yellow-400 font-bold">
            NUMBERS TO PREDICT
          </Label>
          <Select
            value={numbersToPredictCount.toString()}
            onValueChange={(value) => setNumbersToPredictCount(parseInt(value))}
          >
            <SelectTrigger className="bg-black/60 border-yellow-500/30 text-yellow-400 font-medium">
              <SelectValue placeholder="Count" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-yellow-500/30 text-yellow-400">
              <SelectItem value="1">1 Number</SelectItem>
              <SelectItem value="3">3 Numbers</SelectItem>
              <SelectItem value="5">5 Numbers</SelectItem>
              <SelectItem value="10">10 Numbers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-yellow-400 font-bold">ADVANCED TRACKING</Label>

          <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-yellow-500/20">
            <div className="space-y-0.5">
              <Label className="text-yellow-400 font-bold">
                RNG/PRNG ANALYSIS
              </Label>
              <p className="text-yellow-400/60 text-xs font-medium">
                Track random number generator patterns
              </p>
            </div>
            <Switch
              checked={trackRNG}
              onCheckedChange={setTrackRNG}
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>

          <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-yellow-500/20">
            <div className="space-y-0.5">
              <Label className="text-yellow-400 font-bold">
                TIME GAP ANALYSIS
              </Label>
              <p className="text-yellow-400/60 text-xs font-medium">
                Track time between spins for pattern detection
              </p>
            </div>
            <Switch
              checked={trackTimeGaps}
              onCheckedChange={setTrackTimeGaps}
              className="data-[state=checked]:bg-yellow-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <Button
            onClick={generateAIStrategy}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold border border-indigo-700/50"
          >
            <Brain className="w-4 h-4 mr-2" />
            AI GENERATE
          </Button>
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
            onClick={() => {
              // Create strategy object
              const strategy: Strategy = {
                name: strategyName,
                rules,
                confidenceThreshold,
                numbersToPredictCount,
                trackRNG,
                trackTimeGaps,
                aiGenerated,
              };

              // Save as active strategy
              saveActiveStrategy(strategy);

              // Add to saved strategies if not already present
              const existingIndex = savedStrategies.findIndex(
                (s) => s.name === strategyName,
              );
              let updatedStrategies = [...savedStrategies];

              if (existingIndex >= 0) {
                // Update existing strategy
                updatedStrategies[existingIndex] = strategy;
              } else {
                // Add new strategy
                updatedStrategies.push(strategy);
              }

              setSavedStrategies(updatedStrategies);
              saveStrategies(updatedStrategies);

              toast({
                title: "Strategy Saved",
                description: "Your strategy has been saved successfully",
                className:
                  "bg-black border-2 border-green-500/50 text-green-400",
              });
            }}
          >
            <Save className="w-4 h-4 mr-2" />
            SAVE STRATEGY
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-2">
          <Button
            variant="outline"
            className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
            onClick={() => setImportDialogOpen(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            IMPORT STRATEGY
          </Button>
          <Button
            variant="outline"
            className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
            onClick={exportStrategy}
          >
            <Download className="w-4 h-4 mr-2" />
            EXPORT STRATEGY
          </Button>
        </div>

        {/* Import Dialog */}
        <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
          <DialogContent className="bg-black/95 border-2 border-yellow-500/30 text-yellow-400">
            <DialogHeader>
              <DialogTitle className="text-yellow-400 text-xl font-bold">
                Import Strategy
              </DialogTitle>
              <DialogDescription className="text-yellow-400/70">
                Paste a strategy JSON or upload a strategy file
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Paste strategy JSON here..."
                className="h-40 bg-black/60 border-yellow-500/30 text-yellow-400 font-mono text-sm"
              />

              <div className="flex items-center justify-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                  onClick={triggerFileInput}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Strategy File
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="ghost"
                className="text-yellow-400 hover:bg-yellow-500/10"
                onClick={() => setImportDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                onClick={importStrategy}
              >
                Import Strategy
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Export Dialog */}
        <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
          <DialogContent className="bg-black/95 border-2 border-yellow-500/30 text-yellow-400">
            <DialogHeader>
              <DialogTitle className="text-yellow-400 text-xl font-bold">
                Export Strategy
              </DialogTitle>
              <DialogDescription className="text-yellow-400/70">
                Copy the strategy JSON or download as a file
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="relative">
                <Textarea
                  value={exportText}
                  readOnly
                  className="h-40 bg-black/60 border-yellow-500/30 text-yellow-400 font-mono text-sm"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 h-8 w-8 p-0 text-yellow-400 hover:bg-yellow-500/10"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-center">
                <Button
                  variant="outline"
                  className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                  onClick={downloadStrategy}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Strategy File
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                onClick={() => setExportDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${className}`}
    >
      {children}
    </span>
  );
}
