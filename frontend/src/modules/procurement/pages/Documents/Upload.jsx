import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract workflow type from URL path
  // URL format: /procurement/pr/upload -> we want 'pr'
  const workflowType = location.pathname.split('/')[2]; // This will get 'pr' from the URL

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create preview URL
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }
  };

  const handleImport = () => {
    if (!workflowType) {
      alert('Workflow type not specified in URL.');
      return;
    }

    if (!file) {
      alert('Please select a file first.');
      return;
    }

    // Here you would typically handle the file import
    // For now, just show a success message
    alert(`File imported successfully for ${workflowType} workflow!`);
    navigate(`/procurement/${workflowType}`);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Upload Document - {workflowType.toUpperCase()}</h2>
      <div className="card">
        <div className="card-body">
          <div className="mb-3">
            <label htmlFor="fileUpload" className="form-label">Select File</label>
            <input
              type="file"
              className="form-control"
              id="fileUpload"
              onChange={handleFileChange}
              accept=".xlsx,.xls,.csv"
            />
          </div>

          {preview && (
            <div className="mb-3">
              <h5>File Preview</h5>
              <div className="border p-3 rounded">
                <p>File Name: {file.name}</p>
                <p>File Size: {(file.size / 1024).toFixed(2)} KB</p>
                <p>File Type: {file.type}</p>
              </div>
            </div>
          )}

          <div className="d-flex gap-2">
            <button
              className="btn btn-primary"
              onClick={handleImport}
              disabled={!file}
            >
              Import Data
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload; 