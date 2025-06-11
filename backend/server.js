const express = require('express');
const cors = require('cors');
const fs = require('fs'); // standard, for sync functions
const fsPromises = require('fs').promises; // for async file I/O
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const XLSX = require('xlsx'); // Import xlsx library

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Helper function to get state/substate directory path
const getStateSubstateDirectory = (state, substate) => {
  const dirPath = path.join(__dirname, 'data', state, substate);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
}
  return dirPath;
};

// Helper function to get documents file path for a state and substate
const getDocumentsFilePath = (state, substate) => {
  return path.join(getStateSubstateDirectory(state, substate), 'documents.json');
};

// Initialize documents file for a state/substate if it doesn't exist
async function initializeDocumentsFile(state, substate) {
  const filePath = getDocumentsFilePath(state, substate);
  try {
    await fsPromises.access(filePath);
  } catch {
    await fsPromises.writeFile(filePath, JSON.stringify([]));
  }
}

// Read documents from file for a specific state and substate
async function readDocuments(state, substate) {
  const filePath = getDocumentsFilePath(state, substate);
  console.log('Reading documents from:', filePath);
  
  try {
    const data = await fsPromises.readFile(filePath, 'utf8');
    const documents = JSON.parse(data);
    console.log('Successfully read documents:', documents.length);
    return documents;
  } catch (error) {
    console.error('Error reading documents:', error);
    if (error.code === 'ENOENT') {
      console.log('File does not exist, returning empty array');
      return [];
    }
    throw error;
  }
}

// Write documents to file for a specific state and substate
async function writeDocuments(state, substate, documents) {
  const filePath = getDocumentsFilePath(state, substate);
  await fsPromises.writeFile(filePath, JSON.stringify(documents, null, 2));
}

// Helper to flatten a nested object
const flattenObject = (obj, prefix = '', res = {}) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        flattenObject(obj[key], newKey, res);
      } else {
        res[newKey] = obj[key];
      }
    }
  }
  return res;
};

// Function to dynamically generate headers from data
const generateHeadersFromData = (data, workflowType) => {
  if (!data || data.length === 0) {
    return [];
  }

  const blacklistedKeys = ['id', 'type', 'updated', '_id', 'created', 'overalltotal', 'ordereditems']; // Case-insensitive check will be used
  const tempHeaders = {};

  // Use the first item to infer columns. Assuming all items have consistent keys.
  const firstItem = data[0];

  for (const key in firstItem) {
    if (firstItem.hasOwnProperty(key)) {
      const lowerCaseKey = key.toLowerCase();
      // Exclude blacklisted keys and arrays
      if (
        blacklistedKeys.some(bKey => lowerCaseKey.includes(bKey)) ||
        Array.isArray(firstItem[key])
      ) {
        continue;
      }

      // Format title: get the last part after the dot and format it
      const keyParts = key.split('.');
      const lastPart = keyParts[keyParts.length - 1];
      let title = lastPart
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .trim()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      let dataType = 'string';
      let align = 'left';

      if (typeof firstItem[key] === 'number') {
        dataType = 'number';
        align = 'right';
      } else if (/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}\.\d{3}Z)?$/.test(firstItem[key])) { // Basic date check for ISO string or YYYY-MM-DD
        dataType = 'date';
}

      tempHeaders[key] = {
        title: title,
        key: key,
        dataIndex: key,
        dataType: dataType,
        align: align,
      };
    }
  }

  // Sort headers alphabetically by title for consistent order
  const sortedHeaders = Object.values(tempHeaders).sort((a, b) => a.title.localeCompare(b.title));

  // Return as a direct array of column objects
  return sortedHeaders;
};


function parseOrderedItems(doc) {
  const orderedItems = [];
  const orderedItemsKeys = [];
  const otherFields = {};
  
  // Separate OrderedItems fields from other fields
  Object.keys(doc).forEach(key => {
    if (key.startsWith('OrderedItems[') || key.startsWith('CorderedItems[')) {
      orderedItemsKeys.push(key);
    } else {
      otherFields[key] = doc[key];
    }
  });
  
  // Group OrderedItems by index
  const itemGroups = {};
  orderedItemsKeys.forEach(key => {
    // Extract index and field name from keys like "OrderedItems[0].ItemName"
    const match = key.match(/(?:OrderedItems|CorderedItems)\[(\d+)\]\.(.+)/);
    if (match) {
      const index = parseInt(match[1]);
      const fieldName = match[2];
      
      if (!itemGroups[index]) {
        itemGroups[index] = {};
      }
      itemGroups[index][fieldName] = doc[key];
    }
  });
  
  // Convert grouped items to array
  Object.keys(itemGroups).forEach(index => {
    orderedItems[parseInt(index)] = itemGroups[index];
  });
  
  // Add OrderedItems array to the document if items exist
  if (orderedItems.length > 0) {
    otherFields.OrderedItems = orderedItems.filter(item => item !== undefined);
  }
  
  return otherFields;
}

// Function to merge documents with duplicate document numbers
function mergeDuplicateDocuments(documents) {
  const docMap = new Map();
  
  documents.forEach(doc => {
    const docNumber = doc['DocDetails.DocumentNumber'] || doc.DocumentNumber;
    
    if (docNumber && docMap.has(docNumber)) {
      // Document with same number exists, merge OrderedItems
      const existingDoc = docMap.get(docNumber);
      
      if (doc.OrderedItems && doc.OrderedItems.length > 0) {
        if (!existingDoc.OrderedItems) {
          existingDoc.OrderedItems = [];
        }
        // Merge the OrderedItems arrays
        existingDoc.OrderedItems.push(...doc.OrderedItems);
      }
      
      // Update the timestamp to the latest
      if (doc.updated && (!existingDoc.updated || new Date(doc.updated) > new Date(existingDoc.updated))) {
        existingDoc.updated = doc.updated;
      }
      
    } else if (docNumber) {
      // New document number, add to map
      docMap.set(docNumber, { ...doc });
    } else {
      // No document number, treat as unique (use _id as fallback)
      const uniqueKey = doc._id || `unique_${Date.now()}_${Math.random()}`;
      docMap.set(uniqueKey, { ...doc });
    }
  });
  
  return Array.from(docMap.values());
}

// Main parser function
function parseDocuments(documents) {
  // Step 1: Parse OrderedItems for each document
  const parsedDocuments = documents.map(doc => parseOrderedItems(doc));
  
  // Step 2: Merge documents with duplicate document numbers
  const mergedDocuments = mergeDuplicateDocuments(parsedDocuments);
  
  return mergedDocuments;
}



// API Endpoints

// Get all documents with optional filters
app.get('/api/documents', async (req, res) => {
  try {
    const { state, substate, type, rfqId } = req.query;
    
    console.log('Received request with params:', { state, substate, type, rfqId });
    
    if (!state || !substate) {
      console.error('Missing required parameters:', { state, substate });
      return res.status(400).json({ error: 'State and substate parameters are required' });
    }

    await initializeDocumentsFile(state, substate);
    
    let documents = await readDocuments(state, substate);
    console.log('Initial documents count:', documents.length);

    // Process each document to ensure proper structure
    const processedDocuments = documents.map(doc => {
      // Find the workflow prefix (e.g., PurchaseReq)
      const workflowPrefix = Object.keys(doc).find(key => key.toLowerCase().startsWith(state.toLowerCase()));
      console.log('Processing document with workflow prefix:', workflowPrefix);

      if (workflowPrefix) {
        // If document has workflow prefix, use that data
        const workflowData = doc[workflowPrefix];
        return {
          ...workflowData,
          _id: workflowData._id || doc.id,
          type: workflowData.type || type
        };
      } else {
        // If no workflow prefix, use the document as is
        return {
          ...doc,
          _id: doc._id || doc.id,
          type: doc.type || type
        };
      }
    });

    console.log('Processed documents count:', processedDocuments.length);

    // Apply type filter if specified
    if (type) {
      console.log('Filtering by type:', type);
      documents = processedDocuments.filter(doc => {
        const docType = (doc.type || '').toLowerCase();
        const matches = docType === type.toLowerCase();
        console.log('Document type:', docType, 'Matches:', matches);
        return matches;
      });
      console.log('Documents after type filter:', documents.length);
    } else {
      documents = processedDocuments;
    }

    // Apply rfqId filter if specified
    if (rfqId) {
      documents = documents.filter(doc => doc.rfqId === rfqId);
      console.log('Documents after rfqId filter:', documents.length);
    }

    // Flatten the documents
    const flattenedDocuments = documents.map(doc => {
      const flattened = flattenObject(doc);
      return {
        ...flattened,
        _id: doc._id || doc.id
      };
    });

    console.log('Final flattened documents count:', flattenedDocuments.length);
    console.log('Sample flattened document:', JSON.stringify(flattenedDocuments[0], null, 2));

    const dynamicHeaders = generateHeadersFromData(flattenedDocuments, state);
    console.log('Generated headers count:', dynamicHeaders.length);
    const parsedDocuments = parseDocuments(flattenedDocuments);
    res.json({ 
      data: parsedDocuments, 
      headers: dynamicHeaders, 
      count: flattenedDocuments.length 
    });

  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents', details: error.message });
  }
});

// Create a new document
app.post('/api/create', async (req, res) => {
  try {
    const { state, substate, ...documentData } = req.body;
    
    if (!state || !substate) {
      return res.status(400).json({ error: 'State and substate parameters are required' });
    }

    await initializeDocumentsFile(state, substate);
    
    const documents = await readDocuments(state, substate);
    const newDocument = {
      // Wrap the incoming data under the workflowType prefix, e.g., { PurchaseReq: { ...data } }
      [state]: {
        _id: uuidv4(), // Generate _id here
        ...documentData,
      },
    };
    
    documents.push(newDocument);
    await writeDocuments(state, substate, documents);
    res.status(201).json(newDocument);
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ error: 'Failed to create document' });
  }
});



// Get document details by ID
app.get('/api/details/:docId', async (req, res) => {
  try {
    const { state, substate } = req.query;
    const { docId } = req.params;
    
    console.log('Fetching document details:', { docId, state, substate });
    
    if (!state || !substate) {
      console.error('Missing required parameters:', { state, substate });
      return res.status(400).json({ error: 'State and substate parameters are required' });
    }

    const documents = await readDocuments(state, substate);
    console.log('Total documents found:', documents.length);

    // Find the document with the matching ID
    const document = documents.find(doc => {
      const workflowPrefix = Object.keys(doc).find(key => key.toLowerCase().startsWith(state.toLowerCase()));
      if (workflowPrefix) {
        return doc[workflowPrefix]._id === docId || doc[workflowPrefix].id === docId;
      }
      return doc._id === docId || doc.id === docId;
    });
    
    if (!document) {
      console.error('Document not found:', docId);
      return res.status(404).json({ error: 'Document not found' });
    }

    // Process the document to get the correct structure
    const workflowPrefix = Object.keys(document).find(key => key.toLowerCase().startsWith(state.toLowerCase()));
    let processedDoc;
    
    if (workflowPrefix) {
      processedDoc = {
        ...document[workflowPrefix],
        _id: document[workflowPrefix]._id || document[workflowPrefix].id
      };
    } else {
      processedDoc = {
        ...document,
        _id: document._id || document.id
      };
    }

    // Flatten the document for consistent consumption by frontend
    const flattenedDoc = flattenObject(processedDoc);
    const parsedDoc = parseOrderedItems(flattenedDoc);
    console.log('Document details found and processed');

    res.json({ 
      ...parsedDoc, 
      _id: docId 
    });

  } catch (error) {
    console.error('Error fetching document:', error);
    res.status(500).json({ error: 'Failed to fetch document', details: error.message });
  }
});

// Update document by ID
app.put('/api/edit/:docId', async (req, res) => {
  try {
    const { state, substate, ...updateData } = req.body;
    const { docId } = req.params;
    
    console.log('Updating document:', { docId, state, substate });
    
    if (!state || !substate) {
      console.error('Missing required parameters:', { state, substate });
      return res.status(400).json({ error: 'State and substate parameters are required' });
    }

    const documents = await readDocuments(state, substate);
    console.log('Total documents found:', documents.length);

    // Find the document index
    const index = documents.findIndex(doc => {
      const workflowPrefix = Object.keys(doc).find(key => key.toLowerCase().startsWith(state.toLowerCase()));
      if (workflowPrefix) {
        return doc[workflowPrefix]._id === docId || doc[workflowPrefix].id === docId;
      }
      return doc._id === docId || doc.id === docId;
    });
    
    if (index === -1) {
      console.error('Document not found:', docId);
      return res.status(404).json({ error: 'Document not found' });
    }

    // Update the document
    const existingDoc = documents[index];
    const workflowPrefix = Object.keys(existingDoc).find(key => key.toLowerCase().startsWith(state.toLowerCase()));
    
    if (workflowPrefix) {
      documents[index] = {
        [workflowPrefix]: {
          ...existingDoc[workflowPrefix],
          ...updateData,
          updated: new Date().toISOString()
        }
      };
    } else {
    documents[index] = {
        ...existingDoc,
        ...updateData,
      updated: new Date().toISOString()
    };
    }
    
    await writeDocuments(state, substate, documents);
    console.log('Document updated successfully');

    res.json(documents[index]);
  } catch (error) {
    console.error('Error updating document:', error);
    res.status(500).json({ error: 'Failed to update document', details: error.message });
  }
});

// Delete document by ID
app.delete('/api/delete/:docId', async (req, res) => {
  try {
    const { state, substate } = req.query;
    const { docId } = req.params;
    
    console.log('Deleting document:', { docId, state, substate });
    
    if (!state || !substate) {
      console.error('Missing required parameters:', { state, substate });
      return res.status(400).json({ error: 'State and substate parameters are required' });
    }

    const documents = await readDocuments(state, substate);
    console.log('Total documents before deletion:', documents.length);

    // Filter out the document to delete
    const filteredDocuments = documents.filter(doc => {
      const workflowPrefix = Object.keys(doc).find(key => key.toLowerCase().startsWith(state.toLowerCase()));
      if (workflowPrefix) {
        return !(doc[workflowPrefix]._id === docId || doc[workflowPrefix].id === docId);
      }
      return !(doc._id === docId || doc.id === docId);
    });
    
    if (filteredDocuments.length === documents.length) {
      console.error('Document not found:', docId);
      return res.status(404).json({ error: 'Document not found' });
    }
    
    await writeDocuments(state, substate, filteredDocuments);
    console.log('Document deleted successfully. Remaining documents:', filteredDocuments.length);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document', details: error.message });
  }
});

function cleanKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map(item => cleanKeys(item));
  } else if (obj !== null && typeof obj === 'object') {
    const cleanedObj = {};
    for (const [key, value] of Object.entries(obj)) {
      // Remove \n from the key
      const cleanKey = key.replace(/\n/g, '');
      cleanedObj[cleanKey] = cleanKeys(value);
    }
    return cleanedObj;
  }
  return obj;
}


// Upload document files (XLSX to JSON conversion)
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const { state, substate } = req.body;
    
    if (!state || !substate) {
      return res.status(400).json({ error: 'State and substate parameters are required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Clean up the uploaded file after processing
    await fsPromises.unlink(filePath);

    await initializeDocumentsFile(state, substate);
    
    const documents = await readDocuments(state, substate);
    const newDocuments = json.map(item => ({
      // Wrap each uploaded item under the workflowType prefix
      [state]: {
        _id: uuidv4(),
        ...item,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        SystemProperties: { P_SubState: `${state}:${substate}` }, // Set substate
      },
    }));

    documents.push(...newDocuments);
    const cleanedDocuments = cleanKeys(documents);
    await writeDocuments(state, substate, cleanedDocuments);

    res.json({ message: 'File uploaded and processed successfully', data: newDocuments });
  } catch (error) {
    console.error('Error uploading or processing file:', error);
    res.status(500).json({ error: 'Failed to upload or process file' });
  }
});

// Initialize and start server
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 