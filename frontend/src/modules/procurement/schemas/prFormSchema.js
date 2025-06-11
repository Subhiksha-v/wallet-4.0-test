export const prFormSchema = {
  "BillingAddress": {
    "indexes": [],
    "order": [
      "C_Address",
      "C_Street",
      "C_City",
      "C_State",
      "C_Country",
      "C_PostalCode",
      "C_PlantID",
      "C_PlantLocation",
      "C_PlantName"
    ],
    "type": "object",
    "index": 900,
    "title": "Billing Address",
    "properties": {
      "C_Country": {
        "type": "string"
      },
      "C_State": {
        "type": "string"
      },
      "C_Street": {
        "type": "string"
      },
      "C_PlantID": {
        "type": "string"
      },
      "C_PlantName": {
        "type": "string"
      },
      "C_PlantLocation": {
        "type": "string"
      },
      "C_City": {
        "type": "string"
      },
      "C_PostalCode": {
        "type": "string"
      },
      "C_Address": {
        "title": "Billing Address",
        "index": 810,
        "type": "string"
      }
    },
    "required": [
      "C_Address",
      "C_Street",
      "C_City",
      "C_State",
      "C_Country",
      "C_PostalCode",
      "C_PlantID",
      "C_PlantLocation",
      "C_PlantName"
    ]
  },
  "SystemProperties": {
    "type": "object",
    "title": "System Properties",
    "properties": {
      "P_TransactionType": {
        "type": "integer"
      },
      "P_SubState": {
        "type": "string"
      },
      "P_Attachments": {
        "items": [
          {
            "type": "object"
          }
        ],
        "type": "array"
      },
      "P_RootTxnID": {
        "type": "string"
      },
      "P_Subscribers": {
        "items": [
          {
            "type": "string"
          }
        ],
        "type": "array"
      },
      "P_SmID": {
        "type": "string"
      },
      "P_Consent": {
        "items": {},
        "type": "array"
      },
      "P_AlignedInfo": {
        "type": "integer"
      },
      "P_ShareCatalogue": {
        "type": "integer"
      },
      "P_IsClosed": {
        "type": "boolean"
      },
      "P_FormData": {
        "type": "object"
      },
      "P_ChildDocId": {
        "items": [
          {
            "type": "string"
          }
        ],
        "type": "array"
      },
      "P_RecordAdded": {
        "type": "integer"
      },
      "P_QuantityDispute": {
        "type": "boolean"
      },
      "P_DocOwner": {
        "type": "string"
      },
      "P_disambiguatingDescription": {
        "type": "string"
      },
      "P_PlantIDs": {
        "type": "object"
      }
    },
    "required": [
      "P_DocOwner",
      "P_SmID"
    ],
    "order": [
      "P_ChildDocId",
      "P_Subscribers",
      "P_Consent",
      "P_IsClosed",
      "P_RecordAdded",
      "P_FormData",
      "P_Attachments",
      "P_AlignedInfo",
      "P_DocOwner",
      "P_TransactionType",
      "P_ShareCatalogue",
      "P_RootTxnID",
      "P_SmID",
      "P_QuantityDispute",
      "P_disambiguatingDescription"
    ]
  },
  "AdditionalProperties": {
    "required": [],
    "type": "object",
    "title": "Properties",
    "index": 0,
    "properties": {}
  },
  "Buyer": {
    "title": "Buyer",
    "properties": {
      "C_Country": {
        "type": "string"
      },
      "C_PlantID": {
        "format": "PLANTS",
        "type": "string"
      },
      "C_Identifier": {
        "type": "string"
      },
      "C_AddressLocality": {
        "type": "string"
      },
      "C_PenID": {
        "type": "string"
      },
      "C_Description": {
        "type": "string"
      },
      "C_Type": {
        "type": "string",
        "enum": [
          "Supplier",
          "Customer"
        ]
      },
      "C_Organization": {
        "type": "string",
        "title": "Buyer Name",
        "index": 400
      },
      "C_Department": {
        "type": "string"
      },
      "C_PostalCode": {
        "type": "string"
      },
      "C_Email": {
        "type": "string",
        "format": "email"
      },
      "C_Region": {
        "type": "string"
      },
      "C_Telephone": {
        "type": "string"
      },
      "C_StreetAddress": {
        "type": "string"
      },
      "C_City": {
        "type": "string"
      },
      "C_InternalID": {
        "type": "string"
      },
      "C_TaxID": {
        "type": "string"
      },
      "C_LegalName": {
        "type": "string"
      }
    },
    "required": [
      "C_LegalName",
      "C_Type",
      "C_Email",
      "C_Organization",
      "C_City",
      "C_TaxID",
      "C_PostalCode",
      "C_Country",
      "C_PlantID",
      "C_InternalID",
      "C_PenID"
    ],
    "indexes": [
      "C_Organization"
    ],
    "order": [
      "C_LegalName",
      "C_Identifier",
      "C_Type",
      "C_Description",
      "C_PlantID",
      "C_InternalID",
      "C_PenID",
      "C_Telephone",
      "C_Email",
      "C_StreetAddress",
      "C_AddressLocality",
      "C_City",
      "C_TaxID",
      "C_Department",
      "C_Organization",
      "C_Region",
      "C_PostalCode",
      "C_Country"
    ],
    "type": "object",
    "format": "contact"
  },
  "OrderedItems": {
    "title": "Items",
    "format": "table",
    "items": [
      {
        "title": "Items",
        "properties": {
          "I_AdditionalProperties": {
            "type": "object"
          },
          "I_Barcode": {
            "type": "string"
          },
          "I_B_Number": {
            "type": "string"
          },
          "I_Height": {
            "type": "number"
          },
          "I_TotalPrice": {
            "title": "Gross Price",
            "type": "number"
          },
          "I_SubCategory": {
            "type": "string",
            "title": "Sub Category",
            "index": 30
          },
          "I_Category": {
            "title": "Category",
            "index": 20,
            "type": "string"
          },
          "I_Identifier": {
            "type": "string"
          },
          "I_CostPerItem": {
            "type": "number"
          },
          "I_HSNCode": {
            "type": "string"
          },
          "I_ItemOffersAddOn": {
            "type": "array",
            "title": "Item Add On",
            "items": [
              {
                "properties": {
                  "I_Price": {
                    "type": "number"
                  },
                  "I_Name": {
                    "type": "string"
                  },
                  "I_Type": {
                    "enum": [
                      "%",
                      "value"
                    ],
                    "type": "string"
                  }
                },
                "required": [],
                "indexes": [
                  "I_Type",
                  "I_Price",
                  "I_Name"
                ],
                "order": [
                  "I_Name",
                  "I_Price",
                  "I_Type"
                ],
                "type": "object"
              },
              {
                "properties": {
                  "I_Type": {
                    "type": "string",
                    "enum": [
                      "%",
                      "value"
                    ]
                  },
                  "I_Price": {
                    "type": "number"
                  },
                  "I_Name": {
                    "type": "string"
                  }
                },
                "required": [],
                "indexes": [
                  "I_Type",
                  "I_Price",
                  "I_Name"
                ],
                "order": [
                  "I_Name",
                  "I_Price",
                  "I_Type"
                ],
                "type": "object"
              },
              {
                "order": [
                  "I_Name",
                  "I_Price",
                  "I_Type"
                ],
                "type": "object",
                "properties": {
                  "I_Price": {
                    "type": "number"
                  },
                  "I_Name": {
                    "type": "string"
                  },
                  "I_Type": {
                    "type": "string",
                    "enum": [
                      "%",
                      "value"
                    ]
                  }
                },
                "required": [],
                "indexes": [
                  "I_Type",
                  "I_Price",
                  "I_Name"
                ]
              },
              {
                "properties": {
                  "I_Ref": {
                    "type": "string"
                  },
                  "I_Name": {
                    "type": "string"
                  },
                  "I_Type": {
                    "enum": [
                      "%",
                      "value"
                    ],
                    "type": "string"
                  },
                  "I_Price": {
                    "type": "number"
                  }
                },
                "required": [],
                "indexes": [
                  "I_Type",
                  "I_Price",
                  "I_Ref",
                  "I_Name"
                ],
                "order": [
                  "I_Name",
                  "I_Price",
                  "I_Type",
                  "I_Ref"
                ],
                "type": "object"
              }
            ]
          },
          "I_Weight": {
            "type": "number"
          },
          "I_B_Identifier": {
            "type": "string"
          },
          "I_S_Identifier": {
            "type": "string"
          },
          "I_ExpiryDate": {
            "type": "string",
            "format": "date"
          },
          "I_Price": {
            "type": "number",
            "title": "Unit Price",
            "index": 400
          },
          "I_Width": {
            "type": "number"
          },
          "I_SKU": {
            "type": "string"
          },
          "I_Number": {
            "type": "string"
          },
          "I_PriceCurrency": {
            "type": "string",
            "pattern": "^[a-zA-Z]{3}$"
          },
          "I_Name": {
            "title": "Item",
            "index": 100,
            "type": "string"
          },
          "I_URL": {
            "type": "string"
          },
          "I_Type": {
            "enum": [
              "Goods",
              "Services",
              "Raw Material"
            ],
            "type": "string"
          },
          "I_S_Number": {
            "type": "string"
          },
          "I_Units": {
            "type": "string",
            "enum": [
              "Kg",
              "Ton",
              "Unit"
            ]
          },
          "I_Purpose": {
            "type": "string",
            "enum": [
              "Buy",
              "Sell"
            ]
          },
          "I_Length": {
            "type": "number"
          },
          "I_Description": {
            "type": "string",
            "index": 10,
            "title": "Description"
          },
          "I_ProductionDate": {
            "format": "date",
            "type": "string"
          },
          "I_Quantity": {
            "type": "number",
            "title": "Quantity",
            "index": 500
          }
        },
        "required": [
          "I_Name",
          "I_Purpose",
          "I_Type",
          "I_Number",
          "I_Price",
          "I_PriceCurrency",
          "I_Quantity",
          "I_ItemOffersAddOn"
        ],
        "indexes": [
          "I_Identifier",
          "I_Name",
          "I_Number",
          "I_Purpose",
          "I_Description",
          "I_Type",
          "I_HSNCode",
          "I_SubCategory",
          "I_URL",
          "I_Price",
          "I_PriceCurrency",
          "I_CostPerItem",
          "I_ItemOffersAddOn",
          "I_SKU",
          "I_ProductionDate",
          "I_ExpiryDate",
          "I_Barcode",
          "I_Quantity",
          "I_Length",
          "I_Width",
          "I_Height",
          "I_Units",
          "I_Weight",
          "I_B_Identifier",
          "I_S_Identifier",
          "I_B_Number",
          "I_S_Number"
        ],
        "order": [
          "I_Identifier",
          "I_Name",
          "I_Number",
          "I_Purpose",
          "I_Description",
          "I_Type",
          "I_HSNCode",
          "I_SubCategory",
          "I_URL",
          "I_Price",
          "I_PriceCurrency",
          "I_CostPerItem",
          "I_ItemOffersAddOn",
          "I_SKU",
          "I_ProductionDate",
          "I_ExpiryDate",
          "I_Barcode",
          "I_Quantity",
          "I_Length",
          "I_Width",
          "I_Height",
          "I_Units",
          "I_Weight",
          "I_B_Identifier",
          "I_S_Identifier",
          "I_B_Number",
          "I_S_Number",
          "I_AdditionalProperties"
        ],
        "type": "object"
      }
    ],
    "index": 300,
    "type": "array"
  },
  "DocDetails": {
    "indexes": [
      "D_OrderNumber",
      "D_OrderedDate",
      "D_TotalPaymentDueMinPrice"
    ],
    "order": [
      "D_Identifier",
      "D_OrderNumber",
      "D_OrderedDate",
      "D_MinimumPaymentDuePriceCurrency",
      "D_MinimumPaymentDueMinPrice",
      "D_PaymentDueDate",
      "D_PaymentMethod",
      "D_OrderStatus",
      "D_TotalPaymentDuePriceCurrency",
      "D_TotalPaymentDueMinPrice",
      "D_ScheduledPaymentDate",
      "D_ExpectedDeliveryDate",
      "D_ExpiryDate",
      "D_PaymentTerms",
      "D_ItemCount",
      "D_OffersAddOn",
      "D_DeliveryAddress"
    ],
    "type": "object",
    "properties": {
      "D_TotalPaymentDueMinPrice": {
        "title": "Amount",
        "index": 500,
        "type": "number"
      },
      "D_Type": {
        "type": "string"
      },
      "D_OrderStatus": {
        "index": 70,
        "type": "string",
        "title": "Status"
      },
      "D_DeliveryAddress": {
        "type": "string",
        "title": "Delivery Location"
      },
      "D_MinimumPaymentDueMinPrice": {
        "type": "number"
      },
      "D_MinimumPaymentDuePriceCurrency": {
        "type": "string",
        "pattern": "^[a-zA-Z]{3}$"
      },
      "D_OffersAddOn": {
        "type": "array",
        "title": "Offer Add On",
        "items": [
          {
            "indexes": [
              "D_Type",
              "D_Price",
              "D_Name"
            ],
            "order": [
              "D_Name",
              "D_Price",
              "D_Type"
            ],
            "type": "object",
            "properties": {
              "D_Name": {
                "type": "string"
              },
              "D_Type": {
                "enum": [
                  "%",
                  "value"
                ],
                "type": "string"
              },
              "D_Price": {
                "type": "integer"
              }
            },
            "required": []
          },
          {
            "properties": {
              "D_Name": {
                "type": "string"
              },
              "D_Type": {
                "enum": [
                  "%",
                  "value"
                ],
                "type": "string"
              },
              "D_Price": {
                "type": "integer"
              }
            },
            "required": [],
            "indexes": [
              "D_Type",
              "D_Price",
              "D_Name"
            ],
            "order": [
              "D_Name",
              "D_Price",
              "D_Type"
            ],
            "type": "object"
          },
          {
            "order": [
              "D_Name",
              "D_Price",
              "D_Type"
            ],
            "type": "object",
            "properties": {
              "D_Name": {
                "type": "string"
              },
              "D_Type": {
                "type": "string",
                "enum": [
                  "%",
                  "value"
                ]
              },
              "D_Price": {
                "type": "integer"
              }
            },
            "required": [],
            "indexes": [
              "D_Type",
              "D_Price",
              "D_Name"
            ]
          },
          {
            "properties": {
              "D_Ref": {
                "type": "string"
              },
              "D_Name": {
                "type": "string"
              },
              "D_Type": {
                "enum": [
                  "%",
                  "value"
                ],
                "type": "string"
              },
              "D_Price": {
                "type": "integer"
              }
            },
            "required": [],
            "indexes": [
              "D_Type",
              "D_Price",
              "D_Ref",
              "D_Name"
            ],
            "order": [
              "D_Name",
              "D_Price",
              "D_Type",
              "D_Ref"
            ],
            "type": "object"
          }
        ]
      },
      "D_OrderNumber": {
        "title": "Document Number",
        "link": "_id",
        "index": 200,
        "type": "string"
      },
      "D_OrderedDate": {
        "format": "date",
        "title": "Date",
        "index": 100,
        "type": "string"
      },
      "D_ItemCount": {
        "type": "integer"
      },
      "D_PaymentDueDate": {
        "format": "date",
        "type": "string"
      },
      "D_PaymentTerms": {
        "type": "integer"
      },
      "D_ScheduledPaymentDate": {
        "type": "string",
        "format": "date"
      },
      "D_TotalPaymentDuePriceCurrency": {
        "type": "string",
        "pattern": "^[a-zA-Z]{3}$"
      },
      "D_PaymentMethod": {
        "type": "string"
      },
      "D_ExpectedDeliveryDate": {
        "format": "date",
        "type": "string"
      },
      "D_Identifier": {
        "type": "string"
      },
      "D_ExpiryDate": {
        "format": "date",
        "type": "string"
      }
    },
    "required": [
      "D_Identifier",
      "D_OrderNumber",
      "D_TotalPaymentDuePriceCurrency",
      "D_TotalPaymentDueMinPrice",
      "D_PaymentTerms",
      "D_OrderedDate",
      "D_OrderStatus"
    ],
    "index": 100
  },
  "ShippingAddress": {
    "index": 800,
    "title": "Shipping Address",
    "properties": {
      "C_PlantLocation": {
        "type": "string"
      },
      "C_Country": {
        "type": "string"
      },
      "C_PostalCode": {
        "type": "string"
      },
      "C_PlantName": {
        "type": "string"
      },
      "C_State": {
        "type": "string"
      },
      "C_PlantID": {
        "type": "string"
      },
      "C_Street": {
        "type": "string"
      },
      "C_City": {
        "type": "string"
      },
      "C_Address": {
        "title": "Shipping Address",
        "index": 810,
        "type": "string"
      }
    },
    "required": [
      "C_Address",
      "C_Street",
      "C_City",
      "C_State",
      "C_Country",
      "C_PostalCode",
      "C_PlantID",
      "C_PlantLocation",
      "C_PlantName"
    ],
    "indexes": [],
    "order": [
      "C_Address",
      "C_Street",
      "C_City",
      "C_State",
      "C_Country",
      "C_PostalCode",
      "C_PlantID",
      "C_PlantLocation",
      "C_PlantName"
    ],
    "type": "object"
  },
  "ReferencesOrder": {
    "title": "Reference Order",
    "properties": {
      "R_DiscountCode": {
        "type": "string"
      },
      "R_Discount": {
        "type": "number"
      },
      "R_DiscountCurrency": {
        "maxLength": 3,
        "minLength": 3,
        "type": "string"
      },
      "R_PaymentDueDate": {
        "format": "date",
        "type": "string"
      },
      "R_OrderStatus": {
        "type": "string"
      },
      "R_OrderedDate": {
        "type": "string",
        "format": "date"
      },
      "R_OrderNumber": {
        "index": 250,
        "type": "string",
        "title": "Parent Doc",
        "link": "ReferencesOrder.R_Identifier"
      },
      "R_Identifier": {
        "type": "string"
      }
    },
    "required": [],
    "indexes": [
      "R_Identifier"
    ],
    "order": [
      "R_OrderNumber",
      "R_Identifier",
      "R_DiscountCode",
      "R_Discount",
      "R_DiscountCurrency",
      "R_PaymentDueDate",
      "R_OrderStatus",
      "R_OrderedDate"
    ],
    "type": "object"
  },
  "Seller": {
    "properties": {
      "C_TaxID": {
        "type": "string"
      },
      "C_Description": {
        "type": "string"
      },
      "C_Identifier": {
        "type": "string"
      },
      "C_LegalName": {
        "type": "string"
      },
      "C_Country": {
        "type": "string"
      },
      "C_Organization": {
        "index": 300,
        "type": "string",
        "title": "Seller Name"
      },
      "C_Type": {
        "enum": [
          "Supplier",
          "Customer"
        ],
        "type": "string"
      },
      "C_Region": {
        "type": "string"
      },
      "C_Telephone": {
        "type": "string"
      },
      "C_PenID": {
        "format": "PLANTS",
        "type": "string"
      },
      "C_Email": {
        "format": "email",
        "type": "string"
      },
      "C_StreetAddress": {
        "type": "string"
      },
      "C_AddressLocality": {
        "type": "string"
      },
      "C_PostalCode": {
        "type": "string"
      },
      "C_Department": {
        "type": "string"
      },
      "C_City": {
        "type": "string"
      },
      "C_InternalID": {
        "type": "string"
      },
      "C_PlantID": {
        "type": "string"
      }
    },
    "required": [
      "C_LegalName",
      "C_Type",
      "C_Email",
      "C_Organization",
      "C_City",
      "C_TaxID",
      "C_PostalCode",
      "C_Country",
      "C_PlantID",
      "C_InternalID",
      "C_PenID"
    ],
    "indexes": [
      "C_Organization"
    ],
    "format": "contact",
    "index": 200,
    "order": [
      "C_LegalName",
      "C_Identifier",
      "C_Type",
      "C_Description",
      "C_PlantID",
      "C_InternalID",
      "C_PenID",
      "C_Telephone",
      "C_Email",
      "C_StreetAddress",
      "C_AddressLocality",
      "C_City",
      "C_TaxID",
      "C_Department",
      "C_Organization",
      "C_Region",
      "C_PostalCode",
      "C_Country"
    ],
    "type": "object",
    "title": "Seller"
  }
}; 