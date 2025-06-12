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
        <Route path="/" element={<Navigate to="/procurement/pr" replace />} />

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
        <Route path="/procurement/contract" element={<DocumentList />} /> {/* Example list */}
        <Route path="/procurement/contract/create" element={<DocumentForm />} /> {/* Example add */}
         <Route path="/procurement/contract/upload" element={<UploadDocument />} /> {/* Example upload */}
        <Route path="/procurement/contract/:id/edit" element={<DocumentForm />} /> {/* Example edit */}

         {/* Example: Orders Workflow */}
        <Route path="/procurement/orders" element={<DocumentList />} /> {/* Example list */}
        <Route path="/procurement/orders/create" element={<DocumentForm />} /> {/* Example add */}
         <Route path="/procurement/orders/upload" element={<UploadDocument />} /> {/* Example upload */}
        <Route path="/procurement/orders/:id/edit" element={<DocumentForm />} /> {/* Example edit */}

         {/* Example: Invoices Workflow */}
        <Route path="/procurement/invoice" element={<DocumentList />} /> {/* Example list */}
        <Route path="/procurement/invoice/create" element={<DocumentForm />} /> {/* Example add */}
         <Route path="/procurement/invoice/upload" element={<UploadDocument />} /> {/* Example upload */}
        <Route path="/procurement/invoice/:id/edit" element={<DocumentForm />} /> {/* Example edit */}

         {/* Example: Payment Workflow */}
        <Route path="/procurement/payment" element={<DocumentList />} /> {/* Example list */}
        <Route path="/procurement/payment/create" element={<DocumentForm />} /> {/* Example add */}
         <Route path="/procurement/payment/upload" element={<UploadDocument />} /> {/* Example upload */}
        <Route path="/procurement/payment/:id/edit" element={<DocumentForm />} /> {/* Example edit */}

        {/* Add more routes for other workflows as they are implemented */}

        {/* Catch-all route for 404 - optional */}
        {/* <Route path="*" element={<div>404 Not Found</div>} /> */}
      </Routes>
    </AppLayout>
  );
}

export default App;
