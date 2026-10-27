# 🎨 Xlox UI Color System

A comprehensive color palette inspired by shadcn/ui with 23 color families, each with 11 shades.

---

## 📊 **Color Palette Overview**

### **Total Colors: 23 families × 11 shades = 253 colors**

---

## 🎨 **Color Families**

### **Grays (5 families)**
1. **Slate** - Cool gray with blue undertones
2. **Gray** - Neutral gray, balanced
3. **Zinc** - Warm gray with slight warmth
4. **Neutral** - True gray, no color bias
5. **Stone** - Warm neutral with brown undertones

### **Reds & Oranges (3 families)**
6. **Red** - Pure red, vibrant
7. **Orange** - Energetic orange
8. **Amber** - Warm amber/gold

### **Yellows & Greens (4 families)**
9. **Yellow** - Bright yellow
10. **Lime** - Yellow-green, fresh
11. **Green** - Pure green
12. **Emerald** - Rich emerald green

### **Cyans & Blues (4 families)**
13. **Teal** - Blue-green, calming
14. **Cyan** - Bright cyan
15. **Sky** - Light blue, airy
16. **Blue** - Pure blue

### **Purples (4 families)**
17. **Indigo** - Deep blue-purple
18. **Violet** - Purple with blue
19. **Purple** - Pure purple
20. **Fuchsia** - Bright magenta-purple

### **Pinks (3 families)**
21. **Pink** - Soft pink
22. **Rose** - Warm rose pink

---

## 📐 **Shade Scale**

Each color family has 11 shades:

| Shade | Usage | Lightness |
|-------|-------|-----------|
| **50** | Backgrounds, subtle highlights | Lightest |
| **100** | Hover states, light backgrounds | Very light |
| **200** | Borders, dividers | Light |
| **300** | Disabled states, placeholders | Medium-light |
| **400** | Secondary text, icons | Medium |
| **500** | **Primary color** (default) | Base |
| **600** | Hover states for primary | Medium-dark |
| **700** | Active states, emphasis | Dark |
| **800** | High contrast text | Very dark |
| **900** | Headers, strong emphasis | Darkest |
| **950** | Maximum contrast | Ultra dark |

---

## 💻 **Usage**

### **Import Colors**

```typescript
// Import all colors
import { colors } from "@/theme/colors";

// Import specific color families
import { blue, red, green } from "@/theme/colors";

// Import types
import type { ColorName, ColorShade } from "@/theme/colors";

// Use helper function
import { getColor } from "@/theme/colors";
```

### **Using Colors in Components**

```tsx
import { blue, red } from "@/theme/colors";

// Direct usage
<Box style={{ backgroundColor: blue[500] }}>
  Primary Blue
</Box>

// With styled components
const StyledButton = styled.button`
  background-color: ${blue[500]};
  color: white;
  
  &:hover {
    background-color: ${blue[600]};
  }
`;

// Using helper function
import { getColor } from "@/theme/colors";

const color = getColor("blue", 500); // "#3b82f6"
```

### **Dynamic Color Selection**

```tsx
import { colors, type ColorName } from "@/theme/colors";

interface ButtonProps {
  color?: ColorName;
}

const Button: React.FC<ButtonProps> = ({ color = "blue" }) => {
  return (
    <button style={{ backgroundColor: colors[color][500] }}>
      Click me
    </button>
  );
};
```

---

## 🎨 **Color Showcase Component**

Display and explore colors interactively:

```tsx
import { ColorShowcase } from "@/components/ColorShowcase";

// Show all colors
<ColorShowcase showAllColors />

// Show specific color family
<ColorShowcase colorName="blue" />
<ColorShowcase colorName="purple" />
```

**Features:**
- ✅ Click any swatch to copy hex code
- ✅ Hover to see scale effect
- ✅ Automatic text color contrast
- ✅ Responsive grid layout

---

## 🎯 **Recommended Usage**

### **UI Elements**

```tsx
// Primary actions
backgroundColor: blue[500]
hoverColor: blue[600]
activeColor: blue[700]

// Success states
backgroundColor: green[500]
borderColor: green[600]

// Error states
backgroundColor: red[500]
textColor: red[700]

// Warning states
backgroundColor: amber[500]
textColor: amber[900]

// Info states
backgroundColor: sky[500]
textColor: sky[900]
```

### **Text Colors**

```tsx
// Primary text
color: slate[900]  // Light mode
color: slate[50]   // Dark mode

// Secondary text
color: slate[600]  // Light mode
color: slate[400]  // Dark mode

// Disabled text
color: slate[400]  // Light mode
color: slate[600]  // Dark mode
```

### **Backgrounds**

```tsx
// Page background
backgroundColor: slate[50]   // Light mode
backgroundColor: slate[950]  // Dark mode

// Card background
backgroundColor: white        // Light mode
backgroundColor: slate[900]  // Dark mode

// Subtle background
backgroundColor: slate[100]  // Light mode
backgroundColor: slate[800]  // Dark mode
```

### **Borders**

```tsx
// Default border
borderColor: slate[200]  // Light mode
borderColor: slate[700]  // Dark mode

// Focus border
borderColor: blue[500]

// Error border
borderColor: red[500]
```

---

## 🌈 **Color Combinations**

### **Complementary Pairs**
- Blue (500) + Orange (500)
- Purple (500) + Yellow (500)
- Green (500) + Red (500)
- Cyan (500) + Rose (500)

### **Analogous Triads**
- Blue (500) + Cyan (500) + Teal (500)
- Red (500) + Orange (500) + Amber (500)
- Green (500) + Lime (500) + Emerald (500)
- Purple (500) + Violet (500) + Fuchsia (500)

### **Monochromatic Schemes**
Use different shades of the same color:
- Blue: 100, 300, 500, 700, 900
- Purple: 100, 300, 500, 700, 900
- Green: 100, 300, 500, 700, 900

---

## 📋 **Quick Reference**

### **Common Colors**

```typescript
// Primary
blue[500]      // #3b82f6

// Success
green[500]     // #22c55e
emerald[500]   // #10b981

// Warning
amber[500]     // #f59e0b
yellow[500]    // #eab308

// Error
red[500]       // #ef4444
rose[500]      // #f43f5e

// Info
sky[500]       // #0ea5e9
cyan[500]      // #06b6d4

// Neutral
slate[500]     // #64748b
gray[500]      // #6b7280
zinc[500]      // #71717a
```

---

## 🎨 **All Color Hex Values**

### **Slate**
```
50:  #f8fafc    500: #64748b    950: #020617
100: #f1f5f9    600: #475569
200: #e2e8f0    700: #334155
300: #cbd5e1    800: #1e293b
400: #94a3b8    900: #0f172a
```

### **Blue**
```
50:  #eff6ff    500: #3b82f6    950: #172554
100: #dbeafe    600: #2563eb
200: #bfdbfe    700: #1d4ed8
300: #93c5fd    800: #1e40af
400: #60a5fa    900: #1e3a8a
```

### **Green**
```
50:  #f0fdf4    500: #22c55e    950: #052e16
100: #dcfce7    600: #16a34a
200: #bbf7d0    700: #15803d
300: #86efac    800: #166534
400: #4ade80    900: #14532d
```

### **Red**
```
50:  #fef2f2    500: #ef4444    950: #450a0a
100: #fee2e2    600: #dc2626
200: #fecaca    700: #b91c1c
300: #fca5a5    800: #991b1b
400: #f87171    900: #7f1d1d
```

### **Purple**
```
50:  #faf5ff    500: #a855f7    950: #3b0764
100: #f3e8ff    600: #9333ea
200: #e9d5ff    700: #7e22ce
300: #d8b4fe    800: #6b21a8
400: #c084fc    900: #581c87
```

---

## 🔧 **Integration with Theme**

Update your theme to use the new color system:

```typescript
import { blue, green, red, amber, slate } from "@/theme/colors";

export const theme = {
  colors: {
    primary: blue,
    success: green,
    error: red,
    warning: amber,
    neutral: slate,
    // ... other colors
  }
};
```

---

## ✨ **Benefits**

✅ **Comprehensive** - 253 colors covering all use cases  
✅ **Consistent** - 11 shades per color for perfect gradients  
✅ **Accessible** - Designed for WCAG contrast compliance  
✅ **Flexible** - Use any shade for any purpose  
✅ **Type-safe** - Full TypeScript support  
✅ **Modern** - Inspired by industry-leading design systems  
✅ **Copy-friendly** - Click to copy hex codes  

---

## 🚀 **Getting Started**

1. Import colors in your components
2. Use the ColorShowcase component to explore
3. Pick colors that match your brand
4. Use consistent shades across your app
5. Test for accessibility

---

**Complete color system ready for production! 🎨**
