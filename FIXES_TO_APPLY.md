# Critical Fixes Needed

## Issues Identified:
1. **HUD overlay not visible** - Background opacity blocks the tech grid
2. **Cramped spacing** - Padding too tight everywhere
3. **Sidebar misalignment** - Sidebar lower than main content
4. **Container too constrained** - Content feels squeezed

## Root Causes:
- Line 324: `#main-outlet { background: rgba(22, 30, 33, 0.6) !important; }` blocks HUD
- Line 1046: Duplicate background on `#main > div #main-outlet`
- Line 1038: Padding causing cramping
- Sidebar missing `align-self: flex-start`

## Solution:
Remove opaque backgrounds from main containers, only apply glass to content cards
