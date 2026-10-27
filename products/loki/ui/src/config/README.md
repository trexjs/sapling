# Configuration Manager

A React + TypeScript + styled-components application for managing Harbor configuration buckets with semantic versioning.

## Features

- **Configuration Management**: Create, edit, and view configuration buckets
- **Semantic Versioning**: Automatic version bumping (major, minor, patch)
- **JSON Editor**: Built-in JSON editor with validation
- **Configuration Fetching**: Fetch configurations by name
- **Real-time Updates**: Automatic refresh after operations
- **Modern UI**: Clean, responsive interface with styled-components

## API Integration

This application integrates with all Config service endpoints:

- `POST /api/config` - Create new configuration
- `GET /api/config/:name/latest` - Get latest configuration by name
- `PUT /api/config/:name` - Update configuration with version bump

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Harbor server running on port 5000

### Installation

1. Navigate to the Config app directory:
   ```bash
   cd ui/apps/config
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3002`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # React components
│   ├── ConfigCard.tsx  # Individual config display card
│   ├── ConfigForm.tsx  # Create/edit config form
│   ├── ConfigList.tsx  # List of all configs
│   ├── ConfigViewer.tsx # Full config viewer
│   └── ConfigFetcher.tsx # Config fetching interface
├── context/            # React context
│   └── ConfigContext.tsx # Config state management
├── services/           # API services
│   └── api.ts         # Config API integration
├── types/             # TypeScript type definitions
│   └── index.ts       # Config data types
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## Usage

### Creating a Configuration

1. Click the "Create New Config" button
2. Fill in the configuration details:
   - **Name**: Unique identifier for the configuration bucket
   - **Version Bump Type**: Choose how to increment the version
   - **Configuration Data**: Valid JSON data

### Editing a Configuration

1. Click the "Edit" button on any configuration card
2. Modify the JSON data
3. Choose the version bump type
4. Click "Update Configuration"

### Viewing a Configuration

1. Click the "View" button on any configuration card
2. See full configuration details including metadata
3. Copy JSON data to clipboard
4. Edit directly from the viewer

### Fetching a Configuration

1. Use the "Fetch Configuration" section at the top
2. Enter the configuration name
3. Click "Fetch Config" to load and display the configuration

## API Endpoints

The application communicates with the following Config endpoints:

### Create Configuration
```
POST /api/config
Content-Type: application/json

{
  "name": "app-settings",
  "data": {
    "theme": "dark",
    "language": "en",
    "features": {
      "notifications": true,
      "analytics": false
    }
  },
  "bumpType": "minor"
}
```

### Get Latest Configuration
```
GET /api/config/{name}/latest
```

### Update Configuration
```
PUT /api/config/{name}
Content-Type: application/json

{
  "data": {
    "theme": "light",
    "language": "en",
    "features": {
      "notifications": true,
      "analytics": true
    }
  },
  "bumpType": "patch"
}
```

## Version Bumping

The application supports semantic versioning with three bump types:

- **Patch** (1.0.0 → 1.0.1): Bug fixes and small changes
- **Minor** (1.0.0 → 1.1.0): New features, backward compatible
- **Major** (1.0.0 → 2.0.0): Breaking changes

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **styled-components** - CSS-in-JS styling
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API calls

## Configuration

The application is configured to proxy API requests to `http://localhost:5000` during development. This can be modified in `vite.config.ts`:

```typescript
server: {
  port: 3002,
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
}
```

## Data Structure

Configurations are stored with the following structure:

```typescript
interface Config {
  _id?: string;
  name: string;           // Unique configuration bucket name
  data: Record<string, any>; // JSON configuration data
  version: string;        // Semantic version (e.g., "1.2.3")
  createdAt?: string;     // Creation timestamp
  updatedAt?: string;     // Last update timestamp
}
```

## Troubleshooting

### Common Issues

1. **API Connection Error**: Ensure the Harbor server is running on port 5000
2. **JSON Validation Error**: Check that your configuration data is valid JSON
3. **Build Errors**: Check TypeScript types and ensure all dependencies are installed
4. **Styling Issues**: Verify styled-components is properly configured

### Error Handling

The application includes comprehensive error handling:
- Network errors are displayed to users
- JSON validation prevents invalid submissions
- Loading states provide user feedback
- Error messages are dismissible

## Best Practices

1. **Configuration Naming**: Use descriptive, kebab-case names (e.g., `app-settings`, `user-preferences`)
2. **JSON Structure**: Keep configuration data well-structured and documented
3. **Version Bumping**: Use appropriate bump types based on the nature of changes
4. **Data Size**: Keep configuration data reasonably sized for optimal performance
