# Document Master API

A comprehensive file management API similar to Google Drive, supporting 4-level hierarchical folder structure, file operations, sharing, and more.

## Features

- **4-Level Hierarchical Structure**: Create folders up to 4 levels deep
- **File Management**: Upload, download, rename, copy, move, and delete files
- **Folder Management**: Create, navigate, rename, move, and delete folders
- **Storage Options**: Local storage for development, AWS S3 for production
- **User Authentication**: JWT-based authentication system
- **File Sharing**: Share files and folders with other users
- **Starring System**: Mark important files and folders as favorites
- **Bin System**: Trash system with automatic cleanup after 30 days
- **Search**: Full-text search across files and folders
- **Recent Items**: Track recently accessed items
- **Rate Limiting**: Built-in rate limiting for API protection
- **Security**: Helmet.js for security headers, CORS support

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- AWS S3 account (for production)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd document-master
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp config/env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=local
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/dm_db
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   
   # For production (AWS S3)
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=dm-core
   
   # For development (Local storage)
   LOCAL_STORAGE_PATH=./dm-core-storage
   ```

4. **Start the server**
   ```bash
   # For local development
   npm run dm-core-local
   
   # For production
   npm run dm-core-prod
   
   # Default start
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/dm/auth/register` - Register a new user
- `POST /api/dm/auth/login` - Login user
- `GET /api/dm/auth/profile` - Get user profile
- `PUT /api/dm/auth/profile` - Update user profile
- `PUT /api/dm/auth/change-password` - Change password

### Files
- `POST /api/dm/files/upload` - Upload a file
- `GET /api/dm/files/:fileId/download` - Download a file
- `GET /api/dm/files/:fileId/info` - Get file information
- `PUT /api/dm/files/:fileId/rename` - Rename a file
- `POST /api/dm/files/:fileId/copy` - Copy a file
- `POST /api/dm/files/:fileId/move` - Move a file
- `DELETE /api/dm/files/:fileId` - Delete a file

### Folders
- `POST /api/dm/folders` - Create a folder
- `GET /api/dm/folders` - Get root folder contents
- `GET /api/dm/folders/:folderId` - Get folder information
- `GET /api/dm/folders/:folderId/contents` - Get folder contents
- `PUT /api/dm/folders/:folderId/rename` - Rename a folder
- `POST /api/dm/folders/:folderId/move` - Move a folder
- `DELETE /api/dm/folders/:folderId` - Delete a folder

### Bin (Trash)
- `GET /api/dm/bin` - Get bin items
- `POST /api/dm/bin/:binItemId/restore` - Restore item from bin
- `DELETE /api/dm/bin/:binItemId` - Permanently delete item
- `DELETE /api/dm/bin` - Empty entire bin

### Search
- `GET /api/dm/search` - Search items by name
- `GET /api/dm/search/recent` - Get recent items
- `GET /api/dm/search/starred` - Get starred items

### Sharing
- `POST /api/dm/share/share` - Share an item
- `GET /api/dm/share/shared-with-me` - Get items shared with me
- `GET /api/dm/share/my-shared` - Get items I've shared
- `PUT /api/dm/share/share/:shareId/permissions` - Update share permissions
- `DELETE /api/dm/share/share/:shareId` - Revoke share
- `GET /api/dm/share/access/:shareToken` - Access shared item

### Starring
- `POST /api/dm/star/:itemType/:itemId` - Toggle star status
- `GET /api/dm/star` - Get starred items

### Health Check
- `GET /api/dm/health` - API health check

## Testing with Postman

1. Import the Postman collection from `postman/Document_Master_API.postman_collection.json`
2. Set the `baseUrl` variable to `http://localhost:5000/api/dm`
3. Start with the Authentication endpoints to register/login
4. The collection includes automatic token management

## File Structure

```
src/
├── controllers/          # Route controllers
│   ├── authController.js
│   ├── fileController.js
│   ├── folderController.js
│   ├── binController.js
│   ├── searchController.js
│   ├── shareController.js
│   └── starController.js
├── middleware/           # Custom middleware
│   ├── auth.js
│   ├── validation.js
│   └── rateLimiter.js
├── models/              # Database models
│   ├── User.js
│   ├── File.js
│   ├── Folder.js
│   ├── Bin.js
│   └── Share.js
├── routes/              # API routes
│   ├── auth.js
│   ├── files.js
│   ├── folders.js
│   ├── bin.js
│   ├── search.js
│   ├── share.js
│   ├── star.js
│   └── index.js
├── utils/               # Utility functions
│   └── storageService.js
└── server.js            # Main server file

config/
├── constants.js         # Application constants
└── env.example          # Environment variables example

postman/
└── Document_Master_API.postman_collection.json
```

## Storage Configuration

### Local Storage (Development)
- Files are stored in `./dm-core-storage` directory
- Organized by user ID and folder structure
- No additional setup required

### AWS S3 (Production)
- Configure AWS credentials in environment variables
- Create an S3 bucket named `dm-core` (or update the bucket name)
- Files are stored with proper ACL settings

## Database Schema

### User
- Authentication and profile information
- Storage quota tracking

### File
- File metadata and storage information
- Sharing and permissions
- Starring and access tracking

### Folder
- Hierarchical folder structure (up to 4 levels)
- Path and level tracking
- Sharing and permissions

### Bin
- Deleted items tracking
- Automatic cleanup after 30 days

### Share
- Sharing relationships and permissions
- Access tracking and expiration

## Security Features

- JWT-based authentication
- Rate limiting on all endpoints
- Helmet.js for security headers
- CORS configuration
- Input validation and sanitization
- File type and size restrictions

## Error Handling

The API returns consistent error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Rate Limiting

- General API: 100 requests per 15 minutes
- Upload: 50 uploads per hour
- Authentication: 5 attempts per 15 minutes

## Auto-cleanup

The system automatically runs a cleanup process daily to permanently delete items from the bin that have exceeded the 30-day retention period.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
