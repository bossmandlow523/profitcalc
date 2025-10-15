import { create } from 'zustand';
import type {
  CalculationInputs,
  CalculationResults,
  OptionLeg,
  OptionLegInput
} from '../types';
import {
  StrategyType
} from '../types';

interface UserPreferences {
  theme: 'light' | 'dark';
  defaultVolatility: number;
  defaultRiskFreeRate: number;
  defaultPriceRange: number;
  defaultChartPoints: number;
  showGreeks: boolean;
  showAdvancedOptions: boolean;
  currencyFormat: 'USD' | 'compact';
}

interface CalculatorStore {
  // State
  inputs: CalculationInputs;
  results: CalculationResults | null;
  selectedStrategy: StrategyType;
  isCalculating: boolean;
  preferences: UserPreferences;
  error: string | null;

  // Actions
  setInputs: (inputs: Partial<CalculationInputs>) => void;
  addLeg: (leg: OptionLegInput) => void;
  updateLeg: (id: string, updates: Partial<OptionLeg>) => void;
  removeLeg: (id: string) => void;
  setStrategy: (strategy: StrategyType) => void;
  calculate: () => void;
  reset: () => void;
  setPreferences: (prefs: Partial<UserPreferences>) => void;
}

const initialState = {
  inputs: {
    currentStockPrice: 100,
    legs: [],
    volatility: 0.30,
    riskFreeRate: 0.05,
    priceRange: 0.5,
    chartPoints: 100,
  },
  results: null,
  selectedStrategy: StrategyType.LONG_CALL,
  isCalculating: false,
  error: null,
  preferences: {
    theme: 'dark' as const,
    defaultVolatility: 0.30,
    defaultRiskFreeRate: 0.05,
    defaultPriceRange: 0.5,
    defaultChartPoints: 100,
    showGreeks: true,
    showAdvancedOptions: false,
    currencyFormat: 'USD' as const,
  },
};

export const useCalculatorStore = create<CalculatorStore>((set, get) => ({
  ...initialState,

  setInputs: (newInputs) => {
    set((state) => ({
      inputs: { ...state.inputs, ...newInputs },
      error: null,
    }));
  },

  addLeg: (legInput) => {
    set((state) => {
      const newLeg: OptionLeg = {
        id: crypto.randomUUID(),
        ...legInput,
        expiryDate: new Date(legInput.expiryDate),
      };
      return {
        inputs: {
          ...state.inputs,
          legs: [...state.inputs.legs, newLeg],
        },
        error: null,
      };
    });
  },

  updateLeg: (id, updates) => {
    set((state) => ({
      inputs: {
        ...state.inputs,
        legs: state.inputs.legs.map(leg =>
          leg.id === id ? { ...leg, ...updates } : leg
        ),
      },
    }));
  },

  removeLeg: (id) => {
    set((state) => ({
      inputs: {
        ...state.inputs,
        legs: state.inputs.legs.filter(leg => leg.id !== id),
      },
    }));
  },

  setStrategy: (strategy) => {
    set({
      selectedStrategy: strategy,
    });
  },

  calculate: () => {
    const { inputs } = get();

    set({ isCalculating: true, error: null });

    try {
      // TODO: Connect to calculation engine
      // For now, just create dummy results to test UI
      const results: CalculationResults = {
        maxProfit: null, // Unlimited
        maxLoss: -300,
        breakEvenPoints: [103],
        initialCost: -300,
        chartData: generateDummyChartData(inputs.currentStockPrice),
        legResults: inputs.legs.map(leg => ({
          legId: leg.id,
          intrinsicValue: 0,
          profitLoss: 0,
        })),
      };

      set({ results, isCalculating: false, error: null });
    } catch (error) {
      console.error('Calculation failed:', error);
      set({
        isCalculating: false,
        error: error instanceof Error ? error.message : 'Calculation failed'
      });
    }
  },

  reset: () => {
    set(initialState);
  },

  setPreferences: (prefs) => {
    set((state) => ({
      preferences: { ...state.preferences, ...prefs },
    }));
  },
}));

// Temporary dummy chart data generator
function generateDummyChartData(currentPrice: number) {
  const data = [];
  const minPrice = currentPrice * 0.5;
  const maxPrice = currentPrice * 1.5;
  const step = (maxPrice - minPrice) / 100;

  for (let price = minPrice; price <= maxPrice; price += step) {
    const pl = Math.max(0, price - (currentPrice + 5)) * 100 - 300;
    data.push({
      stockPrice: Math.round(price * 100) / 100,
      profitLoss: Math.round(pl * 100) / 100,
    });
  }

  return data;
}
