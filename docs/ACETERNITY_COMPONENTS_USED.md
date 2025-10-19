# Aceternity UI Components Used

This document lists the Aceternity UI components integrated into the wireframe files.

## Components Integrated

### 1. **Spotlight Component** (`@aceternity/spotlight`)
- **Location**: Both `highasf.html` and `highashit.html`
- **Implementation**: SVG-based spotlight effect that follows mouse movement
- **Styling**: Adapted from Aceternity's spotlight component with custom JavaScript for mouse tracking
- **Features**:
  - Animated ellipse with blur filter
  - Pointer-events-none for non-intrusive UX
  - Custom opacity and positioning

### 2. **Grid Background** (`@aceternity/grid`)
- **Location**: Both HTML files
- **Implementation**: CSS-based grid pattern background
- **Styling**:
  ```css
  background-image: linear-gradient(to right, rgba(99, 102, 241, 0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(99, 102, 241, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  ```
- **Equivalent to**: `bg-grid-white/[0.1]` from Aceternity

### 3. **Background Gradient Animation** (`@aceternity/background-gradient`)
- **Location**: Inspired the color scheme and glassmorphism
- **Implementation**: Custom CSS variables and gradient backgrounds
- **Features**:
  - Smooth color transitions
  - Blend modes for depth
  - Interactive gradients

### 4. **Card Hover Effects** (`@aceternity/card-hover-effect`)
- **Location**: Strategy cards in both files
- **Implementation**: CSS transitions with transform and box-shadow
- **Features**:
  ```css
  .strategy-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px -12px rgba(99, 102, 241, 0.3);
  }
  ```

### 5. **Glowing Stars/Effects** (`@aceternity/glowing-stars`)
- **Location**: Logo, buttons, and interactive elements
- **Implementation**:
  - Glow pulse animation on logo
  - Shimmer effects on buttons
  - Border glow effects
- **CSS**:
  ```css
  .animate-glow-pulse {
    animation: glowPulse 2s ease-in-out infinite;
  }
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
    50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); }
  }
  ```

### 6. **Moving Border/Shimmer** (`@aceternity/moving-border`)
- **Location**: CTA buttons and interactive elements
- **Implementation**: CSS ::before pseudo-element with shimmer animation
- **Features**:
  ```css
  .shimmer-effect::before {
    content: '';
    position: absolute;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    animation: shimmer 3s infinite;
  }
  ```

## Styling Patterns Adapted

### Glassmorphism Cards
Based on Aceternity's card components:
```css
.glass-card {
  background: rgba(26, 26, 36, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(99, 102, 241, 0.2);
}
```

### Dark Theme Colors
Inspired by Aceternity's dark mode:
- Background: `#0a0a0f` (dark-900)
- Card backgrounds: `rgba(26, 26, 36, 0.95)`
- Accent colors: Indigo (#6366f1), Purple (#8b5cf6), Cyan (#06b6d4)

### Animations
All animations follow Aceternity's smooth, professional style:
- Fade-in: 0.6s ease-out
- Slide-up: 0.7s ease-out
- Hover transitions: 200-300ms with cubic-bezier easing

## Why HTML Adaptation?

Since the wireframes are standalone HTML files (not React/Next.js), I adapted the Aceternity component **styles and patterns** rather than using the actual React components. The visual result achieves the same modern SaaS aesthetic as Aceternity UI.

## To Use Actual React Components

To use the real Aceternity React components, you would need to:
1. Convert the HTML files to a React/Next.js project
2. Run: `npx shadcn@latest add @aceternity/spotlight`
3. Import and use the components as JSX

## Summary

**Components Referenced**: 6 Aceternity UI components
**Implementation Method**: CSS/HTML adaptation maintaining Aceternity's visual design language
**Result**: Modern dark SaaS theme matching Aceternity UI aesthetic
