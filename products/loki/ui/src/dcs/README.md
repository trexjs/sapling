# DCS Flag Manager

A React + TypeScript + styled-components application for managing DCS (Dynamic Configuration Service) flags.

## Features

- **Flag Management**: Create, edit, and view DCS flags
- **Account Mapping**: Map flags to specific tenant accounts
- **Status Checking**: Check flag status for specific tenants
- **Real-time Updates**: Automatic refresh after operations
- **Modern UI**: Clean, responsive interface with styled-components

## API Integration

This application integrates with all DCS service endpoints:

- `GET /api/dcs/flags` - Get all flags
- `GET /api/dcs/status?flag={name}&tenant={id}` - Check flag status
- `POST /api/dcs` - Create or update flag
- `PUT /api/dcs/map` - Map flag to accounts

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Harbor server running on port 5000

### Installation

1. Navigate to the DCS app directory:
   ```bash
   cd ui/apps/dcs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3001`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # React components
│   ├── FlagCard.tsx    # Individual flag display card
│   ├── FlagForm.tsx    # Create/edit flag form
│   ├── FlagList.tsx    # List of all flags
│   ├── AccountMappingModal.tsx  # Account mapping interface
│   └── StatusChecker.tsx        # Flag status checker
├── context/            # React context
│   └── DCSContext.tsx  # DCS state management
├── services/           # API services
│   └── api.ts         # DCS API integration
├── types/             # TypeScript type definitions
│   └── index.ts       # DCS data types
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

## Usage

### Creating a Flag

1. Click the "Create New Flag" button
2. Fill in the flag details:
   - **Name**: Unique identifier for the flag
   - **Expiry**: Time duration (e.g., "1hr", "30days")
   - **Type**: EXP (with expiry) or NO_EXP (no expiry)
   - **POC**: Point of contact information
   - **Associated Accounts**: Comma-separated account IDs
   - **Status**: Active/inactive toggle

### Editing a Flag

1. Click the "Edit" button on any flag card
2. Modify the desired fields
3. Click "Update Flag"

### Mapping Accounts

1. Click the "Map Accounts" button on any flag card
2. Update the associated accounts list
3. Toggle the active status
4. Click "Update Mapping"

### Checking Flag Status

1. Use the "Check Flag Status" section at the top
2. Enter the flag name and tenant ID
3. Click "Check Status" to see if the flag is active for that tenant

## API Endpoints

The application communicates with the following DCS endpoints:

### Get All Flags
```
GET /api/dcs/flags
```

### Check Flag Status
```
GET /api/dcs/status?flag={flagName}&tenant={tenantId}
```

### Create/Update Flag
```
POST /api/dcs
Content-Type: application/json

{
  "name": "flagName",
  "exp": "1hr",
  "type": "EXP",
  "poc": {
    "name": "John Doe",
    "escalation_mail": "john@example.com",
    "oncall_id": "oncall123"
  },
  "associated_accounts": ["school_001", "school_002"],
  "status": true
}
```

### Map Flag to Accounts
```
PUT /api/dcs/map
Content-Type: application/json

{
  "name": "flagName",
  "associated_accounts": ["school_001", "school_002"],
  "status": true
}
```

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
  port: 3001,
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
}
```

## Troubleshooting

### Common Issues

1. **API Connection Error**: Ensure the Harbor server is running on port 5000
2. **Build Errors**: Check TypeScript types and ensure all dependencies are installed
3. **Styling Issues**: Verify styled-components is properly configured

### Error Handling

The application includes comprehensive error handling:
- Network errors are displayed to users
- Form validation prevents invalid submissions
- Loading states provide user feedback
