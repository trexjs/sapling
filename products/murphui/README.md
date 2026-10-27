# Xlox UI - React Component Library

A comprehensive, accessible, and themeable React component library following the Xlox design system.

## 🚀 Quick Start

### Installation

```bash
npm install xlox-ui
```

### Usage

```tsx
import { XloxThemeProvider, Button, Box } from "xlox-ui";

function App() {
  return (
    <XloxThemeProvider>
      <Box padding={4}>
        <Button variant="primary">Click me</Button>
      </Box>
    </XloxThemeProvider>
  );
}
```

## 📦 Development

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Run Storybook

```bash
npm run storybook
```

### Run Tests

```bash
npm test
```

### Build Library

```bash
npm run build
```

## 📚 Documentation

For full documentation, visit [Storybook](http://localhost:6006) after running `npm run storybook`.

## 🎨 Components

### Layout
- Box
- Container
- Grid
- Stack

### Buttons
- Button
- IconButton
- LoadingButton

### Forms
- Input
- Select
- Checkbox
- Radio
- Switch

### Data Display
- Table
- Card
- Badge
- Avatar

### Feedback
- Alert
- Toast
- Modal
- Progress

## 🎨 Theming

```tsx
import { XloxThemeProvider } from "xlox-ui";

function App() {
  return (
    <XloxThemeProvider defaultMode="dark">
      {/* Your app */}
    </XloxThemeProvider>
  );
}
```

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

See [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) for development roadmap.
