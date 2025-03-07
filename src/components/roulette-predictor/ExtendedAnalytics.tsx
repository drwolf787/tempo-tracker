import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  PieChart,
  LineChart,
  Download,
  RefreshCw,
  Search,
} from "lucide-react";

export default function ExtendedAnalytics() {
  const [activeTab, setActiveTab] = useState("distribution");

  return (
    <Card className="bg-black/60 border-2 border-yellow-500/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-yellow-400 text-sm font-bold uppercase tracking-wider">
          Extended Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 bg-black border border-yellow-500/30 p-1 rounded-lg mx-4 mt-4">
            <TabsTrigger
              value="distribution"
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black font-bold text-yellow-400"
            >
              <PieChart className="w-4 h-4 mr-2" />
              Distribution
            </TabsTrigger>
            <TabsTrigger
              value="trends"
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black font-bold text-yellow-400"
            >
              <LineChart className="w-4 h-4 mr-2" />
              Trends
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black font-bold text-yellow-400"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="distribution" className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 p-3 rounded-lg border border-yellow-500/20">
                  <h3 className="text-yellow-400 font-bold text-sm mb-2">
                    COLOR DISTRIBUTION
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-red-600"></div>
                      <span className="text-white text-sm">Red</span>
                    </div>
                    <span className="text-yellow-400 font-bold">48.6%</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-black border border-white/20"></div>
                      <span className="text-white text-sm">Black</span>
                    </div>
                    <span className="text-yellow-400 font-bold">48.6%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-600"></div>
                      <span className="text-white text-sm">Green</span>
                    </div>
                    <span className="text-yellow-400 font-bold">2.8%</span>
                  </div>
                </div>

                <div className="bg-black/40 p-3 rounded-lg border border-yellow-500/20">
                  <h3 className="text-yellow-400 font-bold text-sm mb-2">
                    DOZENS DISTRIBUTION
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">1st Dozen (1-12)</span>
                    <span className="text-yellow-400 font-bold">32.4%</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">
                      2nd Dozen (13-24)
                    </span>
                    <span className="text-yellow-400 font-bold">35.1%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">
                      3rd Dozen (25-36)
                    </span>
                    <span className="text-yellow-400 font-bold">32.5%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 p-3 rounded-lg border border-yellow-500/20">
                  <h3 className="text-yellow-400 font-bold text-sm mb-2">
                    HIGH/LOW DISTRIBUTION
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">Low (1-18)</span>
                    <span className="text-yellow-400 font-bold">51.3%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">High (19-36)</span>
                    <span className="text-yellow-400 font-bold">48.7%</span>
                  </div>
                </div>

                <div className="bg-black/40 p-3 rounded-lg border border-yellow-500/20">
                  <h3 className="text-yellow-400 font-bold text-sm mb-2">
                    COLUMNS DISTRIBUTION
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">1st Column</span>
                    <span className="text-yellow-400 font-bold">32.4%</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm">2nd Column</span>
                    <span className="text-yellow-400 font-bold">35.1%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">3rd Column</span>
                    <span className="text-yellow-400 font-bold">32.5%</span>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 p-3 rounded-lg border border-yellow-500/20">
                <h3 className="text-yellow-400 font-bold text-sm mb-2">
                  EVEN/ODD DISTRIBUTION
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm">Even</span>
                  <span className="text-yellow-400 font-bold">49.7%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Odd</span>
                  <span className="text-yellow-400 font-bold">50.3%</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="p-4">
            <div className="space-y-4">
              <div className="bg-black/40 p-3 rounded-lg border border-yellow-500/20">
                <h3 className="text-yellow-400 font-bold text-sm mb-2">
                  RECENT TRENDS
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm">
                    Red/Black Alternating
                  </span>
                  <Badge className="bg-green-600 text-white border-green-700 font-bold">
                    Strong
                  </Badge>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm">Sector 1 Dominance</span>
                  <Badge className="bg-yellow-500 text-black border-yellow-600 font-bold">
                    Medium
                  </Badge>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm">Even Number Bias</span>
                  <Badge className="bg-red-600 text-white border-red-700 font-bold">
                    Weak
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">
                    3rd Dozen Frequency
                  </span>
                  <Badge className="bg-green-600 text-white border-green-700 font-bold">
                    Strong
                  </Badge>
                </div>
              </div>

              <div className="bg-black/40 p-3 rounded-lg border border-yellow-500/20">
                <h3 className="text-yellow-400 font-bold text-sm mb-2">
                  PATTERN DETECTION
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm">Repeating Sequence</span>
                  <Badge className="bg-yellow-500 text-black border-yellow-600 font-bold">
                    Detected
                  </Badge>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm">Time-based Pattern</span>
                  <Badge className="bg-green-600 text-white border-green-700 font-bold">
                    Confirmed
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">RNG Seed Pattern</span>
                  <Badge className="bg-yellow-500 text-black border-yellow-600 font-bold">
                    Analyzing
                  </Badge>
                </div>
              </div>

              <div className="bg-black/40 p-3 rounded-lg border border-yellow-500/20">
                <h3 className="text-yellow-400 font-bold text-sm mb-2">
                  PREDICTION ACCURACY
                </h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm">Last 10 Spins</span>
                  <span className="text-yellow-400 font-bold">70%</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm">Last 50 Spins</span>
                  <span className="text-yellow-400 font-bold">68%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Last 100 Spins</span>
                  <span className="text-yellow-400 font-bold">72%</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-yellow-400 font-bold text-sm">
                EXTENDED HISTORY (LAST 500 SPINS)
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                >
                  <Search className="w-4 h-4 mr-1" /> Filter
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                >
                  <Download className="w-4 h-4 mr-1" /> Export
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[300px] w-full">
              <table className="w-full">
                <thead>
                  <tr className="text-yellow-400/80 text-xs border-b border-yellow-500/30">
                    <th className="pb-2 text-left font-bold">Spin #</th>
                    <th className="pb-2 text-left font-bold">Number</th>
                    <th className="pb-2 text-left font-bold">Color</th>
                    <th className="pb-2 text-left font-bold">Time</th>
                    <th className="pb-2 text-left font-bold">Table</th>
                    <th className="pb-2 text-right font-bold">Predicted</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 50 }).map((_, index) => {
                    const number = Math.floor(Math.random() * 37);
                    const isRed = [
                      1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32,
                      34, 36,
                    ].includes(number);
                    const isBlack = [
                      2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29,
                      31, 33, 35,
                    ].includes(number);
                    const isGreen = number === 0;
                    const color = isRed ? "red" : isBlack ? "black" : "green";
                    const predicted = Math.random() > 0.3; // 70% correct predictions

                    return (
                      <tr
                        key={index}
                        className="border-b border-yellow-500/10 text-sm hover:bg-black/40"
                      >
                        <td className="py-2 text-yellow-400/70 font-medium">
                          {500 - index}
                        </td>
                        <td className="py-2 text-white font-medium">
                          {number}
                        </td>
                        <td className="py-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded-full ${isRed ? "bg-red-600" : isBlack ? "bg-black border border-yellow-500/50" : "bg-green-600"} shadow-sm`}
                            ></div>
                            <span className="text-white capitalize font-medium">
                              {color}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 text-yellow-400/70 font-medium">
                          {`${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`}
                        </td>
                        <td className="py-2 text-white font-medium">
                          {
                            ["Table A", "Table B", "Table C", "VIP Table"][
                              Math.floor(Math.random() * 4)
                            ]
                          }
                        </td>
                        <td className="py-2 text-right">
                          {predicted ? (
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
                    );
                  })}
                </tbody>
              </table>
            </ScrollArea>

            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Load More History
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
