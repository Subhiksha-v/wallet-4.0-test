import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getDocumentById, cancelDocument, rejectDocument, shortlistDocument, awardDocument, getBidsByRfqId, getRfqByBidId, createRfqFromPr, createBidFromRfq } from '../../services/documentService';
import { unflattenObject } from './DocumentForm'; // Import the unflattenObject utility
import { documentFormConfig } from '../../config/documentFormConfig'; // Import the documentFormConfig

const DocumentDetails = () => {
  const { workflowType, id, substate } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [relatedDocuments, setRelatedDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDocument = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDocumentById(id, workflowType, substate);
      if (data) {
        // Unflatten the incoming data for proper display
        const unflattenedData = unflattenObject(data);
        setDocument(unflattenedData);
      } else {
        setError('Document not found or could not be fetched.');
      }
    } catch (err) {
      setError('Failed to fetch document details');
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDocument();
  }, [id, workflowType, substate]);

  useEffect(() => {
    const fetchRelatedDocuments = async () => {
      if (document) {
        if (document.type === 'RFQ') {
          const bids = await getBidsByRfqId(document.id);
          setRelatedDocuments(bids);
        } else if (document.type === 'BID') {
          const rfq = await getRfqByBidId(document.id);
          setRelatedDocuments(rfq ? [rfq] : []);
        }
      } else {
        setRelatedDocuments([]);
      }
    };

    fetchRelatedDocuments();
  }, [document]);

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this document?')) {
      const updatedDoc = await cancelDocument(id);
      if (updatedDoc) {
        alert('Document cancelled successfully!');
        fetchDocument();
      } else {
        alert('Failed to cancel document.');
      }
    }
  };

  const handleReject = async () => {
    if (window.confirm('Are you sure you want to reject this document?')) {
      const updatedDoc = await rejectDocument(id);
      if (updatedDoc) {
        alert('Document rejected successfully!');
        fetchDocument();
      } else {
        alert('Failed to reject document.');
      }
    }
  };

  const handleShortlist = async () => {
    if (window.confirm('Are you sure you want to shortlist this document?')) {
      const updatedDoc = await shortlistDocument(id);
      if (updatedDoc) {
        alert('Document shortlisted successfully!');
        fetchDocument();
      } else {
        alert('Failed to shortlist document.');
      }
    }
  };

  const handleAward = async () => {
    if (window.confirm('Are you sure you want to award this document?')) {
      const updatedDoc = await awardDocument(id);
      if (updatedDoc) {
        alert('Document awarded successfully!');
        fetchDocument();
      } else {
        alert('Failed to award document.');
      }
    }
  };

  // Handler for creating RFQ from PR
  const handleCreateRfq = async () => {
    if (window.confirm('Are you sure you want to create an RFQ from this Purchase Requisition?')) {
      setLoading(true); // Indicate action is in progress
      const newRfq = await createRfqFromPr(id);
      if (newRfq) {
        alert('RFQ created successfully!');
        navigate(`/procurement/${workflowType}/documents/${newRfq.id}`); // Navigate to the new RFQ details page
      } else {
        alert('Failed to create RFQ.');
        setLoading(false); // End loading on failure
      }
    }
  };

   // Handler for creating BID from RFQ
  const handleCreateBid = async () => {
     if (window.confirm('Are you sure you want to create a BID for this RFQ?')) {
       setLoading(true); // Indicate action is in progress
       const newBid = await createBidFromRfq(id);
       if (newBid) {
         alert('BID created successfully!');
         navigate(`/procurement/${workflowType}/documents/${newBid.id}`); // Navigate to the new BID details page
       } else {
         alert('Failed to create BID.');
         setLoading(false); // End loading on failure
       }
     }
  };

  if (loading) {
    return <div className="container mt-4">Loading document details...</div>;
  }

  if (error) {
    return <div className="container mt-4 alert alert-danger" role="alert">Error: {error}</div>;
  }

  if (!document) {
    return <div className="container mt-4 alert alert-info" role="alert">Document not found.</div>;
  }

  return (
    <div className="container mt-4">
      {/* Page Title and Actions */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{document.type || 'Document'} Details</h2>
        <div>
          {/* Back Button */}
          <button onClick={() => navigate(-1)} className="btn btn-secondary">Back</button>
        </div>
      </div>

      {/* Document Details Sections */}
      <div className="row">
        <div className="col-md-12"> {/* Changed to col-md-12 as Timeline section is removed */}
          {documentFormConfig.map(sectionConfig => (
            <div key={sectionConfig.section} className="card mb-3">
              <div className="card-header">{sectionConfig.title}</div>
              <div className="card-body">
                {sectionConfig.type !== 'array' ? (
                  <div className="row">
                    {sectionConfig.fields.map(field => (
                      (!field.hasOwnProperty('showOnDetails') || field.showOnDetails !== false) && (
                        <div key={field.name} className={field.halfWidth ? "col-md-6" : "col-md-12"}>
                          <p><strong>{field.label}:</strong> {document[sectionConfig.section]?.[field.name]?.toLocaleString()}</p>
                        </div>
                      )
                    ))}
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          {sectionConfig.fields.map(field => (
                            <th key={field.name}>{field.label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {document.OrderedItems && document.OrderedItems.length > 0 ? (
                          document.OrderedItems.map((item, index) => (
                            <tr key={index}>
                              {sectionConfig.fields.map(field => (
                                <td key={field.name}>{item[field.name]?.toLocaleString()}</td>
                              ))}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={sectionConfig.fields.length}>No items found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    {document.OverallTotal !== undefined && (
                      <div className="text-end mt-3">
                        <h5>Overall Total: ₹{document.OverallTotal?.toLocaleString()}</h5>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Related Documents Section */}
          {relatedDocuments.length > 0 && (
            <div className="card mb-3">
              <div className="card-header">Associated {document.type === 'RFQ' ? 'BIDs' : 'RFQ'}</div>
              <div className="card-body">
                <ul className="list-group">
                  {relatedDocuments.map(relDoc => (
                    <li key={relDoc.id} className="list-group-item">
                      <Link to={`/procurement/${relDoc.type.toLowerCase()}/documents/${relDoc.id}`}>
                        {relDoc.type} - {relDoc.DocDetails?.DocumentNumber || relDoc.id}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Conditional buttons for creating RFQ/BID, or for actions */}
          {document.type === 'Purchase Requisition' && document.DocDetails?.State === 'pr-created' && (
            <div className="d-flex justify-content-end mt-3">
              <button className="btn btn-success me-2" onClick={handleCreateRfq} disabled={loading}>Create RFQ</button>
            </div>
          )}
          {document.type === 'RFQ' && document.DocDetails?.State === 'rfq-created' && (
            <div className="d-flex justify-content-end mt-3">
              <button className="btn btn-success me-2" onClick={handleCreateBid} disabled={loading}>Create BID</button>
            </div>
          )}

          {/* Example Action Buttons based on state */}
          {document.DocDetails?.State === 'pr-created' && (
            <div className="d-flex justify-content-end mt-3">
              <button className="btn btn-warning me-2" onClick={handleCancel}>Cancel PR</button>
            </div>
          )}

          {document.DocDetails?.State === 'rfq-created' && (
            <div className="d-flex justify-content-end mt-3">
              <button className="btn btn-warning me-2" onClick={handleReject}>Reject RFQ</button>
              <button className="btn btn-info me-2" onClick={handleShortlist}>Shortlist BID</button>
            </div>
          )}

          {document.DocDetails?.State === 'bid-created' && (
            <div className="d-flex justify-content-end mt-3">
              <button className="btn btn-success me-2" onClick={handleAward}>Award BID</button>
              <button className="btn btn-warning me-2" onClick={handleReject}>Reject BID</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentDetails; 