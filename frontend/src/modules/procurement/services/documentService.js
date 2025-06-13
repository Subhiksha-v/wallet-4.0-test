const API_BASE_URL = 'http://localhost:3001/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    // Check if the response has content before parsing as JSON
    if (response.status === 204) {
      return null; // No content to parse for 204 No Content
    }

    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Get all documents with optional filters
export const getDocuments = async (filters = {}) => {
  if (!filters.state || !filters.substate) {
    throw new Error('State and substate parameters are required for getDocuments');
  }
  const queryParams = new URLSearchParams(filters);
  return apiCall(`/documents?${queryParams.toString()}`);
};

// Get document by ID
export const getDocumentById = async (id, state, substate) => {
  if (!state || !substate) {
    throw new Error('State and substate parameters are required for getDocumentById');
  }
  try {
    console.log('Fetching document:', { id, state, substate });
    const response = await apiCall(`/details/${id}?state=${state}&substate=${substate}`);
    console.log('Document details response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching document:', error);
    throw new Error(`Failed to fetch document details: ${error.message}`);
  }
};

// Create new document
export const createDocument = async (documentData) => {
  if (!documentData.state || !documentData.substate) {
    throw new Error('State and substate parameters are required for createDocument');
  }
  return apiCall('/create', {
    method: 'POST',
    body: JSON.stringify(documentData),
  });
};

// Update document
export const updateDocument = async (id, documentData) => {
  if (!documentData.state || !documentData.substate) {
    throw new Error('State and substate parameters are required for updateDocument');
  }
  try {
    console.log('Updating document:', { id, documentData });
    const response = await apiCall(`/edit/${id}`, {
      method: 'PUT',
      body: JSON.stringify(documentData),
    });
    console.log('Update response:', response);
    return response;
  } catch (error) {
    console.error('Error updating document:', error);
    throw new Error(`Failed to update document: ${error.message}`);
  }
};

// Delete document
export const deleteDocument = async (id, state, substate) => {
  if (!state || !substate) {
    throw new Error('State and substate parameters are required for deleteDocument');
  }
  try {
    await apiCall(`/delete/${id}?state=${state}&substate=${substate}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw new Error('Failed to delete document');
  }
};

// Upload file
export const uploadFile = async (file, state, substate) => {
  if (!state || !substate) {
    throw new Error('State and substate parameters are required for uploadFile');
  }
  const formData = new FormData();
  formData.append('file', file);
  formData.append('state', state);
  formData.append('substate', substate);

  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};

// Create RFQ from PR
export const createRfqFromPr = async (prId, rfqData, state, substate) => {
  const documentData = {
    ...rfqData,
    type: 'RFQ',
    state: state,
    substate: substate,
    prId,
  };
  return createDocument(documentData);
};

// Create BID from RFQ
export const createBidFromRfq = async (rfqId, bidData, state, substate) => {
  const documentData = {
    ...bidData,
    type: 'BID',
    state: state,
    substate: substate,
    rfqId,
  };
  return createDocument(documentData);
};

// Get BIDs by RFQ ID
export const getBidsByRfqId = async (rfqId, state, substate) => {
  const documents = await getDocuments({ rfqId, state, substate });
  return documents.filter(doc => doc.type === 'BID');
};

// Get RFQ by BID ID
export const getRfqByBidId = async (bidId, state, substate) => {
  const bid = await getDocumentById(bidId, state, substate);
  if (bid && bid.rfqId) {
    return getDocumentById(bid.rfqId, state, substate);
  }
  return null;
};

// Service functions for state transitions
export const cancelDocument = async (id, state, substate) => {
  const doc = await getDocumentById(id, state, substate);
  if (!doc) return null;
  
  const newSubstate = `${doc.type === 'Purchase Requistion' ? 'pr' : doc.type.toLowerCase()}-cancelled`;
  return updateDocument(id, { ...doc, state: state, substate: newSubstate });
};

export const rejectDocument = async (id, state, substate) => {
  const doc = await getDocumentById(id, state, substate);
  if (!doc) return null;
  
  const newSubstate = `${doc.type === 'RFQ' ? 'rfq' : doc.type.toLowerCase()}-rejected`;
  return updateDocument(id, { ...doc, state: state, substate: newSubstate });
};

export const shortlistDocument = async (id, state, substate) => {
  const doc = await getDocumentById(id, state, substate);
  if (!doc) return null;
  return updateDocument(id, { ...doc, state: state, substate: 'pr-shortlist' });
};

export const awardDocument = async (id, state, substate) => {
  const doc = await getDocumentById(id, state, substate);
  if (!doc) return null;
  return updateDocument(id, { ...doc, state: state, substate: 'awarded' });
};

// Service function for state transitions
export const transitionDocumentState = async (id, currentState, currentSubstate, newState, newSubstate) => {
  try {
    const doc = await getDocumentById(id, currentState, currentSubstate);
    if (!doc) {
      throw new Error('Document not found');
    }

    // Update the document with new state and substate
    const updatedDoc = {
      ...doc,
      state: newState,
      substate: newSubstate,
      updated: new Date().toISOString()
    };

    // Call the update endpoint
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedDoc),
    });

    if (!response.ok) {
      throw new Error('Failed to update document state');
    }

    return await response.json();
  } catch (error) {
    console.error('Error transitioning document state:', error);
    throw error;
  }
}; 