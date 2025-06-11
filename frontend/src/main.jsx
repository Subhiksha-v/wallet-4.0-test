// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { ProcurementProvider } from './modules/procurement/context/ProcurementContext';
import parseStateMachine from './modules/procurement/utils/stateMachineParser';

// Import the state machine JSON (assuming it's in a specific location or passed down)
// For now, let's hardcode it here for demonstration
const purchaseRequisitionStateMachine = {
  "_id": "public:0xdfba41efa39db71652f45453922135caf84984cc5d95835a18f6d6e729dae561_PurchaseReq",
  "AppType": "CommerceSM",
  "Base_sm": "@statemachine/extendedCommerceSM:public:0x161f0430cae79713cda4e848416f2f561704048d5ac40d6ed0f5829fda2ac1a7",
  "Branch": false,
  "Category": "Apps",
  "Desc": "The Core Protocol Commerce StateMachine for P2P SaaS",
  "ExchangeParamID": [
    {
      "paramID": "0x5e282dE188b68864e3B140287640c075C46F4fF4",
      "publicKey": "133e15a25b2657b7d3177ca1281a261099db2fdc9993209b853690fc7ce805fbb75fe5fd9bd839509de8a67fde8afc1cf24f3743272f06cf4f1ac87b2a64bf90"
    }
  ],
  "Index": -4,
  "Name": "Purchase Requisition",
  "Organizations": [
    {
      "Teams": [
        {
          "Desc": "Buyer",
          "Role": "Buyer"
        }
      ],
      "Name": "Buyer",
      "Desc": "Buyer"
    },
    {
      "Name": "Seller",
      "Desc": "Seller",
      "Teams": [
        {
          "Desc": "Seller",
          "Role": "Seller"
        }
      ]
    }
  ],
  "Props": {
    "Icon": 102,
    "BgColor": "#E7F7FF",
    "Buyer": "0x8DeE40B609c4b89E8075990C0E7130CDD04065d8"
  },
  "Roles": [
    "Buyer",
    "Seller"
  ],
  "StartAt": "PurchaseReq",
  "States": {
    "AcceptNote": {
      "Desc": "Accept Note",
      "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
      "Owner": [
        "Seller"
      ],
      "Props": null,
      "End": true,
      "SubStates": {},
      "Visibility": {
        "Seller": true,
        "Buyer": true
      }
    },
    "Contract": {
      "Desc": "Contract",
      "SubStates": {},
      "Visibility": {
        "Seller": true,
        "Buyer": true
      },
      "NextState": "Orders",
      "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
      "Owner": [
        "Buyer",
        "Seller"
      ],
      "Props": null
    },
    "BID": {
      "CollectionLoc": "BID_0x44568D2535f2DEf8fEEC08d5FbC9c8F1ae56D5A7",
      "Schema": "@schema/Commerce:public:0x9c85de2c6bcdd3fcb4b648abc731301a8c0b0cd6be7b1ce005367304332682c3",
      "Desc": "BID",
      "Owner": [
        "Buyer",
        "Seller"
      ],
      "NextState": "Awarded",
      "Props": {
        "Edit": true,
        "Flip": true
      },
      "Visibility": {
        "Seller": true,
        "Buyer": true
      },
      "SubStates": {
        "Cancelled": {
          "End": true,
          "Owner": [
            "Buyer",
            "Seller"
          ],
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "Rule": null
        },
        "Created": {
          "Owner": [
            "Buyer",
            "Seller"
          ],
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "Rule": null,
          "Start": true,
          "NextState": "Rejected"
        },
        "Rejected": {
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "Rule": null,
          "NextState": "Cancelled",
          "Owner": [
            "Buyer",
            "Seller"
          ]
        }
      },
      "AttachStates": []
    },
    "RFQ": {
      "AttachStates": [],
      "Visibility": {
        "Buyer": true,
        "Seller": true
      },
      "Schema": "@schema/Commerce:public:0x9c85de2c6bcdd3fcb4b648abc731301a8c0b0cd6be7b1ce005367304332682c3",
      "SubStates": {
        "Created": {
          "Visibility": {
            "Buyer": true,
            "Seller": true
          },
          "Rule": null,
          "Start": true,
          "NextState": "Rejected",
          "Owner": [
            "Buyer",
            "Seller"
          ]
        },
        "Rejected": {
          "Owner": [
            "Buyer",
            "Seller"
          ],
          "Visibility": {
            "Buyer": true,
            "Seller": true
          },
          "Rule": null,
          "End": true
        }
      },
      "Owner": [
        "Buyer",
        "Seller"
      ],
      "NextState": "BID",
      "Desc": "RFQ",
      "Props": {
        "Edit": true,
        "Flip": true
      },
      "CollectionLoc": "RFQ_0x44568D2535f2DEf8fEEC08d5FbC9c8F1ae56D5A7"
    },
    "Invoice": {
      "Visibility": {
        "Seller": true,
        "Buyer": true
      },
      "NextState": "Payment",
      "AttachStates": [
        "GRN",
        "DebitNote",
        "CreditNote"
      ],
      "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
      "Owner": [
        "Seller"
      ],
      "Props": null,
      "Desc": "Invoice",
      "SubStates": {}
    },
    "Payment": {
      "Desc": "Payment",
      "NextState": "DigitalReceipt",
      "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
      "SubStates": {},
      "Visibility": {
        "Buyer": true,
        "Seller": true
      },
      "Owner": [
        "Buyer"
      ],
      "Props": null
    },
    "CreditNote": {
      "Visibility": {
        "Buyer": true,
        "Seller": true
      },
      "End": true,
      "Desc": "Credit Note",
      "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
      "Owner": [
        "Buyer"
      ],
      "Props": null,
      "SubStates": {}
    },
    "Awarded": {
      "CollectionLoc": "Awarded_0x44568D2535f2DEf8fEEC08d5FbC9c8F1ae56D5A7",
      "Desc": "Awarded",
      "Visibility": {
        "Buyer": true,
        "Seller": true
      },
      "AttachStates": [],
      "SubStates": {},
      "Owner": [
        "Buyer"
      ],
      "Props": {
        "Flip": true,
        "Edit": true
      },
      "NextState": "Contract",
      "Schema": "@schema/Commerce:public:0x9c85de2c6bcdd3fcb4b648abc731301a8c0b0cd6be7b1ce005367304332682c3"
    },
    "PRShortlist": {
      "NextState": "RFQ",
      "CollectionLoc": "PRShortlist_0x44568D2535f2DEf8fEEC08d5FbC9c8F1ae56D5A7",
      "AttachStates": [],
      "Schema": "@schema/Commerce:public:0x9c85de2c6bcdd3fcb4b648abc731301a8c0b0cd6be7b1ce005367304332682c3",
      "Visibility": {
        "Buyer": true,
        "Seller": true
      },
      "SubStates": {},
      "Props": {
        "Flip": true,
        "Edit": true
      },
      "Desc": "PRShortlist",
      "Owner": [
        "Buyer"
      ]
    },
    "Orders": {
      "Owner": [
        "Buyer"
      ],
      "SubStates": {},
      "Visibility": {
        "Buyer": true,
        "Seller": true
      },
      "Props": null,
      "Desc": "Orders",
      "NextState": "Invoice",
      "AttachStates": [
        "AcceptNote"
      ],
      "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9"
    },
    "DigitalReceipt": {
      "End": true,
      "Desc": "Digital Receipt",
      "SubStates": {},
      "Visibility": {
        "Seller": true,
        "Buyer": true
      },
      "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
      "Owner": [
        "Seller"
      ],
      "Props": null
    },
    "GRN": {
      "Owner": [
        "Buyer"
      ],
      "SubStates": {},
      "Visibility": {
        "Buyer": true,
        "Seller": true
      },
      "Props": null,
      "End": true,
      "Desc": "GRN",
      "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9"
    },
    "DebitNote": {
      "Desc": "Debit Note",
      "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
      "Owner": [
        "Buyer"
      ],
      "SubStates": {},
      "Visibility": {
        "Buyer": true,
        "Seller": true
      },
      "Props": null,
      "End": true
    },
    "PurchaseReq": {
      "Schema": "@schema/Commerce:public:0x9c85de2c6bcdd3fcb4b648abc731301a8c0b0cd6be7b1ce005367304332682c3",
      "Owner": [
        "Buyer"
      ],
      "Props": {
        "Edit": true,
        "Flip": true
      },
      "Desc": "Purchase Requisition",
      "SubStates": {
        "Cancelled": {
          "Owner": [
            "Buyer"
          ],
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "Rule": null,
          "End": true
        },
        "Created": {
          "Start": true,
          "NextState": "Cancelled",
          "Owner": [
            "Buyer"
          ],
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "Rule": null
        }
      },
      "Visibility": {
        "Buyer": true,
        "Seller": true
      },
      "NextState": "PRShortlist"
    }
  },
  "installed": 1,
  "orgParamID": "0x44568D2535f2DEf8fEEC08d5FbC9c8F1ae56D5A7",
  "smID": "public:0xdfba41efa39db71652f45453922135caf84984cc5d95835a18f6d6e729dae561"
};

const { actionMaps } = parseStateMachine(purchaseRequisitionStateMachine);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProcurementProvider initialActionMaps={actionMaps}>
        <App />
      </ProcurementProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
