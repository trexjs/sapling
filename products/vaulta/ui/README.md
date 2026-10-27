# Document Master UI

A modern React application for document management with a beautiful and intuitive user interface.

## Features

- 🔐 **Authentication** - Secure login and registration
- 📁 **File Management** - Upload, download, organize files
- 📂 **Folder Management** - Create and manage folders
- 🔍 **Search** - Find files and folders quickly
- ⭐ **Starring** - Mark important items
- 🔗 **Sharing** - Share files and folders with others
- 🗑️ **Bin Management** - Recover deleted items
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Styled Components** - CSS-in-JS styling
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Dropzone** - File upload with drag & drop
- **React Icons** - Beautiful icon library

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Document Master API server running

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
# Create .env file with the following content:
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Document Master
VITE_APP_VERSION=1.0.0
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Common/         # Common components (Button, Input, etc.)
│   ├── Layout/         # Layout components (Header, Sidebar, etc.)
│   └── Upload/         # File upload components
├── contexts/           # React contexts (Auth, etc.)
├── pages/              # Page components
├── services/           # API services
├── styles/             # Global styles and theme
├── types/              # TypeScript type definitions
├── App.tsx             # Main app component
└── main.tsx            # App entry point
```

## API Integration

The UI integrates with the Document Master API endpoints:

- **Authentication**: `/api/auth/*`
- **Files**: `/api/files/*`
- **Folders**: `/api/folders/*`
- **Search**: `/api/search/*`
- **Sharing**: `/api/share/*`
- **Starring**: `/api/star/*`
- **Bin**: `/api/bin/*`

## Styling

The application uses styled-components with a comprehensive theme system:

- **Colors**: Primary, secondary, success, warning, error
- **Typography**: Font families, sizes, weights
- **Spacing**: Consistent spacing scale
- **Breakpoints**: Responsive design breakpoints
- **Shadows**: Elevation system

## Components

### Common Components
- `Button` - Styled button with variants
- `Input` - Form input with validation
- `LoadingSpinner` - Loading indicator

### Layout Components
- `Header` - Top navigation bar
- `Sidebar` - Side navigation menu
- `Layout` - Main layout wrapper

### Upload Components
- `FileUpload` - Drag & drop file upload

## Authentication

The app uses JWT tokens for authentication:
- Tokens are stored in localStorage
- Automatic token refresh
- Protected routes
- Auth context for state management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.