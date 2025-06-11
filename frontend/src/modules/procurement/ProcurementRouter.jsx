import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import placeholder page components
import Dashboard from './pages/Dashboard/Dashboard';
import DocumentList from './pages/Documents/DocumentList';
import DocumentDetails from './pages/Documents/DocumentDetails';
import DocumentForm from './pages/Documents/DocumentForm';
import UploadDocument from './pages/Upload/UploadDocument';

const ProcurementRouter = () => {
  return (
    <Routes>
      {/* Dashboard Route */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Documents Routes */}
      {/* Dynamic route for lists based on workflowPath */}
      <Route path="/:workflowPath" element={<DocumentList />} />
      {/* Dynamic route for document details based on workflowPath and id */}
      <Route path="/:workflowPath/:id" element={<DocumentDetails />} />
      {/* Dynamic route for document creation based on workflowPath */}
      <Route path="/:workflowPath/create" element={<DocumentForm />} />
      {/* Dynamic route for document editing based on workflowPath and id */}
      <Route path="/:workflowPath/:id/edit" element={<DocumentForm />} />
      {/* Route for uploading documents dynamically based on workflowPath */}
      <Route path="/:workflowPath/upload" element={<UploadDocument />} />

      {/* Default route for procurement - maybe redirect to dashboard or list */}
      <Route path="/" element={<DocumentList />} /> {/* Or Dashboard */}
    </Routes>
  );
};

export default ProcurementRouter;
