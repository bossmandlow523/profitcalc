# Options Calculator Wireframes

This directory contains professional wireframes for the Options Profit Calculator website, created following Flux Academy wireframing best practices.

## 📁 Files

1. **homepage-wireframe.html** - Homepage wireframe
2. **calculator-wireframe.html** - Calculator page wireframe (Long Call example)
3. **README.md** - This documentation file

## 🎯 Wireframe Overview

### Methodology
These wireframes follow the **Low-to-Mid Fidelity** approach:
- **Grayscale color scheme** to focus on structure, not design
- **Grid-based layouts** for proper alignment and spacing
- **Annotations** to explain key UI elements and functionality
- **Placeholder content** to show hierarchy and content placement
- **Interactive elements** to demonstrate dropdown menus and navigation

### Design Principles Applied
Based on Flux Academy best practices:
- ✅ Clear content hierarchy
- ✅ Grid system for alignment
- ✅ User flow consideration
- ✅ Responsive layout structure
- ✅ Focus on UX before visual design

---

## 📄 Page 1: Homepage Wireframe

**File:** `homepage-wireframe.html`

**Source:** https://www.optionsprofitcalculator.com/

### Layout Structure
```
┌─────────────────────────────────────────────────────┐
│                    HEADER                           │
│  Logo | Nav Menu | Social Icons                    │
└─────────────────────────────────────────────────────┘
┌──────────────────────────────┬──────────────────────┐
│                              │                      │
│    MAIN CONTENT AREA         │   RIGHT SIDEBAR      │
│                              │                      │
│  • Page Title                │  • Option Finder CTA │
│  • Description               │  • Updates Section   │
│  • Strategy Grid (4 cols)    │                      │
│    - Basic (6)               │                      │
│    - Spreads (6)             │                      │
│    - Advanced (10)           │                      │
│    - Custom (6)              │                      │
│                              │                      │
└──────────────────────────────┴──────────────────────┘
┌─────────────────────────────────────────────────────┐
│                    FOOTER                           │
│  Links | Copyright                                  │
└─────────────────────────────────────────────────────┘
```

### Key Features
- **4-Column Strategy Grid**: All 28 strategies organized by category
- **Clickable Strategy Titles**: Each strategy links to its calculator
- **Sidebar CTA**: Prominent call-to-action for Option Finder tool
- **Updates Section**: Recent feature additions and announcements
- **Toggle Grid Button**: Shows/hides grid overlay for alignment reference

### Strategy Count
- Basic: 6 strategies
- Spreads: 6 strategies
- Advanced: 10 strategies
- Custom: 6 strategies
- **Total: 28 strategies**

---

## 📄 Page 2: Calculator Wireframe

**File:** `calculator-wireframe.html`

**Source:** https://www.optionsprofitcalculator.com/calculator/long-call.html

### Layout Structure
```
┌──────────────────────────────────────────────────────────┐
│                      HEADER                              │
│  Logo | Nav Menu (with Strategies Dropdown) ▼           │
└──────────────────────────────────────────────────────────┘
┌──────┬───────────────────────────────────────┬──────────┐
│      │                                       │          │
│ LEFT │         MAIN CONTENT                  │  RIGHT   │
│SIDE- │                                       │ SIDEBAR  │
│ BAR  │  • Breadcrumb                         │          │
│      │  • Page Title                         │  • Ads   │
│Saved │  • Description                        │  • Video │
│Calcs │  • Calculator Form                    │  • Ads   │
│      │    - Stock Symbol Input               │          │
│      │    - Option Configuration             │          │
│      │    - Calculate Button                 │          │
│      │  • Results Area                       │          │
│      │    - Chart/Graph Display              │          │
│      │  • FAQ Section                        │          │
│      │                                       │          │
└──────┴───────────────────────────────────────┴──────────┘
┌──────────────────────────────────────────────────────────┐
│                      FOOTER                              │
│  Links | Copyright                                       │
└──────────────────────────────────────────────────────────┘
```

### Key Features

#### Left Sidebar (220px)
- **Current Calculations List**: Shows recently viewed/created calculations
- **Active State**: Highlights current calculation
- **Ad Space**: 300×300 advertising placement

#### Main Content Area (Flex)
- **Breadcrumb Navigation**: Strategy Calculators > Long Call
- **Page Title**: Calculator name with strategy type
- **Description**: Brief explanation of the strategy
- **Calculator Form** (Multi-section):
  1. **Underlying Stock Symbol**
     - Symbol input field
     - Get Price button
     - Current price display
  2. **Option Configuration**
     - Buy/Sell dropdown
     - Option selector (with modal)
     - Price per option input
     - Contracts quantity
     - Total cost calculation
  3. **Calculate Section**
     - Primary Calculate button
     - Stock price range inputs
     - Output options
- **Results Area**:
  - Profit/Loss graph display
  - Chart/Table toggle
- **FAQ Section**: Expandable common questions

#### Right Sidebar (300px)
- **Ad Spaces**: Multiple sizes (300×250, 300×180, 300×600)
- **Video/Media Content**: Embedded media player

### Interactive Elements
- **Dropdown Menu Toggle**: Shows all 28 strategies in 4 columns
- **Form Inputs**: All calculator fields with proper labels
- **Calculate Button**: Primary action button
- **Grid Overlay**: Press button or Ctrl+G to show alignment grid

### User Flow
```
1. Enter Stock Symbol → Get Price
2. Configure Option → Select Strike/Expiry
3. Enter Contracts → Calculate Total Cost
4. Click Calculate → View Results
5. Analyze Chart → Compare Scenarios
```

---

## 🎨 Design Specifications

### Color Palette (Grayscale)
- **Background**: `#f5f5f5` (Light gray)
- **Containers**: `#fafafa` (Off-white)
- **Borders**: `#ddd`, `#999` (Gray shades)
- **Headers**: `#333`, `#666` (Dark gray)
- **Text**: `#333`, `#666`, `#999` (Text hierarchy)
- **Accents**: `#ff6b6b` (Red - for annotations only)

### Typography
- **Font Family**: Arial, sans-serif
- **Sizes**:
  - Headers: 16-20px
  - Body: 12-13px
  - Labels: 11-12px
  - Captions: 10-11px

### Spacing
- **Grid Unit**: 100px (visible when grid overlay is active)
- **Section Padding**: 20-40px
- **Element Gaps**: 10-30px
- **Border Width**: 1-3px

### Layout Dimensions

#### Homepage
- **Max Width**: 1400px
- **Main Content**: 75% (flex: 3)
- **Right Sidebar**: 25% (flex: 1, min-width: 300px)
- **Strategy Columns**: 4 equal columns

#### Calculator Page
- **Max Width**: 1600px
- **Left Sidebar**: 220px (fixed)
- **Main Content**: Flexible
- **Right Sidebar**: 300px (fixed)

---

## 🔧 How to Use These Wireframes

### Viewing
1. Open either HTML file in any modern web browser
2. Files are self-contained with inline CSS
3. No external dependencies required

### Interactive Features
- **Info Panel**: Fixed panel showing wireframe metadata
- **Toggle Grid**: Button to show/hide alignment grid
- **Toggle Dropdown**: (Calculator page) Show the strategy dropdown menu
- **Hover States**: Interactive elements show hover effects

### Keyboard Shortcuts
- **Ctrl + G**: Toggle grid overlay (Calculator page)

---

## 📊 Content Inventory

### All Strategy Titles (28 Total)

#### Basic (6)
1. Long Call
2. Long Put
3. Covered Call
4. Cash Secured Put
5. Naked Call
6. Naked Put

#### Spreads (6)
7. Credit Spread
8. Call Spread
9. Put Spread
10. Poor Man's Covered Call
11. Calendar Spread
12. Ratio Back Spread

#### Advanced (10)
13. Iron Condor
14. Butterfly
15. Collar
16. Diagonal Spread
17. Double Diagonal
18. Straddle
19. Strangle
20. Covered Strangle
21. Synthetic Put
22. Reverse Conversion

#### Custom (6)
23. 8 Legs
24. 6 Legs
25. 5 Legs
26. 4 Legs
27. 3 Legs
28. 2 Legs

---

## 📝 Notes for Developers

### Implementation Considerations
1. **Responsive Design**: Wireframes show desktop layout; mobile views will need adaptation
2. **Navigation**: Dropdown menu should show on hover/click
3. **Form Validation**: All calculator inputs need validation
4. **API Integration**: Stock price fetching and options chain data
5. **Real-time Calculations**: Black-Scholes formula for option pricing
6. **Chart Library**: Consider D3.js, Chart.js, or similar for graphs
7. **State Management**: Calculator settings and results need proper state handling

### Accessibility
- Ensure proper heading hierarchy (h1, h2, h3)
- Add ARIA labels to form controls
- Keyboard navigation support
- Screen reader compatibility
- Color contrast for actual design

### Performance
- Lazy load ad content
- Optimize calculator computation
- Cache frequently accessed option chains
- Minimize re-renders on form changes

---

## 🔗 References

- **Original Site**: https://www.optionsprofitcalculator.com/
- **Wireframe Methodology**: [Flux Academy - 20 Wireframe Examples](https://www.flux-academy.com/blog/20-wireframe-examples-for-web-design)
- **Best Practices**: Low-to-mid fidelity, grayscale, grid-based layout

---

## 📅 Created

**Date**: 2025-10-14
**Created by**: Claude Code
**Version**: 1.0
**Based on**: Original Options Profit Calculator site

---

## 💡 Next Steps

1. **Review wireframes** with stakeholders
2. **Get feedback** on layout and user flow
3. **Create high-fidelity mockups** with actual design
4. **Build interactive prototype** (Figma/Adobe XD)
5. **Develop frontend** based on approved wireframes

---

**Need modifications?** These HTML wireframes are easy to edit - just open in a text editor and adjust the CSS or HTML structure as needed.