import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import DocumentList from './modules/procurement/pages/Documents/DocumentList';
import DocumentDetails from './modules/procurement/pages/Documents/DocumentDetails';
import DocumentForm from './modules/procurement/pages/Documents/DocumentForm';
import UploadDocument from './modules/procurement/pages/Documents/UploadDocument';

function App() {
  return (
    <AppLayout>
      <Routes>
        {/* Redirect root to /procurement/pr */}
        <Route path="/" element={<Navigate to="/procurement/PurchaseReq?state=PurchaseReq-Created" replace />} />

        {/* Procurement Routes with workflowType parameter */}
        {/* Using a common pattern /procurement/:workflowType for workflow-specific lists */}
        <Route path="/procurement/:workflowType" element={<DocumentList />} />

        {/* Routes for documents within a specific workflow */}
        <Route path="/procurement/:workflowType/create" element={<DocumentForm />} />
        <Route path="/procurement/:workflowType/upload" element={<UploadDocument />} />
        
        {/* Route for viewing a specific document */}
        {/* Using the path pattern /procurement/:workflowType/:id/:substate */}
        <Route path="/procurement/:workflowType/:id/:substate" element={<DocumentDetails />} />

        {/* Route for editing a specific document */}
        {/* Using the path pattern /procurement/:workflowType/:id/edit */}
        <Route path="/procurement/:workflowType/:id/edit" element={<DocumentForm />} />

        {/* Placeholder Routes for Other Workflows (adjust as needed) */}
        {/* Example: Contract Workflow */}
        <Route path="/procurement/Contract" element={<DocumentList />} /> {/* Example list */}
        <Route path="/procurement/Contract/create" element={<DocumentForm />} /> {/* Example add */}
         <Route path="/procurement/Contract/upload" element={<UploadDocument />} /> {/* Example upload */}
        <Route path="/procurement/Contract/:id/edit" element={<DocumentForm />} /> {/* Example edit */}

         {/* Example: Orders Workflow */}
        <Route path="/procurement/Orders" element={<DocumentList />} /> {/* Example list */}
        <Route path="/procurement/Orders/create" element={<DocumentForm />} /> {/* Example add */}
         <Route path="/procurement/Orders/upload" element={<UploadDocument />} /> {/* Example upload */}
        <Route path="/procurement/Orders/:id/edit" element={<DocumentForm />} /> {/* Example edit */}

         {/* Example: Invoices Workflow */}
        <Route path="/procurement/Invoice" element={<DocumentList />} /> {/* Example list */}
        <Route path="/procurement/Invoice/create" element={<DocumentForm />} /> {/* Example add */}
         <Route path="/procurement/Invoice/upload" element={<UploadDocument />} /> {/* Example upload */}
        <Route path="/procurement/Invoice/:id/edit" element={<DocumentForm />} /> {/* Example edit */}

         {/* Example: Payment Workflow */}
        <Route path="/procurement/Payment" element={<DocumentList />} /> {/* Example list */}
        <Route path="/procurement/Payment/create" element={<DocumentForm />} /> {/* Example add */}
         <Route path="/procurement/Payment/upload" element={<UploadDocument />} /> {/* Example upload */}
        <Route path="/procurement/Payment/:id/edit" element={<DocumentForm />} /> {/* Example edit */}

        {/* Add more routes for other workflows as they are implemented */}

        {/* Catch-all route for 404 - optional */}
        {/* <Route path="*" element={<div>404 Not Found</div>} /> */}
      </Routes>
    </AppLayout>
  );
}

export default App;
