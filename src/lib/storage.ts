// Storage utility for persisting data

// Types
import { SpinResult, PredictionResult } from "./roulette-predictor";

export interface StoredSettings {
  trackingEnabled: boolean;
  notificationsEnabled: boolean;
  audioAlertsEnabled: boolean;
  visualSensitivity: number;
  audioSensitivity: number;
  processingPower: number;
  confidenceThreshold: number;
  notificationLevel: string;
  activeTab: string;
}

export interface StoredStrategy {
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

const STORAGE_KEYS = {
  SPIN_HISTORY: "roulette_spin_history",
  SETTINGS: "roulette_settings",
  CURRENT_PREDICTION: "roulette_current_prediction",
  ACTIVE_STRATEGY: "roulette_active_strategy",
  SAVED_STRATEGIES: "roulette_saved_strategies",
};

// Save spin history to localStorage
export const saveSpinHistory = (history: SpinResult[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SPIN_HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error("Error saving spin history:", error);
  }
};

// Load spin history from localStorage
export const loadSpinHistory = (): SpinResult[] => {
  try {
    const storedHistory = localStorage.getItem(STORAGE_KEYS.SPIN_HISTORY);
    return storedHistory ? JSON.parse(storedHistory) : [];
  } catch (error) {
    console.error("Error loading spin history:", error);
    return [];
  }
};

// Save current prediction to localStorage
export const saveCurrentPrediction = (prediction: PredictionResult): void => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.CURRENT_PREDICTION,
      JSON.stringify(prediction),
    );
  } catch (error) {
    console.error("Error saving current prediction:", error);
  }
};

// Load current prediction from localStorage
export const loadCurrentPrediction = (): PredictionResult | null => {
  try {
    const storedPrediction = localStorage.getItem(
      STORAGE_KEYS.CURRENT_PREDICTION,
    );
    return storedPrediction ? JSON.parse(storedPrediction) : null;
  } catch (error) {
    console.error("Error loading current prediction:", error);
    return null;
  }
};

// Save settings to localStorage
export const saveSettings = (settings: StoredSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving settings:", error);
  }
};

// Load settings from localStorage
export const loadSettings = (): StoredSettings | null => {
  try {
    const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return storedSettings ? JSON.parse(storedSettings) : null;
  } catch (error) {
    console.error("Error loading settings:", error);
    return null;
  }
};

// Save active strategy to localStorage
export const saveActiveStrategy = (strategy: StoredStrategy): void => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.ACTIVE_STRATEGY,
      JSON.stringify(strategy),
    );
  } catch (error) {
    console.error("Error saving active strategy:", error);
  }
};

// Load active strategy from localStorage
export const loadActiveStrategy = (): StoredStrategy | null => {
  try {
    const storedStrategy = localStorage.getItem(STORAGE_KEYS.ACTIVE_STRATEGY);
    return storedStrategy ? JSON.parse(storedStrategy) : null;
  } catch (error) {
    console.error("Error loading active strategy:", error);
    return null;
  }
};

// Save strategies collection to localStorage
export const saveStrategies = (strategies: StoredStrategy[]): void => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.SAVED_STRATEGIES,
      JSON.stringify(strategies),
    );
  } catch (error) {
    console.error("Error saving strategies:", error);
  }
};

// Load strategies collection from localStorage
export const loadStrategies = (): StoredStrategy[] => {
  try {
    const storedStrategies = localStorage.getItem(
      STORAGE_KEYS.SAVED_STRATEGIES,
    );
    return storedStrategies ? JSON.parse(storedStrategies) : [];
  } catch (error) {
    console.error("Error loading strategies:", error);
    return [];
  }
};

// Clear all stored data (for testing/reset)
export const clearAllStoredData = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error("Error clearing stored data:", error);
  }
};
