# Mobile Optimization Restoration Guide

The mobile optimization work has been lost. Here are all the changes needed to restore it:

## 1. UnifiedOptionsChain.tsx Mobile Fixes

### Modal Container (line ~381)
```tsx
// CHANGE FROM:
className="glass-card-strong rounded-2xl border border-primary/30 shadow-2xl max-w-6xl w-full max-h-[92vh] overflow-hidden flex flex-col"

// CHANGE TO:
className="glass-card-strong rounded-2xl border border-primary/30 shadow-2xl max-w-full md:max-w-6xl w-full mx-2 md:mx-auto max-h-[95vh] md:max-h-[92vh] overflow-hidden flex flex-col"
```

### Header Padding (line ~386)
```tsx
// CHANGE FROM:
<div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-primary/10 to-secondary/10">

// CHANGE TO:
<div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 bg-gradient-to-r from-primary/10 to-secondary/10">
```

### Header Title (line ~388)
```tsx
// CHANGE FROM:
<h3 className="text-xl font-bold text-white">

// CHANGE TO:
<h3 className="text-lg md:text-xl font-bold text-white">
```

### Header Subtitle (line ~391)
```tsx
// CHANGE FROM:
<p className="text-sm text-gray-400 mt-1">

// CHANGE TO:
<p className="text-xs md:text-sm text-gray-400 mt-1">
```

### Calendar Controls Container (line ~406)
```tsx
// CHANGE FROM:
<div className="flex items-center gap-4 p-4">

// CHANGE TO:
<div className="flex flex-wrap items-center gap-2 md:gap-4 p-2 md:p-4">
```

### Calendar Button (line ~422)
```tsx
// CHANGE FROM:
className="flex items-center gap-2 px-4 py-2.5 rounded-lg..."
<CalendarIcon className="w-4 h-4" />
<span className="text-sm">

// CHANGE TO:
className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2.5 rounded-lg..."
<CalendarIcon className="w-3 md:w-4 h-3 md:h-4" />
<span className="text-xs md:text-sm">
```

Also change `month: 'long'` to `month: 'short'` in the date formatter

### See All Button (line ~471)
```tsx
// CHANGE FROM:
className="ml-auto px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/30 hover:border-blue-400 hover:bg-blue-500/30 text-blue-300 text-sm font-medium transition-all"

// CHANGE TO:
className="ml-auto px-2 md:px-4 py-1.5 md:py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/30 hover:border-blue-400 hover:bg-blue-500/30 text-blue-300 text-xs md:text-sm font-medium transition-all"
```

### Table Headers - CRITICAL FOR NO HORIZONTAL SCROLL
All column headers in the `<thead>` section need responsive sizing.

For IV, OI, Vol columns (both Calls and Puts side), add `hidden md:table-cell`:
```tsx
<th className="hidden md:table-cell px-3 py-3 text-left font-bold text-purple-400 bg-dark-900 w-16">IV</th>
<th className="hidden md:table-cell px-3 py-3 text-left font-bold text-cyan-400 bg-dark-900 w-20">OI</th>
<th className="hidden md:table-cell px-3 py-3 text-left font-bold text-gray-400 bg-dark-900 w-16">Vol</th>
```

For Bid/Mid/Ask columns, add responsive padding:
```tsx
<th className="px-2 md:px-4 py-2 md:py-3 text-right font-bold text-white bg-dark-900 md:w-20">Ask</th>
```

### Table Body Cells
Same pattern - hide IV, OI, Vol on mobile, make Bid/Mid/Ask responsive:
```tsx
<td className="hidden md:table-cell px-3 py-3 text-left text-xs cursor-pointer text-purple-400">
<td className="px-2 md:px-4 py-2 md:py-3 text-right font-semibold text-xs md:text-sm text-white">
```

### Footer Legend (line ~790)
```tsx
// CHANGE FROM:
<div className="px-4 py-2.5 border-t border-white/10 bg-background/80 backdrop-blur-sm flex-shrink-0">
  <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1.5 text-xs">

// CHANGE TO:
<div className="px-3 md:px-4 py-2 md:py-2.5 border-t border-white/10 bg-background/80 backdrop-blur-sm flex-shrink-0">
  <div className="flex flex-col md:flex-row md:flex-wrap items-start md:items-center md:justify-between gap-2 md:gap-x-6 md:gap-y-1.5 text-[10px] md:text-xs">
```

Change text to abbreviations:
```tsx
<span className="text-gray-300 font-medium">ITM</span>
<span className="text-gray-300 font-medium">ATM</span>
<span className="text-gray-300 font-medium">OTM</span>
```

Hide column legend on mobile:
```tsx
<div className="hidden md:flex items-center gap-3 text-gray-400">
```

---

## 2. StrategyForm.tsx Mobile Fixes

### Main Container (line ~285-289)
```tsx
// Headers
<div className="px-4 md:px-8 py-4 md:py-6 bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-white/10">
  <h2 className="text-xl md:text-2xl font-bold text-white">Calculator Form</h2>
</div>
<div className="p-4 md:p-8 space-y-6 md:space-y-10">

// Section heading
<div className="text-lg md:text-xl font-semibold mb-3 md:mb-5 text-white">Underlying stock symbol</div>

// Grid
<div className="grid gap-4 md:gap-6 lg:grid-cols-[1fr_1fr_auto] items-end">
```

### Input Fields
All inputs need responsive heights and text sizes:
```tsx
// Labels
<Label htmlFor="symbol" className="text-sm md:text-base text-gray-400">

// Inputs
className="bg-dark-700 border-2 border-white/10 focus:border-primary uppercase text-base md:text-lg h-12 md:h-14 rounded-xl"

// NumberInput
classNames={{
  inputWrapper: "bg-dark-700 border-2 border-white/10 focus-within:border-primary shadow-none outline-none h-12 md:h-14 rounded-xl",
  input: "text-white text-base md:text-lg"
}}
startContent={<span className="text-gray-400 text-base md:text-lg">$</span>}
```

### Get Price Button
```tsx
className="shimmer-effect h-12 md:h-14 px-6 md:px-8 text-sm md:text-base font-semibold bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary transition-all rounded-xl whitespace-nowrap"

<RefreshCw className="w-4 md:w-5 h-4 md:h-5 mr-2 animate-spin" />
<span className="hidden md:inline">Loading...</span>
```

### Option Leg Cards
```tsx
<div key={index} className="bg-gradient-to-br from-dark-800/30 to-dark-900/30 rounded-2xl p-4 md:p-8 border border-white/5">
  <div className="relative mb-4 md:mb-8">
    <div className="relative bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-2 border-primary/30 rounded-xl p-3 md:p-4 backdrop-blur-sm">
      <div className="text-lg md:text-2xl font-bold text-white flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
```

### Browse Options Button
```tsx
className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed h-12 md:h-14 rounded-xl whitespace-nowrap font-semibold w-full lg:w-auto"

<Table2 className="w-5 md:w-6 h-5 md:h-6 text-primary" />
<span className="ml-2 text-sm md:text-base">Browse Options</span>
```

### Calculate Button
```tsx
className="shimmer-effect inline-flex items-center justify-center gap-2 md:gap-3 px-8 md:px-16 py-4 md:py-6 rounded-xl md:rounded-2xl bg-gradient-to-r from-primary via-secondary to-purple-500 text-white font-bold text-xl md:text-2xl shadow-2xl hover:shadow-primary/50 hover:scale-105 transition-all duration-200 animate-glow-pulse w-full md:w-auto"

<Calculator className="w-6 md:w-7 h-6 md:h-7" />
```

### Price Range Section
```tsx
<div className="mt-6 md:mt-10 bg-dark-800/30 rounded-xl p-4 md:p-8 border border-white/5">
  <div className="flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-3 md:gap-5 text-sm md:text-base">

// Inputs
classNames={{
  base: "w-32 md:w-40",
  inputWrapper: "bg-dark-700 border-2 border-white/10 focus-within:border-primary shadow-none outline-none h-10 md:h-12 rounded-xl pr-10 md:pr-12",
  input: "text-white text-sm md:text-base pl-3 md:pl-4"
}}
```

---

## 3. tubelight-navbar.tsx Mobile Fixes

### Container Positioning (line ~52-56)
```tsx
// CHANGE FROM:
<div
  className={cn(
    "fixed top-4 right-8 z-50",
    className,
  )}
>

// CHANGE TO:
<div
  className={cn(
    "fixed top-4 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 z-50",
    className,
  )}
>
```

### Container Padding (line ~58)
```tsx
// CHANGE FROM:
<div className="flex items-center gap-1 bg-background/10 border border-border/40 backdrop-blur-xl px-1.5 py-1 rounded-full shadow-lg">

// CHANGE TO:
<div className="flex items-center gap-0.5 md:gap-1 bg-background/10 border border-border/40 backdrop-blur-xl px-1 md:px-1.5 py-0.5 md:py-1 rounded-full shadow-lg">
```

### Button Padding (line ~68)
```tsx
// CHANGE FROM:
className={cn(
  "relative cursor-pointer text-[13px] font-medium px-5 py-2 rounded-full transition-colors",
  "text-foreground/70 hover:text-primary",
  isActive && "text-primary",
)}

// CHANGE TO:
className={cn(
  "relative cursor-pointer text-[13px] font-medium px-3 md:px-5 py-1.5 md:py-2 rounded-full transition-colors",
  "text-foreground/70 hover:text-primary",
  isActive && "text-primary",
)}
```

### Icon Size (line ~75)
```tsx
// CHANGE FROM:
<Icon size={17} strokeWidth={2.5} />

// CHANGE TO:
<Icon size={16} strokeWidth={2.5} />
```

---

## Summary

These changes make the app fully mobile-responsive:
- **UnifiedOptionsChain**: No horizontal scroll, hides less important columns on mobile
- **StrategyForm**: All components scale down appropriately for mobile
- **Navbar**: Centered on mobile, right-aligned on desktop

All changes use `md:` breakpoint (768px) so desktop appearance is unchanged.
