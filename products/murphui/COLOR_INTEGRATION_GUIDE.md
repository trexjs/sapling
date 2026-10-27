# 🎨 Color System Integration Guide

## Overview

A comprehensive color palette with **23 color families** and **11 shades each** (253 total colors), inspired by shadcn/ui and Tailwind CSS.

---

## 🚀 Quick Start

### 1. Import Colors

```typescript
// Import all colors
import { colors } from "xlox-ui";

// Import specific colors
import { blue, red, green, purple } from "xlox-ui";

// Import helper function
import { getColor } from "xlox-ui";

// Import types
import type { ColorName, ColorShade } from "xlox-ui";
```

### 2. Use in Components

```tsx
import { blue, green } from "xlox-ui";

// Direct usage
<Button style={{ backgroundColor: blue[500] }}>
  Primary Button
</Button>

// In styled components
const StyledCard = styled.div`
  background-color: ${blue[50]};
  border: 1px solid ${blue[200]};
  color: ${blue[900]};
`;
```

### 3. Explore Colors

```tsx
import { ColorShowcase } from "xlox-ui";

// Show all 23 color families
<ColorShowcase showAllColors />

// Show specific color
<ColorShowcase colorName="blue" />
```

---

## 📊 Available Colors

### **Grays (5)**
- `slate` - Cool gray
- `gray` - Neutral gray
- `zinc` - Warm gray
- `neutral` - True gray
- `stone` - Warm neutral

### **Reds & Oranges (3)**
- `red` - Pure red
- `orange` - Energetic orange
- `amber` - Warm amber

### **Yellows & Greens (4)**
- `yellow` - Bright yellow
- `lime` - Yellow-green
- `green` - Pure green
- `emerald` - Rich emerald

### **Cyans & Blues (4)**
- `teal` - Blue-green
- `cyan` - Bright cyan
- `sky` - Light blue
- `blue` - Pure blue

### **Purples (4)**
- `indigo` - Deep blue-purple
- `violet` - Purple with blue
- `purple` - Pure purple
- `fuchsia` - Bright magenta

### **Pinks (2)**
- `pink` - Soft pink
- `rose` - Warm rose

---

## 🎯 Shade Guide

| Shade | Usage | Example |
|-------|-------|---------|
| **50** | Subtle backgrounds | `blue[50]` |
| **100** | Light backgrounds | `blue[100]` |
| **200** | Borders, dividers | `blue[200]` |
| **300** | Disabled states | `blue[300]` |
| **400** | Secondary elements | `blue[400]` |
| **500** | **Primary (default)** | `blue[500]` |
| **600** | Hover states | `blue[600]` |
| **700** | Active states | `blue[700]` |
| **800** | High contrast | `blue[800]` |
| **900** | Strong emphasis | `blue[900]` |
| **950** | Maximum contrast | `blue[950]` |

---

## 💡 Common Patterns

### **Buttons**
```tsx
import { blue } from "xlox-ui";

const Button = styled.button`
  background-color: ${blue[500]};
  color: white;
  
  &:hover {
    background-color: ${blue[600]};
  }
  
  &:active {
    background-color: ${blue[700]};
  }
  
  &:disabled {
    background-color: ${blue[300]};
  }
`;
```

### **Cards**
```tsx
import { slate } from "xlox-ui";

const Card = styled.div`
  background-color: white;
  border: 1px solid ${slate[200]};
  border-radius: 8px;
  
  &:hover {
    border-color: ${slate[300]};
    box-shadow: 0 4px 6px ${slate[100]};
  }
`;
```

### **Alerts**
```tsx
import { green, red, amber, blue } from "xlox-ui";

const SuccessAlert = styled.div`
  background-color: ${green[50]};
  border-left: 4px solid ${green[500]};
  color: ${green[900]};
`;

const ErrorAlert = styled.div`
  background-color: ${red[50]};
  border-left: 4px solid ${red[500]};
  color: ${red[900]};
`;

const WarningAlert = styled.div`
  background-color: ${amber[50]};
  border-left: 4px solid ${amber[500]};
  color: ${amber[900]};
`;

const InfoAlert = styled.div`
  background-color: ${blue[50]};
  border-left: 4px solid ${blue[500]};
  color: ${blue[900]};
`;
```

### **Text Colors**
```tsx
import { slate } from "xlox-ui";

const Text = {
  primary: slate[900],
  secondary: slate[600],
  disabled: slate[400],
  hint: slate[500],
};
```

### **Backgrounds**
```tsx
import { slate } from "xlox-ui";

const Backgrounds = {
  page: slate[50],
  card: "white",
  subtle: slate[100],
  hover: slate[100],
};
```

---

## 🎨 Using with Existing Components

### **Update Button Component**
```tsx
import { blue, red, green } from "xlox-ui";

interface ButtonProps {
  variant?: "primary" | "success" | "error";
}

const Button = styled.button<ButtonProps>`
  background-color: ${(props) => {
    switch (props.variant) {
      case "success":
        return green[500];
      case "error":
        return red[500];
      default:
        return blue[500];
    }
  }};
  
  &:hover {
    background-color: ${(props) => {
      switch (props.variant) {
        case "success":
          return green[600];
        case "error":
          return red[600];
        default:
          return blue[600];
      }
    }};
  }
`;
```

### **Update Alert Component**
```tsx
import { green, red, amber, blue } from "xlox-ui";

interface AlertProps {
  severity?: "success" | "error" | "warning" | "info";
}

const Alert = styled.div<AlertProps>`
  ${(props) => {
    const colorMap = {
      success: green,
      error: red,
      warning: amber,
      info: blue,
    };
    
    const colors = colorMap[props.severity || "info"];
    
    return `
      background-color: ${colors[50]};
      border-color: ${colors[500]};
      color: ${colors[900]};
    `;
  }}
`;
```

---

## 🌈 Color Combinations

### **Complementary**
```tsx
// Blue + Orange
primary: blue[500]
accent: orange[500]

// Purple + Yellow
primary: purple[500]
accent: yellow[500]
```

### **Analogous**
```tsx
// Blue family
primary: blue[500]
secondary: sky[500]
tertiary: cyan[500]

// Green family
primary: green[500]
secondary: emerald[500]
tertiary: teal[500]
```

### **Monochromatic**
```tsx
// Different shades of blue
lightest: blue[100]
light: blue[300]
base: blue[500]
dark: blue[700]
darkest: blue[900]
```

---

## 🔧 Helper Functions

### **Get Color by Name**
```typescript
import { getColor } from "xlox-ui";

const primaryColor = getColor("blue", 500); // "#3b82f6"
const hoverColor = getColor("blue", 600);   // "#2563eb"
```

### **Dynamic Color Selection**
```tsx
import { colors, type ColorName } from "xlox-ui";

interface ThemedComponentProps {
  color?: ColorName;
}

const ThemedComponent: React.FC<ThemedComponentProps> = ({ 
  color = "blue" 
}) => {
  return (
    <div style={{ backgroundColor: colors[color][500] }}>
      Themed Content
    </div>
  );
};

// Usage
<ThemedComponent color="purple" />
<ThemedComponent color="green" />
```

---

## 📱 Responsive Color Usage

```tsx
import { blue, slate } from "xlox-ui";

const ResponsiveCard = styled.div`
  background-color: ${blue[50]};
  
  @media (prefers-color-scheme: dark) {
    background-color: ${slate[900]};
    color: ${slate[50]};
  }
`;
```

---

## ♿ Accessibility

### **Contrast Ratios**
- **AA (Normal text)**: 4.5:1 minimum
- **AA (Large text)**: 3:1 minimum
- **AAA (Normal text)**: 7:1 minimum

### **Recommended Combinations**
```tsx
// Good contrast (AA compliant)
background: blue[500]
text: white

background: blue[50]
text: blue[900]

background: white
text: slate[900]

// Avoid low contrast
background: blue[100]  // ❌
text: blue[200]        // ❌ Too similar
```

---

## 🎨 ColorShowcase Component

Interactive color explorer:

```tsx
import { ColorShowcase } from "xlox-ui";

// Show all colors
<ColorShowcase showAllColors />

// Show specific color family
<ColorShowcase colorName="blue" />
<ColorShowcase colorName="purple" />
<ColorShowcase colorName="green" />
```

**Features:**
- Click any swatch to copy hex code
- Automatic text contrast
- Responsive grid layout
- All 253 colors available

---

## 📦 Export Structure

```typescript
// From xlox-ui
export {
  colors,           // All color families
  getColor,         // Helper function
  // Individual colors
  slate, gray, zinc, neutral, stone,
  red, orange, amber, yellow, lime,
  green, emerald, teal, cyan, sky,
  blue, indigo, violet, purple,
  fuchsia, pink, rose,
};

export type {
  ColorName,        // "blue" | "red" | ...
  ColorShade,       // 50 | 100 | ... | 950
  ColorShades,      // Interface for shade object
};
```

---

## ✅ Best Practices

1. **Use semantic naming**
   ```tsx
   const primary = blue[500];
   const success = green[500];
   const error = red[500];
   ```

2. **Maintain consistency**
   - Use same color family for related elements
   - Use consistent shade progression

3. **Test accessibility**
   - Check contrast ratios
   - Test with screen readers
   - Verify color blindness compatibility

4. **Use appropriate shades**
   - 50-200: Backgrounds
   - 300-400: Borders, disabled states
   - 500-600: Primary actions
   - 700-950: Text, emphasis

5. **Consider dark mode**
   - Invert shade scale for dark mode
   - Test both themes

---

## 🚀 Next Steps

1. ✅ Import colors in your components
2. ✅ Use ColorShowcase to explore
3. ✅ Update existing components
4. ✅ Test accessibility
5. ✅ Document your color choices

---

**Complete color system with 253 colors ready to use! 🎨**
