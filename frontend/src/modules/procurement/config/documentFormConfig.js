export const documentFormConfig = [
  {
    title: 'Basic Info',
    section: 'BasicInfo',
    fields: [
      { name: 'Plant', label: 'Plant', type: 'text', halfWidth: true },
    ],
  },
  {
    title: 'Doc Details',
    section: 'DocDetails',
    fields: [
      { name: 'DocumentNumber', label: 'Document Number', type: 'text', halfWidth: true },
      { name: 'Date', label: 'Date', type: 'date', halfWidth: true },
      { name: 'TransactionType', label: 'Transaction Type', type: 'text', halfWidth: true },
      { name: 'CurrencyType', label: 'Currency Type', type: 'text', halfWidth: true },
      { name: 'PaymentTerms', label: 'Payment Terms', type: 'number', halfWidth: true },
    ],
  },
  {
    title: 'Shipping Address',
    section: 'ShippingAddress',
    fields: [
      { name: 'ShippingAddress', label: 'Shipping Address', type: 'textarea', fullWidth: true },
    ],
  },
  {
    title: 'Billing Address',
    section: 'BillingAddress',
    fields: [
      { name: 'BillingAddress', label: 'Billing Address', type: 'textarea', fullWidth: true },
    ],
  },
  {
    title: 'Ordered Items',
    section: 'OrderedItems',
    type: 'array',
    fields: [
      { name: 'ItemName', label: 'Item Name', type: 'text' },
      { name: 'UnitPrice', label: 'Unit Price', type: 'number' },
      { name: 'Quantity', label: 'Quantity', type: 'number' },
      { name: 'Discount', label: 'Discount', type: 'number' },
      { name: 'CGST', label: 'CGST', type: 'number' },
      { name: 'SGST', label: 'SGST', type: 'number' },
      { name: 'IGST', label: 'IGST', type: 'number' },
      { name: 'Total', label: 'Total', type: 'number', readOnly: true },
    ],
  },
]; 