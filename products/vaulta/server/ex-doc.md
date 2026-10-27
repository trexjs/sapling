I'll analyze the requirements from the PRD and create a comprehensive Document Master API similar to Google Drive. Let me start by understanding the current project structure and then implement all the necessary APIs.


[5 tools called]

Now I'll start implementing the Document Master API. First, let me update the package.json with the necessary dependencies and scripts, then create the complete project structure.


[2 tools called]

Now let me create the environment configuration and update the server.js file:


[3 tools called]

Now let me create the database models:


[6 tools called]

Now let me create the storage service for handling both local and AWS S3 storage:


[2 tools called]

Now let me create the authentication middleware:


[4 tools called]

Now let me create the controllers for all the operations:


[4 tools called]

Now let me create the remaining controllers:


[5 tools called]

Now let me create the routes:


[8 tools called]

Now let me update the main server.js file and create the main routes:


[2 tools called]

Now let me create the Postman collection with test data:


[2 tools called]

Now let me create a README file with setup instructions and API documentation:


[2 tools called]

Perfect! I have successfully created a comprehensive Document Master API that meets all the requirements from the PRD. Let me provide you with a summary of what has been implemented:

## ✅ Complete Document Master API Implementation

### 🏗️ **Core Architecture**
- **Express.js** server with proper middleware stack
- **MongoDB** with Mongoose for data persistence
- **JWT** authentication system
- **Modular structure** with separate controllers, routes, and middleware

### 📁 **4-Level Hierarchical Structure**
- Implemented with `MAX_HIERARCHY_LEVELS = 4` constant
- Automatic level tracking and validation
- Path management for nested folders
- Prevents exceeding the 4-level limit

### 💾 **Dual Storage System**
- **Local Storage**: `./dm-core-storage` for development
- **AWS S3**: Production-ready with proper configuration
- Environment-based switching (`NODE_ENV`)
- Scripts: `npm run dm-core-local` and `npm run dm-core-prod`

### 🔐 **Authentication & Authorization**
- User registration and login
- JWT token management
- Password hashing with bcrypt
- Profile management and password change
- Rate limiting for auth endpoints

### 📄 **File Operations**
- Upload with validation (file type, size limits)
- Download with proper headers
- Rename, copy, move operations
- File info retrieval
- Storage quota tracking per user

### 📂 **Folder Operations**
- Create folders with hierarchy validation
- Navigate folder contents with pagination
- Rename and move folders (with path updates)
- Delete folders (cascading to children)
- Folder statistics (file count, size, etc.)

### 🗑️ **Bin System**
- Soft delete for files and folders
- Automatic cleanup after 30 days
- Restore functionality
- Permanent deletion option
- Empty bin operation

### 🔍 **Search & Discovery**
- Full-text search across files and folders
- Recent items tracking
- Starred items management
- Pagination support

### 🤝 **Sharing System**
- Share files and folders with other users
- Permission-based access (read, write, delete, share)
- Share expiration support
- Access tracking and statistics
- Revoke sharing functionality

### ⭐ **Starring System**
- Toggle star status for files and folders
- Retrieve starred items
- Organized by type and date

### 🛡️ **Security & Performance**
- Helmet.js for security headers
- CORS configuration
- Rate limiting (general, upload, auth)
- Input validation and sanitization
- Error handling middleware
- Graceful shutdown handling

### 📊 **API Endpoints Summary**
All required endpoints from the PRD are implemented:
- `/api/dm/upload` - File upload
- `/api/dm/create` - File/folder creation
- `/api/dm/search` - Search functionality
- Plus comprehensive CRUD operations for all entities

### 🧪 **Testing & Documentation**
- **Complete Postman collection** with test data
- **Comprehensive README** with setup instructions
- **Environment configuration** examples
- **API documentation** with all endpoints

### 📋 **Key Features Implemented**
✅ 4-level folder hierarchy  
✅ File and folder operations  
✅ User authentication  
✅ Storage quota management  
✅ Sharing with permissions  
✅ Starring system  
✅ Bin/trash with auto-cleanup  
✅ Search functionality  
✅ Recent items tracking  
✅ Dual storage (local/S3)  
✅ Rate limiting and security  
✅ Comprehensive API testing  

The API is now ready for deployment and testing. You can start the server using:
- `npm run dm-core-local` for local development
- `npm run dm-core-prod` for production with AWS S3

Import the Postman collection to test all endpoints with the provided test data!