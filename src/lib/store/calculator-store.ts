import { create } from 'zustand';
import type {
  CalculationInputs,
  CalculationResults,
  OptionLeg,
  OptionLegInput,
  StockLeg
} from '../types';
import {
  StrategyType
} from '../types';
import {
  calcTotalPL,
  calcInitialCost,
  calcStrategyMaxProfit,
  calcStrategyMaxLoss,
  findBreakEvens,
  generatePLData,
  calcIntrinsicValue,
  calcLegPL
} from '../calculations';
import { detectStrategy, getStrategyName } from '../calculations/strategy-detector';

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
  setStockPosition: (stockPosition: StockLeg | null) => void;
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
    dividendYield: 0.00,
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

  setStockPosition: (stockPosition) => {
    set((state) => ({
      inputs: {
        ...state.inputs,
        stockPosition: stockPosition || undefined,
      },
      error: null,
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
      // Validate inputs
      if (!inputs.legs || inputs.legs.length === 0) {
        throw new Error('Please add at least one option leg');
      }

      if (inputs.currentStockPrice <= 0) {
        throw new Error('Current stock price must be greater than 0');
      }

      // Detect strategy type
      const hasStock = !!inputs.stockPosition;
      const detection = detectStrategy(inputs.legs, hasStock);
      const strategyName = getStrategyName(detection.type);

      // Warn if strategy requires stock but none provided
      if (detection.requiresStock && !hasStock && detection.confidence >= 0.8) {
        console.warn(`Strategy "${strategyName}" typically requires a stock position`);
      }

      // Calculate initial cost/credit
      const initialCost = calcInitialCost(inputs.legs);

      // Calculate max profit and max loss
      const maxProfit = calcStrategyMaxProfit(inputs.legs, inputs.currentStockPrice);
      const maxLoss = calcStrategyMaxLoss(inputs.legs, inputs.currentStockPrice);

      // Find break-even points
      const breakEvenPoints = findBreakEvens(
        inputs.legs,
        inputs.currentStockPrice,
        inputs.priceRange || 0.5
      );

      // Generate chart data
      const chartData = generatePLData(inputs.legs, inputs.currentStockPrice, {
        priceRange: inputs.priceRange,
        points: inputs.chartPoints,
        showTimeValue: false
      });

      // Calculate individual leg results
      const legResults = inputs.legs.map(leg => {
        const intrinsicValue = calcIntrinsicValue(
          leg.optionType,
          inputs.currentStockPrice,
          leg.strikePrice
        );
        const profitLoss = calcLegPL(leg, inputs.currentStockPrice);

        return {
          legId: leg.id,
          intrinsicValue,
          profitLoss,
        };
      });

      // Calculate current total P/L at current price
      const currentPL = calcTotalPL(inputs.legs, inputs.currentStockPrice);

      const results: CalculationResults = {
        maxProfit,
        maxLoss,
        breakEvenPoints,
        initialCost,
        currentValue: currentPL + initialCost,
        currentPL,
        detectedStrategy: {
          type: detection.type,
          name: strategyName,
          confidence: detection.confidence,
          requiresStock: detection.requiresStock,
          requiresTimeBasedCalc: detection.requiresTimeBasedCalc,
        },
        chartData,
        legResults,
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
