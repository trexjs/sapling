# Harbor CMS Editor

A React-based Content Management System for Terms and Conditions and Privacy Policy documents.

## Features

- **Rich Text Editor**: Powered by Quill.js for reliable HTML output
- **Version Management**: Automatic version bumping (MINOR/MAJOR)
- **Document Types**: Support for Terms and Conditions and Privacy Policy
- **State Management**: Context API for complex state management
- **TypeScript**: Full type safety
- **Styled Components**: Modern UI with styled-components

## Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB running on localhost:27017

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Usage

1. **Select Document Type**: Choose between "Terms and Conditions" or "Privacy Policy"
2. **Edit Content**: Use the rich text editor to create and edit your document
3. **Set Title**: Enter a descriptive title for your document
4. **Choose Version Bump**: Select MINOR (0.0.0 → 0.1.0) or MAJOR (0.0.0 → 1.0.0)
5. **Save**: Click the "Save Document" button to save your changes

## API Integration

The UI communicates with the backend server running on port 5000. Make sure the server is running before using the editor.

### API Endpoints

- `GET /api/cms/terms-and-conditions` - Get terms and conditions
- `GET /api/cms/privacy-policy` - Get privacy policy
- `POST /api/cms/terms-and-conditions` - Save terms and conditions
- `POST /api/cms/privacy-policy` - Save privacy policy

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Styled Components** - CSS-in-JS styling
- **React Quill** - Rich text editor
- **Axios** - HTTP client
- **Context API** - State management
