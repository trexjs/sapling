# Typeform Clone

A full-stack Typeform clone built with the MERN stack, featuring a modern form builder with drag-and-drop functionality, real-time form creation, and response collection.

## 🚀 Features

- **Form Builder**: Create forms with drag-and-drop question types
- **Question Types**: Text, textarea, email, number, select, radio, checkbox, rating, and date inputs
- **Form Publishing**: Publish forms and share via public URLs
- **Response Collection**: Collect and view form responses
- **Real-time Updates**: Live form editing and preview
- **Export Data**: Export responses to CSV format
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend (UI folder)
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Styled Components** for CSS-in-JS styling
- **React Router DOM** for navigation
- **React Hook Form** for form handling
- **React DnD** for drag-and-drop functionality
- **Axios** for API calls

### Backend (Server folder)
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **CORS** for cross-origin requests
- **UUID** for unique identifiers

## 📁 Project Structure

```
typeform-clone/
├── UI/                     # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   ├── types/         # TypeScript type definitions
│   │   └── main.tsx       # Application entry point
│   ├── package.json
│   └── vite.config.ts
├── server/                # Backend Express server
│   ├── src/
│   │   ├── models/        # MongoDB models
│   │   ├── routes/        # API routes
│   │   └── index.ts       # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── package.json           # Root package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd typeform-clone
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `server` folder:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/typeform-clone
   NODE_ENV=development
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system.

### Development

1. **Start both frontend and backend**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend development server on `http://localhost:3000`

2. **Or start them separately**
   
   Backend only:
   ```bash
   npm run server
   ```
   
   Frontend only:
   ```bash
   npm run client
   ```

### Production Build

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Start the backend**
   ```bash
   cd server
   npm run build
   npm start
   ```

## 📖 Usage

### Creating Forms

1. Navigate to the dashboard
2. Click "Create Form" to start a new form
3. Use the question palette to add different question types
4. Configure questions using the question editor
5. Set form settings (publishing, email collection, etc.)
6. Publish your form to make it accessible

### Form Types

- **Short Text**: Single-line text input
- **Long Text**: Multi-line textarea
- **Email**: Email validation
- **Number**: Numeric input with min/max/step
- **Dropdown**: Single selection from options
- **Multiple Choice**: Radio buttons for single selection
- **Checkboxes**: Multiple selections allowed
- **Rating**: Star rating system
- **Date**: Date picker

### Managing Responses

1. View responses in the responses tab
2. Export responses to CSV format
3. View response statistics
4. Filter and search through responses

## 🔧 API Endpoints

### Forms
- `GET /api/forms` - Get all forms
- `GET /api/forms/:id` - Get specific form
- `POST /api/forms` - Create new form
- `PUT /api/forms/:id` - Update form
- `PATCH /api/forms/:id/publish` - Publish/unpublish form
- `DELETE /api/forms/:id` - Delete form

### Responses
- `POST /api/responses` - Submit form response
- `GET /api/responses/form/:formId` - Get responses for form
- `GET /api/responses/stats/:formId` - Get response statistics

## 🎨 Styling

The application uses styled-components for all styling, providing:
- Consistent design system
- Component-scoped styles
- Theme support
- Responsive design
- Modern UI components

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `UI/dist` folder
3. Set environment variables for API URL

### Backend (Heroku/Railway/DigitalOcean)
1. Set up MongoDB Atlas or local MongoDB
2. Deploy the server folder
3. Set environment variables:
   - `MONGODB_URI`
   - `PORT`
   - `NODE_ENV`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by Typeform's user-friendly form builder
- Built with modern web technologies
- Designed for developer and user experience
