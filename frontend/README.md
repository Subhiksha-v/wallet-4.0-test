# Procurement Workflow Management System

A modern web application for managing procurement workflows, built with React and Express.

## Features

- Purchase Requisition workflow management
- RFQ (Request for Quote) creation and management
- BID submission and evaluation
- Contract management
- Order tracking
- Invoice processing
- Payment management
- File upload support
- Demo mode with local storage
- API mode with Express backend

## Tech Stack

### Frontend
- React 18+
- React Router for navigation
- Context API for state management
- TailwindCSS for styling
- Bootstrap Icons
- React Hook Form with Yup validation
- Recharts for data visualization

### Backend
- Express.js
- File system storage (JSON)
- Multer for file uploads
- CORS support

## Project Structure

```
./
├── backend/             # Express.js backend
│   ├── documents.json   # Data storage
│   ├── package.json     # Backend dependencies and scripts
│   ├── server.js        # Main server file
│   └── uploads/         # Uploaded files
├── frontend/            # React frontend
│   ├── public/          # Static assets
│   ├── src/             # React source code
│   ├── index.html       # HTML entry point
│   ├── package.json     # Frontend dependencies and scripts
│   └── vite.config.js   # Vite configuration (if present)
│   └── README.md        # Frontend specific documentation
└── package.json         # Root-level scripts (concurrently)
```

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd p2p-app
```

2. Install dependencies:
```bash
# Install all dependencies (frontend and backend)
npm run install-all
```

3. Start the development servers:
```bash
npm start
```

4. Access the application:
- Frontend: http://localhost:5173 (or as configured in frontend/vite.config.js)
- Backend API: http://localhost:3001

## API Endpoints

### Documents
- `GET /api/documents` - Get all documents with optional filters
- `GET /api/details/:docId` - Get document by ID
- `POST /api/create` - Create new document
- `PUT /api/edit/:docId` - Update document
- `DELETE /api/delete/:docId` - Delete document

### File Upload
- `POST /api/upload` - Upload document files

## Demo Mode

The application supports a demo mode that uses local storage for data persistence. To enable demo mode:

1. Set the environment variable:
```bash
VITE_USE_DEMO_MODE=true
```

2. Or modify the `dataMode.js` utility:
```javascript
export const isDemoMode = () => true;
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
