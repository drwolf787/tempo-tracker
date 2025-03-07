// Types for roulette prediction
export interface PredictionResult {
  number: number;
  color: "red" | "black" | "green";
  confidence: number;
  trending: "up" | "down" | "stable";
  timestamp: string;
}

export interface SpinResult {
  number: number;
  color: "red" | "black" | "green";
  timestamp: string;
}

// Constants for roulette wheel
const RED_NUMBERS = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
];
const BLACK_NUMBERS = [
  2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35,
];
const GREEN_NUMBERS = [0];

// Helper to determine color from number
export const getColorFromNumber = (
  number: number,
): "red" | "black" | "green" => {
  if (GREEN_NUMBERS.includes(number)) return "green";
  if (RED_NUMBERS.includes(number)) return "red";
  return "black";
};

import { loadSpinHistory, saveSpinHistory } from "./storage";

// Store historical results
let spinHistory: SpinResult[] = [];

// Add a new spin result to history
export const addSpinResult = (number: number): SpinResult => {
  const color = getColorFromNumber(number);
  const timestamp = new Date().toLocaleTimeString();

  const result: SpinResult = { number, color, timestamp };
  spinHistory = [result, ...spinHistory].slice(0, 50); // Keep last 50 spins

  // Persist to storage
  saveSpinHistory(spinHistory);

  return result;
};

// Get spin history
export const getSpinHistory = (): SpinResult[] => {
  return spinHistory;
};

// Clear history (for testing)
export const clearHistory = (): void => {
  spinHistory = [];
  saveSpinHistory([]);
};

// Initialize with some mock data
export const initializeMockData = (): void => {
  const now = new Date();
  const mockData: SpinResult[] = [
    {
      number: 32,
      color: "red",
      timestamp: new Date(now.getTime() - 60000).toLocaleTimeString(),
    },
    {
      number: 15,
      color: "black",
      timestamp: new Date(now.getTime() - 120000).toLocaleTimeString(),
    },
    {
      number: 19,
      color: "red",
      timestamp: new Date(now.getTime() - 180000).toLocaleTimeString(),
    },
    {
      number: 0,
      color: "green",
      timestamp: new Date(now.getTime() - 240000).toLocaleTimeString(),
    },
    {
      number: 4,
      color: "black",
      timestamp: new Date(now.getTime() - 300000).toLocaleTimeString(),
    },
    {
      number: 21,
      color: "red",
      timestamp: new Date(now.getTime() - 360000).toLocaleTimeString(),
    },
    {
      number: 2,
      color: "black",
      timestamp: new Date(now.getTime() - 420000).toLocaleTimeString(),
    },
    {
      number: 25,
      color: "red",
      timestamp: new Date(now.getTime() - 480000).toLocaleTimeString(),
    },
    {
      number: 17,
      color: "black",
      timestamp: new Date(now.getTime() - 540000).toLocaleTimeString(),
    },
    {
      number: 34,
      color: "red",
      timestamp: new Date(now.getTime() - 600000).toLocaleTimeString(),
    },
  ];

  spinHistory = mockData;
  saveSpinHistory(mockData);
};

// Load history from storage
export const loadHistory = (): void => {
  const storedHistory = loadSpinHistory();
  if (storedHistory && storedHistory.length > 0) {
    spinHistory = storedHistory;
  } else {
    // If no stored history, initialize with mock data
    initializeMockData();
  }
};

import { saveCurrentPrediction, loadCurrentPrediction } from "./storage";

// Generate a prediction based on history
export const generatePrediction = (): PredictionResult => {
  // If no history, make a random prediction
  if (spinHistory.length === 0) {
    const randomNumber = Math.floor(Math.random() * 37);
    const color = getColorFromNumber(randomNumber);
    const prediction = {
      number: randomNumber,
      color,
      confidence: Math.floor(Math.random() * 30) + 50, // 50-80% confidence
      trending: Math.random() > 0.5 ? "up" : "down",
      timestamp: new Date().toLocaleTimeString(),
    };

    // Save to storage
    saveCurrentPrediction(prediction);
    return prediction;
  }

  // Analyze patterns in history (simplified AI simulation)
  const recentSpins = spinHistory.slice(0, 10);

  // Count occurrences of each color
  const colorCounts = {
    red: recentSpins.filter((spin) => spin.color === "red").length,
    black: recentSpins.filter((spin) => spin.color === "black").length,
    green: recentSpins.filter((spin) => spin.color === "green").length,
  };

  // Determine if there's a color trend
  let predictedColor: "red" | "black" | "green";
  if (
    colorCounts.red > colorCounts.black &&
    colorCounts.red > colorCounts.green
  ) {
    // If red is dominant, predict black (alternating pattern)
    predictedColor = "black";
  } else if (
    colorCounts.black > colorCounts.red &&
    colorCounts.black > colorCounts.green
  ) {
    // If black is dominant, predict red
    predictedColor = "red";
  } else if (colorCounts.green > 1) {
    // If green appeared multiple times recently (unusual), predict green
    predictedColor = "green";
  } else {
    // Otherwise random between red and black
    predictedColor = Math.random() > 0.5 ? "red" : "black";
  }

  // Find a number matching the predicted color
  let predictedNumber: number;
  if (predictedColor === "red") {
    predictedNumber =
      RED_NUMBERS[Math.floor(Math.random() * RED_NUMBERS.length)];
  } else if (predictedColor === "black") {
    predictedNumber =
      BLACK_NUMBERS[Math.floor(Math.random() * BLACK_NUMBERS.length)];
  } else {
    predictedNumber = 0;
  }

  // Calculate confidence based on pattern strength
  let confidence: number;
  const mostRecentColor = recentSpins[0].color;
  const secondMostRecentColor = recentSpins[1]?.color;

  if (mostRecentColor === secondMostRecentColor) {
    // Strong pattern if last two spins were same color
    confidence = Math.floor(Math.random() * 15) + 75; // 75-90%
  } else {
    // Weaker pattern
    confidence = Math.floor(Math.random() * 25) + 60; // 60-85%
  }

  // Determine trend direction
  const trending: "up" | "down" | "stable" =
    confidence > 80 ? "up" : confidence < 65 ? "down" : "stable";

  const prediction = {
    number: predictedNumber,
    color: predictedColor,
    confidence,
    trending,
    timestamp: new Date().toLocaleTimeString(),
  };

  // Save to storage
  saveCurrentPrediction(prediction);
  return prediction;
};

// Load the last prediction from storage
export const loadLastPrediction = (): PredictionResult | null => {
  return loadCurrentPrediction();
};

// Initialize with data from storage or mock data
loadHistory();
