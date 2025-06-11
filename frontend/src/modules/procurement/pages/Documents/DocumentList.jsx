import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDocuments, deleteDocument } from '../../services/documentService';
import DataTable from '../../../../components/DataTable';
import { FaEye, FaPencilAlt, FaTrashAlt } from 'react-icons/fa'; // Import Font Awesome icons

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [columns, setColumns] = useState([]); // State to hold dynamic columns
  const location = useLocation();
  const navigate = useNavigate();

  // Extract workflow type and state from URL
  const workflowType = location.pathname.split('/')[2];
  const queryParams = new URLSearchParams(location.search);
  const stateFilter = queryParams.get('state') || `${workflowType}-created`; // Default to created state
  const substate = stateFilter; // substate will be the same as stateFilter

  // Memoize handleDelete, handleView, handleEdit to prevent unnecessary re-renders
  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument(id, workflowType, substate);
        // Use functional update for setDocuments to avoid 'documents' in dependency array
        setDocuments(prevDocuments => prevDocuments.filter(doc => doc._id !== id));
      } catch (err) {
        setError('Failed to delete document');
        console.error(err);
      }
    }
  }, [workflowType, substate]); // Dependencies: only workflowType and substate

  const handleView = useCallback((id) => {
    navigate(`/procurement/${workflowType}/${id}/${substate}`);
  }, [navigate, workflowType, substate]);

  const handleEdit = useCallback((id) => {
    navigate(`/procurement/${workflowType}/${id}/edit?state=${stateFilter}`);
  }, [navigate, workflowType, stateFilter]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const filters = {
          state: workflowType,
          substate: substate,
          type: workflowType.toUpperCase()
        };
        console.log('Fetching documents with filters:', filters); // Add logging
        const response = await getDocuments(filters);
        console.log('API Response:', response); // Add logging
        setDocuments(response.data);

        if (response.headers && response.headers.length > 0) {
          const dynamicCols = response.headers.map(col => ({
            key: col.key,
            label: col.title,
            align: col.align,
            render: (value, item) => {
              // Helper to get nested value from flattened object if dataIndex is nested
              const getValue = (obj, path) => {
                // If the path exists directly in the object, return it
                if (obj.hasOwnProperty(path)) {
                  return obj[path];
                }
                
                // Otherwise, try to traverse the object
                return path.split('.').reduce((o, i) => {
                  // If o is null/undefined or not an object, return null
                  if (o === null || o === undefined || typeof o !== 'object') {
                    return null;
                  }
                  return o[i];
                }, obj);
              };

              const val = getValue(item, col.dataIndex);
              console.log(`Getting value for ${col.dataIndex}:`, val); // Add logging

              // Apply formatting based on dataType if needed
              if (col.dataType === 'date') {
                return val ? new Date(val).toLocaleDateString() : '—';
              } else if (col.dataType === 'number') {
                return val != null ? `$${val.toLocaleString()}` : '—';
              }
              return val != null ? val : '—';
            },
          }));

          // Add the Actions column at the end
          dynamicCols.push({ 
            key: 'actions',
            label: 'Actions',
            align: 'center',
            render: (value, item) => (
              <div className="d-flex justify-content-center">
                <button
                  className="btn btn-link text-primary"
                  onClick={() => handleView(item._id)} // Use item._id for actions
                  title="View"
                >
                  <FaEye style={{ color: 'black' }} />
                </button>
                <button
                  className="btn btn-link text-warning"
                  onClick={() => handleEdit(item._id)} // Use item._id for actions
                  title="Edit"
                >
                  <FaPencilAlt style={{ color: 'black' }} />
                </button>
                <button
                  className="btn btn-link text-danger"
                  onClick={() => handleDelete(item._id)} // Use item._id for actions
                  title="Delete"
                >
                  <FaTrashAlt style={{ color: 'black' }} />
                </button>
              </div>
            ),
          });

          setColumns(dynamicCols);
        } else {
          setColumns([]); // No columns if no headers are provided
        }

        setError(null);
      } catch (err) {
        setError('Failed to fetch documents or generate schema');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [stateFilter, workflowType, substate, handleDelete, handleEdit, handleView]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="h4 mb-0">
          Documents
          {stateFilter && <span className="text-muted ms-2">({stateFilter})</span>}
        </h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/procurement/${workflowType}/create?state=${stateFilter}`)}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Create Document
        </button>
      </div>

      {documents && documents.length === 0 ? (
        <div className="d-flex justify-content-center align-items-center flex-grow-1" style={{ minHeight: '200px' }}>
          <div className="alert alert-info mb-0" role="alert">
          No documents found.
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns} // Use dynamically generated columns
          data={documents}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onView={handleView}
        />
      )}
    </div>
  );
};

export default DocumentList; 