# Harbor CMS Setup Instructions

## 🚀 Quick Start

### 1. Start the Server
```bash
cd server
npm start
```
The server will run on `http://localhost:5000`

### 2. Start the UI
```bash
cd ui/apps/editor
npm install  # if not already installed
npm run dev
```
The UI will run on `http://localhost:3000`

## 🔧 What I Fixed

### ✅ **Infinite Loop Issue Resolved**
- Removed problematic `useEffect` dependencies that were causing infinite re-renders
- Simplified the document loading logic
- Added manual "Load Document" button for better control

### ✅ **Server Configuration**
- Added proper CORS middleware
- Updated database name to `editor_db`
- Added health check endpoint
- Improved error handling

### ✅ **UI Improvements**
- Automatic document loading on page mount and document type change
- Smart Save button that's disabled by default and only enables when content changes
- Visual indicator (red dot) shows when there are unsaved changes
- Better error messages when server is not running
- Cleaner state management
- Removed debug console logs

## 🎯 How to Use

1. **Start both server and UI** (see Quick Start above)
2. **Document loads automatically**: The page will automatically load the default document (Terms and Conditions)
3. **Select Document Type**: Choose "Terms and Conditions" or "Privacy Policy" - the document will load automatically
4. **Edit Content**: Use the rich text editor to modify the document
   - Notice the red dot appears next to the Save button when you make changes
   - The Save button becomes enabled only when there are changes
5. **Choose Version Bump**: Select MINOR or MAJOR version increment
6. **Click "Save Document"**: This will save your changes with the new version
   - After saving, the red dot disappears and the button becomes disabled again

## 🐛 Troubleshooting

### Server Connection Issues
- Make sure MongoDB is running on `localhost:27017`
- Check that the server is running on port 5000
- Verify the database name is `editor_db`

### UI Issues
- Make sure the UI is running on port 3000
- Check browser console for any error messages
- Try refreshing the page if the UI seems stuck

### API Errors
- The UI will show helpful error messages if the server is not running
- Check the server console for detailed error logs
- Make sure all dependencies are installed

## 📁 Project Structure
```
harbor/
├── server/                 # Node.js/Express backend
│   ├── src/
│   │   ├── models/        # MongoDB models
│   │   ├── controllers/   # API controllers
│   │   ├── routes/        # API routes
│   │   └── server.js      # Main server file
│   └── package.json
└── ui/apps/editor/        # React frontend
    ├── src/
    │   ├── components/    # React components
    │   ├── context/       # Context API
    │   ├── services/      # API services
    │   └── types/         # TypeScript types
    └── package.json
```

The infinite loop issue should now be completely resolved! 🎉
