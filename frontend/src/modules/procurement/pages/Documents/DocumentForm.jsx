import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getDocumentById, createDocument, updateDocument, deleteDocument } from '../../services/documentService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import styles from '../../../../styles/Form.module.css';
import { documentFormConfig } from '../../config/documentFormConfig';

// Helper to unflatten a nested object (inverse of flattenObject in backend)
export const unflattenObject = (obj) => {
  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const parts = key.split('.');
      let current = result;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
          current[part] = obj[key];
        } else {
          if (!current[part] || typeof current[part] !== 'object' || Array.isArray(current[part])) {
            current[part] = {};
          }
          current = current[part];
        }
      }
    }
  }
  return result;
};

const generateValidationSchema = (config) => {
  const schemaFields = {};

  config.forEach(sectionConfig => {
    if (sectionConfig.type === 'array') {
      // For ordered items, create a schema for each item in the array
      const itemSchemaFields = {};
      sectionConfig.fields.forEach(field => {
        let fieldSchema = yup.number().typeError(`${field.label} must be a number`);
        if (field.name === 'ItemName') {
          fieldSchema = yup.string();
        }
        if (field.name === 'Discount' || field.name === 'CGST' || field.name === 'SGST' || field.name === 'IGST' || field.name === 'Total') {
          fieldSchema = fieldSchema.min(0, `${field.label} cannot be negative`);
        }
        if (field.name === 'Quantity') {
          fieldSchema = fieldSchema.integer('Quantity must be an integer').positive('Quantity must be a positive number');
        }
        if (!field.readOnly) { // Only require fields that are not read-only
          fieldSchema = fieldSchema.required(`${field.label} is required`);
        }
        itemSchemaFields[field.name] = fieldSchema;
      });
      schemaFields[sectionConfig.section] = yup.array().of(yup.object().shape(itemSchemaFields)).min(1, 'At least one item is required');
    } else {
      // For regular sections (BasicInfo, DocDetails, ShippingAddress, BillingAddress)
      const sectionSchemaFields = {};
      sectionConfig.fields.forEach(field => {
        let fieldSchema;
        if (field.type === 'number') {
          fieldSchema = yup.number().typeError(`${field.label} must be a number`);
          if (field.name === 'PaymentTerms') {
            fieldSchema = fieldSchema.integer('Payment Terms must be an integer').positive('Payment Terms must be a positive number');
          }
        } else if (field.type === 'email') {
          fieldSchema = yup.string().email('Invalid email format');
        } else {
          fieldSchema = yup.string();
        }
        sectionSchemaFields[field.name] = fieldSchema.required(`${field.label} is required`);
      });
      schemaFields[sectionConfig.section] = yup.object().shape(sectionSchemaFields);
    }
  });
  return yup.object().shape(schemaFields);
};

const prValidationSchema = generateValidationSchema(documentFormConfig);

const DocumentForm = () => {
  console.log('Rendering DocumentForm'); // Added console log
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Get location object
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Check if it's a state transition
  const isStateTransition = location.state?.isStateTransition || false;
  const originalDocumentId = location.state?.originalDocumentId;
  const originalDocumentData = location.state?.originalDocumentData;
  const newState = location.state?.newState;
  const newSubstate = location.state?.newSubstate;
  const originalWorkflowType = location.state?.originalWorkflowType;
  const originalState = location.state?.originalState;
  const originalSubstate = location.state?.originalSubstate;

  // Extract workflowType and stateFilter from URL
  const workflowType = location.pathname.split('/')[2];
  const queryParams = new URLSearchParams(location.search);
  const stateParam = queryParams.get('state');
  const stateFilter = stateParam?.includes('-') ? stateParam.split('-')[1] : stateParam; // Default to created state
  const substate = stateFilter; // substate will be the same as stateFilter

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(prValidationSchema),
    defaultValues: (() => {
      const defaults = {};
      documentFormConfig.forEach(sectionConfig => {
        if (sectionConfig.type === 'array') {
          defaults[sectionConfig.section] = [];
        } else {
          defaults[sectionConfig.section] = {};
          sectionConfig.fields.forEach(field => {
            defaults[sectionConfig.section][field.name] = '';
          });
        }
      });
      return defaults;
    })(),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'OrderedItems',
  });

  // Watch the items array for changes to calculate total dynamically
  const orderedItems = watch('OrderedItems');
  const currencyType = watch('DocDetails.CurrencyType'); // Watch CurrencyType

  useEffect(() => {
    console.log('DocumentForm useEffect running'); // Added console log
    if (isStateTransition && originalDocumentData) {
      setIsEditMode(false); // It's a new document being created from a transition
      setLoading(false);
      const unflattenedData = unflattenObject(originalDocumentData);
      reset(unflattenedData);
      // Update state and substate values in the form to reflect the new state
      setValue('DocDetails.State', newState);
      setValue('DocDetails.SubState', newSubstate);
    } else if (id) {
      setIsEditMode(true);
      const fetchDocument = async () => {
        try {
          setLoading(true);
          // Pass state and substate to getDocumentById
          const data = await getDocumentById(id, workflowType, substate);
          if (data) {
            console.log('Fetched document data:', data);
            const unflattenedData = unflattenObject(data);
            console.log('Unflattened document data for form:', unflattenedData);
            reset(unflattenedData); // Populate form with fetched data
          } else {
            setError('Document not found');
          }
        } catch (err) {
          setError('Failed to fetch document');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchDocument();
    } else {
      setIsEditMode(false);
      setLoading(false);
      reset(); // Reset form for new document using default values
    }
  }, [id, reset, workflowType, substate, isStateTransition, originalDocumentData, newState, newSubstate, setValue]); // Add dependencies

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // Calculate the overall total before submission
      const overallTotal = calculateOverallTotal();
      let finalData = {
        ...data,
        OverallTotal: parseFloat(overallTotal),
        type: workflowType.toUpperCase(), // Add document type based on workflow
        state: workflowType, // Pass workflowType as state
        substate: substate // Pass substate
      };

      if (isStateTransition) {
        // Override state and substate with the new transition values
        finalData = {
          ...finalData,
          state: newState,
          substate: newSubstate,
          type: newState.toUpperCase(), // Update the type to match the new state
          // Ensure that the original document ID is NOT sent for creation
          _id: undefined, 
          id: undefined, 
        };
      }

      console.log('Submitting form data:', finalData);
      
      if (isEditMode) {
        const response = await updateDocument(id, finalData);
        console.log('Update response:', response);
        if (response) {
          alert('Document updated successfully!');
          navigate(`/procurement/${workflowType}?state=${workflowType}-${stateFilter}`);
        }
      } else {
        const response = await createDocument(finalData);
        console.log('Create response:', response);
        if (response) {
          alert('Document created successfully!');
          // If it was a state transition, delete the original document
          if (isStateTransition && originalDocumentId) {
            try {
              await deleteDocument(originalDocumentId, originalWorkflowType, originalSubstate);
              console.log(`Original document ${originalDocumentId} deleted successfully from ${originalWorkflowType}-${originalSubstate}`);
            } catch (deleteErr) {
              console.error('Failed to delete original document:', deleteErr);
              alert('Document created, but failed to delete original: ' + deleteErr.message);
            }
          }
          navigate(`/procurement/${newState}?state=${newState}-${newSubstate}`);
        }
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError(`Failed to ${isEditMode ? 'update' : 'create'} document: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total for an item row
  const calculateTotal = (item) => {
    const unitPrice = parseFloat(item?.UnitPrice) || 0;
    const quantity = parseInt(item?.Quantity, 10) || 0;
    const discount = parseFloat(item?.Discount) || 0;
    // Assuming CGST, SGST, IGST are included in the item object for calculation
    const cgst = parseFloat(item?.CGST) || 0;
    const sgst = parseFloat(item?.SGST) || 0;
    const igst = parseFloat(item?.IGST) || 0;

    // Calculate subtotal: (Unit Price × Quantity) - Discount
    const subtotal = (unitPrice * quantity) - discount;
    
    // Add taxes to subtotal
    const total = subtotal + cgst + sgst + igst;
    
    return total.toFixed(2); // Format to 2 decimal places
  };

  // Calculate overall total for all items
  const calculateOverallTotal = () => {
    if (!orderedItems || orderedItems.length === 0) return '0.00';
    
    const total = orderedItems.reduce((sum, item) => {
      return sum + parseFloat(calculateTotal(item));
    }, 0);
    
    return total.toFixed(2);
  };

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
    <div className={`container-fluid ${styles.formContainer}`}>
      <h2 className="mb-4">
        {isEditMode 
          ? `Edit ${workflowType.charAt(0).toUpperCase() + workflowType.slice(1)} Document`
          : isStateTransition 
            ? `Create ${newState}`
            : `Create New ${workflowType.charAt(0).toUpperCase() + workflowType.slice(1)} Document`
        }
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        {/* Basic Information Section */}
        {documentFormConfig.map(sectionConfig => {
          if (sectionConfig.type === 'array') {
            // Render ordered items section
            return (
              <div key={sectionConfig.section} className="mb-4 p-3 border rounded shadow-sm">
                <h3 className="h5 mb-3 text-primary">{sectionConfig.label}</h3>
                <div className="table-responsive">
                  <table className="table table-bordered align-middle">
                    <thead>
                      <tr>
                        {sectionConfig.fields.map(field => (
                          <th key={field.name}>{field.label}</th>
                        ))}
                        <th>Total</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fields.map((item, index) => (
                        <tr key={item.id}>
                          {sectionConfig.fields.map(field => (
                            <td key={field.name}>
                              <Controller
                                name={`${sectionConfig.section}.${index}.${field.name}`}
                                control={control}
                                render={({ field: controllerField }) => (
                                  field.type === 'select' ? (
                                    <select
                                      id={`${sectionConfig.section}.${index}.${field.name}`}
                                      {...controllerField}
                                      className={`form-select ${errors[sectionConfig.section]?.[index]?.[field.name] ? 'is-invalid' : ''}`}
                                      disabled={field.readOnly && isEditMode} // Disable if readOnly and in edit mode
                                    >
                                      <option value="">Select...</option>
                                      {field.options.map(option => (
                                        <option key={option.value} value={option.value}>
                                          {option.label}
                                        </option>
                                      ))}
                                    </select>
                                  ) : field.type === 'date' ? (
                                    <DatePicker
                                      id={`${sectionConfig.section}.${index}.${field.name}`}
                                      selected={controllerField.value ? new Date(controllerField.value) : null}
                                      onChange={(date) => controllerField.onChange(date ? date.toISOString() : null)}
                                      className={`form-control ${errors[sectionConfig.section]?.[index]?.[field.name] ? 'is-invalid' : ''}`}
                                      dateFormat="yyyy-MM-dd"
                                      disabled={field.readOnly && isEditMode} // Disable if readOnly and in edit mode
                                    />
                                  ) : (
                                    <input
                                      type={field.type}
                                      id={`${sectionConfig.section}.${index}.${field.name}`}
                                      {...controllerField}
                                      className={`form-control ${errors[sectionConfig.section]?.[index]?.[field.name] ? 'is-invalid' : ''}`}
                                      placeholder={field.placeholder}
                                      readOnly={field.readOnly && isEditMode} // Read-only if readOnly and in edit mode
                                      onBlur={(e) => {
                                        // Update total when quantity or unit price changes
                                        if (field.name === 'Quantity' || field.name === 'UnitPrice' || field.name === 'Discount' || field.name === 'CGST' || field.name === 'SGST' || field.name === 'IGST') {
                                          const updatedItem = { ...orderedItems[index], [field.name]: e.target.value };
                                          setValue(`${sectionConfig.section}.${index}.Total`, calculateTotal(updatedItem));
                                        }
                                        controllerField.onBlur(e);
                                      }}
                                    />
                                  )
                                )}
                              />
                              {errors[sectionConfig.section]?.[index]?.[field.name] && (
                                <div className="invalid-feedback">
                                  {errors[sectionConfig.section][index][field.name].message}
                                </div>
                              )}
                            </td>
                          ))}
                          <td>
                            <input
                              type="number"
                              id={`${sectionConfig.section}.${index}.Total`}
                              {...control.register(`${sectionConfig.section}.${index}.Total`)}
                              className="form-control"
                              readOnly
                              value={calculateTotal(orderedItems[index])}
                            />
                          </td>
                          <td>
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="btn btn-sm btn-outline-danger"
                              aria-label="Remove Item"
                            >
                              <i className="bi bi-x-lg"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  onClick={() => append({ ItemName: '', Description: '', UnitPrice: 0, Quantity: 0, Discount: 0, CGST: 0, SGST: 0, IGST: 0, Total: 0 })}
                  className="btn btn-outline-primary mt-3"
                >
                  <i className="bi bi-plus-circle me-2"></i>Add Item
                </button>
              </div>
            );
          } else {
            // Render regular sections
            return (
              <div key={sectionConfig.section} className="mb-4 p-3 border rounded shadow-sm">
                <h3 className="h5 mb-3 text-primary">{sectionConfig.label}</h3>
                <div className="row g-3">
                  {sectionConfig.fields.map(field => (
                    <div key={field.name} className={`col-md-${field.width}`}>
                      <label htmlFor={`${sectionConfig.section}.${field.name}`} className="form-label fw-bold">
                        {field.label}
                      </label>
                      <Controller
                        name={`${sectionConfig.section}.${field.name}`}
                        control={control}
                        render={({ field: controllerField }) => (
                          field.type === 'select' ? (
                            <select
                              id={`${sectionConfig.section}.${field.name}`}
                              {...controllerField}
                              className={`form-select ${errors[sectionConfig.section]?.[field.name] ? 'is-invalid' : ''}`}
                              disabled={field.readOnly && isEditMode} // Disable if readOnly and in edit mode
                            >
                              <option value="">Select...</option>
                              {field.options.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : field.type === 'date' ? (
                            <DatePicker
                              id={`${sectionConfig.section}.${field.name}`}
                              selected={controllerField.value ? new Date(controllerField.value) : null}
                              onChange={(date) => controllerField.onChange(date ? date.toISOString() : null)}
                              className={`form-control ${errors[sectionConfig.section]?.[field.name] ? 'is-invalid' : ''}`}
                              dateFormat="yyyy-MM-dd"
                              disabled={field.readOnly && isEditMode} // Disable if readOnly and in edit mode
                            />
                          ) : (
                            <input
                              type={field.type}
                              id={`${sectionConfig.section}.${field.name}`}
                              {...controllerField}
                              className={`form-control ${errors[sectionConfig.section]?.[field.name] ? 'is-invalid' : ''}`}
                              placeholder={field.placeholder}
                              readOnly={field.readOnly && isEditMode} // Read-only if readOnly and in edit mode
                            />
                          )
                        )}
                      />
                      {errors[sectionConfig.section]?.[field.name] && (
                        <div className="invalid-feedback">
                          {errors[sectionConfig.section][field.name].message}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          }
        })}

        <div className="mb-4 p-3 border rounded shadow-sm" style={{ backgroundColor: '#e9ecef' }}>
          <h3 className="h5 mb-3 text-primary">Overall Total</h3>
          <input
            type="text"
            className="form-control form-control-lg"
            value={
              calculateOverallTotal() !== null ? 
              `${
                currencyType === 'INR' ? '₹' : 
                currencyType === 'USD' ? '$' : 
                '' // Default to no symbol if not INR or USD
              }${calculateOverallTotal().toLocaleString()}`
              : '—'
            }
            readOnly
          />
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : isEditMode ? (
              'Update Document'
            ) : (
              'Create Document'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentForm; 