## Navigation Click Issue - Fixed

**Problem:** Strategy buttons weren't clickable. No hover/click response.

**Root Cause:** .strategy-card::before CSS pseudo-element (gradient border) covered entire card with position: absolute; inset: 0;, blocking clicks.

**Fix:** Added pointer-events: none; to .strategy-card::before in index.css:104

**Result:** Clicks pass through to buttons. Navigation works.
