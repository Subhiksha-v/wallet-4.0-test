import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getDocumentById, createDocument, updateDocument } from '../../services/documentService';
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

  // Extract workflowType and stateFilter from URL
  const workflowType = location.pathname.split('/')[2];
  const queryParams = new URLSearchParams(location.search);
  const stateParam = queryParams.get('state');
  const stateFilter = stateParam?.includes('-') ? stateParam.split('-')[1] : stateParam;
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

  useEffect(() => {
    console.log('DocumentForm useEffect running'); // Added console log
    if (id) {
      setIsEditMode(true);
      const fetchDocument = async () => {
        try {
          setLoading(true);
          // Pass state and substate to getDocumentById
          const data = await getDocumentById(id, workflowType, substate);
          if (data) {
            console.log('Fetched document data:', data); // Add logging
            const unflattenedData = unflattenObject(data);
            console.log('Unflattened document data for form:', unflattenedData); // Add logging
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
  }, [id, reset, workflowType, substate]); // Add dependencies

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // Calculate the overall total before submission
      const overallTotal = calculateOverallTotal();
      const finalData = {
        ...data,
        OverallTotal: parseFloat(overallTotal),
        type: workflowType.toUpperCase(), // Add document type based on workflow
        state: workflowType, // Pass workflowType as state
        substate: substate // Pass substate
      };

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
          navigate(`/procurement/${workflowType}?state=${workflowType}-${stateFilter}`);
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
    <div className="container mt-4">
      <h2 className="mb-4">{isEditMode ? 'Edit' : 'Add'} Purchase Requisition</h2>
      <form onSubmit={handleSubmit(onSubmit)}>

        {documentFormConfig.map(sectionConfig => (
          <div key={sectionConfig.section} className="card mb-4">
            <div className={`card-header ${styles.cardHeader}`}>{sectionConfig.title}</div>
          <div className="card-body row">
              {sectionConfig.type !== 'array' ? (
                sectionConfig.fields.map(field => (
                  <div key={field.name} className={field.halfWidth ? "col-md-6" : "col-md-12"}>
              <div className="mb-3">
                      <label htmlFor={field.name} className="form-label">{field.label}</label>
                <Controller
                        name={`${sectionConfig.section}.${field.name}`}
                  control={control}
                        render={({ field: controllerField }) => {
                          const isInvalid = errors[sectionConfig.section]?.[field.name];
                          const commonProps = {
                            className: `form-control ${isInvalid ? 'is-invalid' : ''}`,
                            id: field.name,
                            ...controllerField,
                          };

                          if (field.type === 'date') {
                            return (
                    <DatePicker
                                selected={controllerField.value ? new Date(controllerField.value) : null}
                                onChange={(date) => controllerField.onChange(date ? date.toISOString().split('T')[0] : '')}
                      dateFormat="yyyy-MM-dd"
                                {...commonProps}
                              />
                            );
                          } else if (field.type === 'textarea') {
                            return (
                              <>
                                <textarea rows="3" {...commonProps}></textarea>
                                {isInvalid && isInvalid.message && <div className="invalid-feedback">{isInvalid.message}</div>}
                              </>
                            );
                          } else {
                            return (
                              <>
                                <input type={field.type} {...commonProps} />
                                {isInvalid && isInvalid.message && <div className="invalid-feedback">{isInvalid.message}</div>}
                              </>
                            );
                          }
                        }}
                      />
              </div>
            </div>
                ))
              ) : (
                // Render for Ordered Items (array type)
                <div className="col-md-12">
                  <button
                    type="button"
                    onClick={() => append({ ItemName: '', UnitPrice: '', Quantity: '', Discount: '', CGST: '', SGST: '', IGST: '', Total: '' })}
                    className="btn btn-primary mb-3"
                  >
                    Add Item
                  </button>
            <div className="table-responsive">
                    <table className="table table-bordered align-middle">
                <thead>
                  <tr>
                          {sectionConfig.fields.map(field => (
                            <th key={field.name}>{field.label}</th>
                          ))}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((item, index) => (
                    <tr key={item.id}>
                            {sectionConfig.fields.map(field => (
                              <td key={field.name}>
                        <Controller
                                  name={`OrderedItems.${index}.${field.name}`}
                          control={control}
                                  render={({ field: controllerField }) => {
                                    const isInvalid = errors.OrderedItems?.[index]?.[field.name];
                                    const commonProps = {
                                      className: `form-control ${isInvalid ? 'is-invalid' : ''}`,
                                      ...controllerField,
                                    };
                                    if (field.type === 'number') {
                                      commonProps.step = '0.01';
                                      if (field.name === 'Quantity') commonProps.step = '1';
                                      commonProps.onChange = (e) => {
                                        controllerField.onChange(e);
                                        const newItems = [...orderedItems];
                                        newItems[index][field.name] = parseFloat(e.target.value) || 0;
                                        setValue(`OrderedItems.${index}.Total`, calculateTotal(newItems[index]));
                                      };
                                    }
                                    if (field.readOnly) {
                                        commonProps.readOnly = true;
                                    }
                                    return (
                                      <>
                                        <input
                                          type={field.type}
                                          {...commonProps}
                                        />
                                        {isInvalid && isInvalid.message && <div className="invalid-feedback">{isInvalid.message}</div>}
                                      </>
                                    );
                                  }}
                                />
                      </td>
                            ))}
                            <td>
                              <button type="button" onClick={() => remove(index)} className="btn btn-danger btn-sm">
                                <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
              <div className="text-end mt-3">
                    <h5>Overall Total: ₹{calculateOverallTotal()}</h5>
                  </div>
              </div>
            )}
          </div>
        </div>
        ))}

        <button type="submit" className="btn btn-success me-2" disabled={loading}>
          {isEditMode ? 'Update' : 'Create'} Document
        </button>
        <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">
          Back
        </button>
      </form>
    </div>
  );
};

export default DocumentForm; 