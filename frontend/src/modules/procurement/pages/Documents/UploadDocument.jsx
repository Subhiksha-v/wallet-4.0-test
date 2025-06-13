import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { uploadFile } from '../../services/documentService'; // Import uploadFile

const UploadDocument = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract workflow type from URL path
  // URL format: /procurement/pr/upload -> we want 'pr'
  const workflow= location.pathname.split('/')[2];
  const queryParams = new URLSearchParams(location.search);
  const stateParam = queryParams.get('state');
const stateFilter = stateParam?.includes('-') ? stateParam.split('-')[1] : stateParam; // Default to created state
  const substate = stateFilter; // This will get 'pr' from the URL

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Add a visual indicator that the area is a drop target
    e.dataTransfer.dropEffect = 'copy';
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && file.type !== 'application/vnd.ms-excel') {
      setError('Invalid file type. Please upload an Excel (.xlsx or .xls) file.');
      setSelectedFile(null);
      setFileData(null);
      return;
    }

    setSelectedFile(file);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);
      
      // Clean keys by removing all characters that are not alphanumeric or a period, and then trimming any remaining whitespace
      const cleanedJson = json.map(item => {
        const newItem = {};
        for (const key in item) {
          if (Object.hasOwnProperty.call(item, key)) {
            const cleanKey = key.replace(/[^a-zA-Z0-9.]/g, '').trim();
            newItem[cleanKey] = item[key];
          }
        }
        return newItem;
      });

      setFileData(cleanedJson);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImportData = async () => {
    if (fileData && workflow) {
      setError(null); // Clear previous errors
      try {
        // Assuming workflow is the state (e.g., 'pr') and substate is 'created' for new uploads
        // const substate = `${workflow}-created`;
        const response = await uploadFile(selectedFile, workflow, substate);
        console.log('Upload successful:', response);
        alert('File uploaded and processed successfully!');
        // Navigate to the listing page after successful upload
        navigate(`/procurement/${workflow}?state=${workflow}-${substate}`);
      } catch (err) {
        console.error('Error during upload:', err);
        setError(`Failed to upload file: ${err.message}`);
      }
    } else if (!workflow) {
      setError('Workflow type not specified in URL.');
    } else {
      setError('No file data to import.');
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setFileData(null);
    setError(null);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Upload {workflow ? workflow.replace(/([A-Z])/g, ' $1').trim() : 'Document'}</h2>
      <div className="card">
        <div className="card-body">
          {!selectedFile ? (
            <div
              className={`border-dashed border-2 rounded p-5 text-center ${isDragging ? 'border-primary bg-light' : 'border-secondary'}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <i className="bi bi-cloud-arrow-up fs-1 text-muted"></i>
              <p className="text-muted">Drag and drop your XLSX file here or</p>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileInputChange}
                className="d-none"
                id="uploadFile"
              />
              <label htmlFor="uploadFile" className="btn btn-primary">
                Browse Files
              </label>
            </div>
          ) : (
            <div>
              <p>Selected file: <strong>{selectedFile.name}</strong> ({selectedFile.size} bytes)</p>
              {fileData && (
                <div className="mt-4">
                  <h5>Import Preview</h5>
                  {error && <div className="alert alert-danger" role="alert">{error}</div>}
                  {!error && fileData.length > 0 ? (
                    <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      <table className="table table-sm table-bordered">
                        <thead>
                          <tr>
                            {Object.keys(fileData[0]).map((key) => (
                              <th key={key}>{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {fileData.slice(0, 10).map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {Object.values(row).map((value, colIndex) => (
                                <td key={colIndex}>{String(value)}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                     !error && <div className="alert alert-info" role="alert">No data found in the file.</div>
                  )}

                  <div className="d-flex justify-content-end mt-3">
                    <button className="btn btn-secondary me-2" onClick={handleCancel}>Cancel</button>
                    <button className="btn btn-success" onClick={handleImportData}>Import Data</button>
                  </div>
                </div>
              )}
            </div>
          )}
           {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default UploadDocument; 