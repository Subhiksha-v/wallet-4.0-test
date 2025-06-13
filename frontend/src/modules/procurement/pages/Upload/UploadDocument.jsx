import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { uploadFile } from '../../../services/documentService';

const UploadDocument = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Extract workflow type and state from URL
  const workflowType = location.pathname.split('/')[2];
  const queryParams = new URLSearchParams(location.search);
  const stateParam = queryParams.get('state');
const stateFilter = stateParam?.includes('-') ? stateParam.split('-')[1] : stateParam; // Default to created state
  const substate = stateFilter; // substate will be the same as stateFilter

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      setUploadError('Please select an XLSX file.');
      return;
    }

    const file = acceptedFiles[0];
    if (!file.name.endsWith('.xlsx')) {
      setUploadError('Only XLSX files are supported.');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      // Pass workflowType as state and substate
      const response = await uploadFile(file, workflowType, substate);
      setUploadSuccess(`File '${response.filename}' uploaded and processed successfully!`);
      // Navigate to the document list with the appropriate state filter
      navigate(`/procurement/${workflowType}?state=${stateFilter}`);
        } catch (error) {
      setUploadError(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  }, [navigate, workflowType, stateFilter, substate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    multiple: false,
  });

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Upload Document (XLSX)</h2>
      <div
        {...getRootProps()}
        className={`card p-5 text-center ${isDragActive ? 'border-primary bg-light' : 'border-secondary'}`}
        style={{
          border: '2px dashed',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p className="text-primary">Drop the files here ...</p> :
            <p>Drag and drop your XLSX file here, or click to select files</p>
        }
        <button className="btn btn-primary mt-3">Browse Files</button>
      </div>

      {uploading && (
        <div className="d-flex justify-content-center align-items-center mt-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Uploading...</span>
          </div>
          <span className="ms-2">Uploading and processing...</span>
        </div>
      )}

      {uploadError && (
        <div className="alert alert-danger mt-3" role="alert">
          {uploadError}
        </div>
      )}

      {uploadSuccess && (
        <div className="alert alert-success mt-3" role="alert">
          {uploadSuccess}
        </div>
      )}

      <button 
        className="btn btn-secondary mt-4"
        onClick={() => navigate(-1)}
      >
        Back
          </button>
    </div>
  );
};

export default UploadDocument; 