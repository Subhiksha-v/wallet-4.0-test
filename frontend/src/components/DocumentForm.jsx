import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from '../styles/DocumentForm.module.css';

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  type: yup.string().required('Document type is required'),
  vendor: yup.string().required('Vendor is required'),
  value: yup.number().typeError('Value must be a number').positive('Value must be a positive number').required('Value is required'),
  items: yup.number().typeError('Items must be an integer').integer('Items must be an integer').positive('Items must be a positive number').required('Items is required'),
  state: yup.string().required('State is required'),
});

const DocumentForm = ({ initialData, onSubmit, isSubmitting }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Title
        </label>
        <input
          type="text"
          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
          id="title"
          {...register('title')}
        />
        {errors.title && (
          <div className="invalid-feedback">{errors.title.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="type" className="form-label">
          Document Type
        </label>
        <select
          className={`form-select ${errors.type ? 'is-invalid' : ''}`}
          id="type"
          {...register('type')}
        >
          <option value="">Select Type</option>
          <option value="Purchase Requistion">Purchase Requistion</option>
          <option value="RFQ">RFQ</option>
          <option value="BID">BID</option>
        </select>
        {errors.type && (
          <div className="invalid-feedback">{errors.type.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="vendor" className="form-label">
          Vendor
        </label>
        <input
          type="text"
          className={`form-control ${errors.vendor ? 'is-invalid' : ''}`}
          id="vendor"
          {...register('vendor')}
        />
        {errors.vendor && (
          <div className="invalid-feedback">{errors.vendor.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="value" className="form-label">
          Value
        </label>
        <input
          type="number"
          step="0.01"
          className={`form-control ${errors.value ? 'is-invalid' : ''}`}
          id="value"
          {...register('value')}
        />
        {errors.value && (
          <div className="invalid-feedback">{errors.value.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="items" className="form-label">
          Items
        </label>
        <input
          type="number"
          step="1"
          className={`form-control ${errors.items ? 'is-invalid' : ''}`}
          id="items"
          {...register('items')}
        />
        {errors.items && (
          <div className="invalid-feedback">{errors.items.message}</div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="state" className="form-label">
          State
        </label>
        <select
          className={`form-select ${errors.state ? 'is-invalid' : ''}`}
          id="state"
          {...register('state')}
        >
          <option value="">Select State</option>
          <option value="pr-created">Purchase Requistion - created</option>
          <option value="pr-cancelled">Purchase Requistion - cancelled</option>
          <option value="pr-shortlist">PR shortlist</option>
          <option value="rfq-created">RFQ - created</option>
          <option value="rfq-rejected">RFQ - Rejected</option>
          <option value="bid-created">BID - created</option>
          <option value="bid-rejected">BID - Rejected</option>
          <option value="bid-cancelled">BID - Cancelled</option>
          <option value="awarded">Awarded</option>
        </select>
        {errors.state && (
          <div className="invalid-feedback">{errors.state.message}</div>
        )}
      </div>

      <div className="d-flex gap-2">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default DocumentForm; 