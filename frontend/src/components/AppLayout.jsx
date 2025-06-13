import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/Layout.module.css';
import parseStateMachine from '../modules/procurement/utils/stateMachineParser'; // Import the parser

const PurchaseRequisitionIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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

// Define state machines for each workflow
const stateMachines = {
  'Purchase Requisition': purchaseRequisitionStateMachine,
  'Contract': {
    "_id": "public:0x9763c8c13b934e133819b80374d6fb2a762f20a34f2c4ee03b8ae228d421b548_Contract",
    "AppType": "CommerceSM",
    "Base_sm": "@statemachine/extendedCommerceSM:public:0x161f0430cae79713cda4e848416f2f561704048d5ac40d6ed0f5829fda2ac1a7",
    "Branch": false,
    "Category": "Apps",
    "Desc": "The Core Protocol Commerce StateMachine for P2P Saas",
    "ExchangeParamID": [
      {
        "paramID": "0x5e282dE188b68864e3B140287640c075C46F4fF4",
        "publicKey": "133e15a25b2657b7d3177ca1281a261099db2fdc9993209b853690fc7ce805fbb75fe5fd9bd839509de8a67fde8afc1cf24f3743272f06cf4f1ac87b2a64bf90"
      }
    ],
    "Index": -5,
    "Name": "Contract",
    "Organizations": [
      {
        "Desc": "Buyer",
        "Teams": [
          {
            "Desc": "Buyer",
            "Role": "Buyer"
          }
        ],
        "Name": "Buyer"
      },
      {
        "Teams": [
          {
            "Desc": "Seller",
            "Role": "Seller"
          }
        ],
        "Name": "Seller",
        "Desc": "Seller"
      }
    ],
    "Props": {
      "BgColor": "#E7F7FF",
      "Icon": 102
    },
    "Roles": [
      "Buyer",
      "Seller"
    ],
    "StartAt": "Contract",
    "Start_sm": "@statemachine/CommerceSM:public:0xdfba41efa39db71652f45453922135caf84984cc5d95835a18f6d6e729dae561",
    "States": {
      "CreditNote": {
        "Owner": [
          "Buyer"
        ],
        "Props": null,
        "SubStates": {},
        "Visibility": {
          "Seller": true,
          "Buyer": true
        },
        "End": true,
        "Desc": "Credit Note",
        "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9"
      },
      "PurchaseReq": {
        "Props": null,
        "Desc": "Purchase Requisition",
        "NextState": "Contract",
        "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
        "Owner": [
          "Buyer"
        ],
        "SubStates": {},
        "Visibility": {
          "Buyer": true,
          "Seller": true
        }
      },
      "DigitalReceipt": {
        "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
        "Owner": [
          "Seller"
        ],
        "SubStates": {},
        "Visibility": {
          "Seller": true,
          "Buyer": true
        },
        "Props": null,
        "End": true,
        "Desc": "Digital Receipt"
      },
      "Orders": {
        "NextState": "Invoice",
        "AttachStates": [
          "AcceptNote"
        ],
        "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
        "Owner": [
          "Buyer"
        ],
        "SubStates": {},
        "Visibility": {
          "Seller": true,
          "Buyer": true
        },
        "Props": null,
        "Desc": "Orders"
      },
      "Contract": {
        "Schema": "@schema/Commerce:public:0x496abadf9787ebaec3645f007c6ef4019e3a4190a2fa8251b67124b8e33b9cf8",
        "Owner": [
          "Buyer",
          "Seller"
        ],
        "Props": {
          "Edit": true,
          "Flip": true
        },
        "Desc": "Contract",
        "NextState": "Orders",
        "SubStates": {
          "UnderReview": {
            "Visibility": {
              "Seller": true,
              "Buyer": true
            },
            "Rule": null,
            "NextState": "Approved",
            "Owner": [
              "Buyer",
              "Seller"
            ]
          },
          "Approved": {
            "Rule": null,
            "NextState": "Cancelled",
            "Owner": [
              "Buyer",
              "Seller"
            ],
            "Visibility": {
              "Buyer": true,
              "Seller": true
            }
          },
          "Cancelled": {
            "NextState": "Renewed",
            "Owner": [
              "Buyer",
              "Seller"
            ],
            "Visibility": {
              "Buyer": true,
              "Seller": true
            },
            "Rule": null
          },
          "Renewed": {
            "Rule": null,
            "NextState": "Closed",
            "Owner": [
              "Buyer",
              "Seller"
            ],
            "Visibility": {
              "Seller": true,
              "Buyer": true
            }
          },
          "Closed": {
            "Visibility": {
              "Buyer": true,
              "Seller": true
            },
            "Rule": null,
            "End": true,
            "MicroStates": {
              "Terminated": {
                "End": true,
                "Desc": "Terminated",
                "Owner": [
                  "Buyer",
                  "Seller"
                ]
              },
              "Expired": {
                "NextState": "Terminated",
                "Start": true,
                "Desc": "Expired",
                "Owner": [
                  "Buyer",
                  "Seller"
                ]
              }
            },
            "Owner": [
              "Buyer",
              "Seller"
            ]
          },
          "Initiated": {
            "Start": true,
            "NextState": "UnderReview",
            "Owner": [
              "Buyer",
              "Seller"
            ],
            "Visibility": {
              "Buyer": true,
              "Seller": true
            },
            "Rule": null
          }
        },
        "Visibility": {
          "Seller": true,
          "Buyer": true
        }
      },
      "Invoice": {
        "Owner": [
          "Seller"
        ],
        "Props": null,
        "Desc": "Invoice",
        "SubStates": {},
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
        "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9"
      },
      "Payment": {
        "Desc": "Payment",
        "NextState": "DigitalReceipt",
        "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
        "SubStates": {},
        "Visibility": {
          "Seller": true,
          "Buyer": true
        },
        "Owner": [
          "Buyer"
        ],
        "Props": null
      },
      "GRN": {
        "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
        "Owner": [
          "Buyer"
        ],
        "SubStates": {},
        "Visibility": {
          "Seller": true,
          "Buyer": true
        },
        "Props": null,
        "End": true,
        "Desc": "GRN"
      },
      "AcceptNote": {
        "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
        "SubStates": {},
        "Visibility": {
          "Seller": true,
          "Buyer": true
        },
        "Owner": [
          "Seller"
        ],
        "Props": null,
        "End": true,
        "Desc": "Accept Note"
      },
      "DebitNote": {
        "Desc": "Debit Note",
        "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
        "Owner": [
          "Buyer"
        ],
        "SubStates": {},
        "Visibility": {
          "Seller": true,
          "Buyer": true
        },
        "Props": null,
        "End": true
      }
    },
    "installed": 1,
    "orgParamID": "0x44568D2535f2DEf8fEEC08d5FbC9c8F1ae56D5A7",
    "smID": "public:0x9763c8c13b934e133819b80374d6fb2a762f20a34f2c4ee03b8ae228d421b548"
  },
  'Orders': {
    "_id": "public:0x51c7fd54e9079d2789edb5e89110b16df3a2305a339bd5f6f3e498c26964e86d_Orders",
    "AppType": "CommerceSM",
    "Base_sm": "@statemachine/extendedCommerceSM:public:0x161f0430cae79713cda4e848416f2f561704048d5ac40d6ed0f5829fda2ac1a7",
    "Branch": false,
    "Category": "Apps",
    "Desc": "The Core Protocol Commerce StateMachine for P2P Saas",
    "ExchangeParamID": [
        {
            "paramID": "0x5e282dE188b68864e3B140287640c075C46F4fF4",
            "publicKey": "133e15a25b2657b7d3177ca1281a261099db2fdc9993209b853690fc7ce805fbb75fe5fd9bd839509de8a67fde8afc1cf24f3743272f06cf4f1ac87b2a64bf90"
        }
    ],
    "Index": -6,
    "Name": "Orders",
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
            "Teams": [
                {
                    "Desc": "Seller",
                    "Role": "Seller"
                }
            ],
            "Name": "Seller",
            "Desc": "Seller"
        }
    ],
    "Props": {
        "Icon": 103,
        "BgColor": "#E3F4FD"
    },
    "Roles": [
        "Buyer",
        "Seller"
    ],
    "StartAt": "Orders",
    "Start_sm": "@statemachine/CommerceSM:public:0x9763c8c13b934e133819b80374d6fb2a762f20a34f2c4ee03b8ae228d421b548",
    "States": {
        "CreditNote": {
            "End": true,
            "Desc": "Credit Note",
            "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
            "Owner": [
                "Buyer"
            ],
            "Props": null,
            "SubStates": {},
            "Visibility": {
                "Seller": true,
                "Buyer": true
            }
        },
        "Orders": {
            "Visibility": {
                "Buyer": true,
                "Seller": true
            },
            "Props": {
                "Flip": true,
                "diff": {
                    "from": "OrderedItems.I_Quantity",
                    "to": "OrderedItems.I_Quantity"
                },
                "Edit": true
            },
            "Desc": "Orders",
            "NextState": "Invoice",
            "AttachStates": [
                "AcceptNote"
            ],
            "Schema": "@schema/Commerce:public:0xa48c197d9db985fdb67629c562a009c2037c33549e9510e5f7ae05ac6c9edbb1",
            "Owner": [
                "Buyer"
            ],
            "SubStates": {
                "Cancelled": {
                    "Rule": null,
                    "End": true,
                    "Owner": [
                        "Seller"
                    ],
                    "Visibility": {
                        "Seller": true,
                        "Buyer": true
                    }
                },
                "Created": {
                    "Start": true,
                    "NextState": "Cancelled",
                    "Owner": [
                        "Seller"
                    ],
                    "Visibility": {
                        "Buyer": true,
                        "Seller": true
                    },
                    "Rule": null
                }
            }
        },
        "AcceptNote": {
            "Owner": [
                "Seller"
            ],
            "Props": {
                "Flip": true,
                "diff": {
                    "to": "OrderedItems.I_Quantity",
                    "from": "OrderedItems.I_Quantity"
                },
                "Edit": true
            },
            "End": true,
            "Desc": "Accept Note",
            "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
            "SubStates": {},
            "Visibility": {
                "Buyer": true,
                "Seller": true
            }
        },
        "DebitNote": {
            "Visibility": {
                "Buyer": true,
                "Seller": true
            },
            "Props": null,
            "End": true,
            "Desc": "Debit Note",
            "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
            "Owner": [
                "Buyer"
            ],
            "SubStates": {}
        },
        "GRN": {
            "SubStates": {},
            "Visibility": {
                "Buyer": true,
                "Seller": true
            },
            "Props": null,
            "End": true,
            "Desc": "GRN",
            "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
            "Owner": [
                "Buyer"
            ]
        },
        "DigitalReceipt": {
            "SubStates": {},
            "Visibility": {
                "Buyer": true,
                "Seller": true
            },
            "Props": null,
            "End": true,
            "Desc": "Digital Receipt",
            "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
            "Owner": [
                "Seller"
            ]
        },
        "PurchaseReq": {
            "Desc": "Purchase Requisition",
            "NextState": "Contract",
            "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
            "Owner": [
                "Buyer"
            ],
            "SubStates": {},
            "Visibility": {
                "Seller": true,
                "Buyer": true
            },
            "Props": null
        },
        "Payment": {
            "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
            "SubStates": {},
            "Visibility": {
                "Seller": true,
                "Buyer": true
            },
            "Owner": [
                "Buyer"
            ],
            "Props": null,
            "Desc": "Payment",
            "NextState": "DigitalReceipt"
        },
        "Invoice": {
            "SubStates": {},
            "Visibility": {
                "Buyer": true,
                "Seller": true
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
            "Desc": "Invoice"
        },
        "Contract": {
            "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
            "Owner": [
                "Buyer",
                "Seller"
            ],
            "Props": null,
            "Desc": "Contract",
            "NextState": "Orders",
            "SubStates": {},
            "Visibility": {
                "Seller": true,
                "Buyer": true
            }
        }
    },
    "installed": 1,
    "orgParamID": "0x44568D2535f2DEf8fEEC08d5FbC9c8F1ae56D5A7",
    "smID": "public:0x51c7fd54e9079d2789edb5e89110b16df3a2305a339bd5f6f3e498c26964e86d"
},
  'Invoices': {
    "_id": "public:0x0c182241729a93d26631c136faad0938e50df28185a352a6657c57b2238f7325_Invoice",
    "AppType": "CommerceSM",
    "Base_sm": "@statemachine/extendedCommerceSM:public:0x161f0430cae79713cda4e848416f2f561704048d5ac40d6ed0f5829fda2ac1a7",
    "Branch": false,
    "Category": "Apps",
    "Desc": "The Core Protocol Commerce StateMachine for P2P Saas",
    "ExchangeParamID": [
        {
            "paramID": "0x5e282dE188b68864e3B140287640c075C46F4fF4",
            "publicKey": "133e15a25b2657b7d3177ca1281a261099db2fdc9993209b853690fc7ce805fbb75fe5fd9bd839509de8a67fde8afc1cf24f3743272f06cf4f1ac87b2a64bf90"
        }
    ],
    "Index": -7,
    "Name": "Invoices",
    "Organizations": [
        {
            "Desc": "Buyer",
            "Teams": [
                {
                    "Role": "Buyer",
                    "Desc": "Buyer"
                }
            ],
            "Name": "Buyer"
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
        "Icon": 107,
        "BgColor": "#E5F1FF"
    },
    "Roles": [
        "Buyer",
        "Seller"
    ],
    "StartAt": "Invoice",
    "Start_sm": "@statemachine/CommerceSM:public:0x51c7fd54e9079d2789edb5e89110b16df3a2305a339bd5f6f3e498c26964e86d",
    "States": {
        "DigitalReceipt": {
            "Owner": [
                "Seller"
            ],
            "SubStates": {},
            "Visibility": {
                "Seller": true,
                "Buyer": true
            },
            "Props": null,
            "End": true,
            "Desc": "Digital Receipt",
            "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9"
        },
        "Payment": {
            "SubStates": {},
            "Visibility": {
                "Buyer": true,
                "Seller": true
            },
            "Owner": [
                "Buyer"
            ],
            "Props": null,
            "Desc": "Payment",
            "NextState": "DigitalReceipt",
            "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9"
        },
        "Contract": {
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
            "Props": null,
            "Desc": "Contract",
            "SubStates": {}
        },
        "DebitNote": {
            "Visibility": {
                "Seller": true,
                "Buyer": true
            },
            "Props": null,
            "End": true,
            "Desc": "Debit Note",
            "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
            "Owner": [
                "Buyer"
            ],
            "SubStates": {}
        },
        "PurchaseReq": {
            "SubStates": {},
            "Visibility": {
                "Buyer": true,
                "Seller": true
            },
            "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
            "Owner": [
                "Buyer"
            ],
            "Props": null,
            "Desc": "Purchase Requisition",
            "NextState": "Contract"
        },
        "GRN": {
            "Props": {
                "Edit": true,
                "diff": {
                    "from": "OrderedItems.I_Quantity",
                    "to": "OrderedItems.I_Quantity"
                },
                "Flip": true
            },
            "End": true,
            "SubStates": {},
            "Visibility": {
                "Buyer": true,
                "Seller": true
            },
            "Desc": "GRN",
            "Schema": "@schema/Commerce:public:0x622256bfba40034e3fb6ca196c0718adca13a28f49d139b9fbdfdb4cce9aaf34",
            "Owner": [
                "Buyer"
            ]
        },
        "CreditNote": {
            "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
            "Owner": [
                "Buyer"
            ],
            "Props": null,
            "SubStates": {},
            "Visibility": {
                "Buyer": true,
                "Seller": true
            },
            "End": true,
            "Desc": "Credit Note"
        },
        "Orders": {
            "NextState": "Invoice",
            "AttachStates": [
                "AcceptNote"
            ],
            "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
            "Owner": [
                "Buyer"
            ],
            "SubStates": {},
            "Visibility": {
                "Seller": true,
                "Buyer": true
            },
            "Props": null,
            "Desc": "Orders"
        },
        "AcceptNote": {
            "Visibility": {
                "Buyer": true,
                "Seller": true
            },
            "Props": null,
            "End": true,
            "Desc": "Accept Note",
            "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
            "Owner": [
                "Seller"
            ],
            "SubStates": {}
        },
        "Invoice": {
            "Visibility": {
                "Buyer": true,
                "Seller": true
            },
            "NextState": "Payment",
            "AttachStates": [
                "GRN",
                "DebitNote",
                "CreditNote"
            ],
            "Schema": "@schema/Commerce:public:0x622256bfba40034e3fb6ca196c0718adca13a28f49d139b9fbdfdb4cce9aaf34",
            "Owner": [
                "Seller"
            ],
            "Props": {
                "diff": {
                    "from": "OrderedItems.I_Quantity",
                    "to": "OrderedItems.I_Quantity"
                },
                "Edit": true,
                "Flip": true
            },
            "Desc": "Invoice",
            "SubStates": {
                "Rejected": {
                    "End": true,
                    "Owner": [],
                    "Visibility": {
                        "Seller": true,
                        "Buyer": true
                    },
                    "Rule": null
                },
                "Created": {
                    "Owner": [],
                    "Visibility": {
                        "Seller": true,
                        "Buyer": true
                    },
                    "Rule": null,
                    "Start": true,
                    "NextState": "Rejected"
                }
            }
        }
    },
    "installed": 1,
    "orgParamID": "0x44568D2535f2DEf8fEEC08d5FbC9c8F1ae56D5A7",
    "smID": "public:0x0c182241729a93d26631c136faad0938e50df28185a352a6657c57b2238f7325"
},
  'Payment': {
    "_id": "public:0xa20df8b1ba7a5a2e96d7069b32d406b1cd282713d52ff119199cfca94d8bdab4_Payment",
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
    "Index": -9,
    "Name": "Payment",
    "Organizations": [
        {
            "Name": "Buyer",
            "Desc": "Buyer",
            "Teams": [
                {
                    "Desc": "Buyer",
                    "Role": "Buyer"
                }
            ]
        },
        {
            "Desc": "Seller",
            "Teams": [
                {
                    "Role": "Seller",
                    "Desc": "Seller"
                }
            ],
            "Name": "Seller"
        }
    ],
    "Props": {
        "Icon": 102,
        "BgColor": "#E7F7FF"
    },
    "Roles": [
        "Buyer",
        "Seller"
    ],
    "StartAt": "Payment",
    "Start_sm": "@statemachine/CommerceSM:public:0x0c182241729a93d26631c136faad0938e50df28185a352a6657c57b2238f7325",
    "States": {
        "Orders": {
            "NextState": "Invoice",
            "AttachStates": [
                "AcceptNote"
            ],
            "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
            "Owner": [
                "Buyer"
            ],
            "SubStates": {},
            "Visibility": {
                "Seller": true,
                "Buyer": true
            },
            "Props": null,
            "Desc": "Orders"
        },
        "DebitNote": {
            "Visibility": {
                "Buyer": true,
                "Seller": true
            },
            "Props": null,
            "End": true,
            "Desc": "Debit Note",
            "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
            "Owner": [
                "Buyer"
            ],
            "SubStates": {}
        },
        "Payment": {
            "SubStates": {},
            "Visibility": {
                "Seller": true,
                "Buyer": true
            },
            "Owner": [
                "Buyer"
            ],
            "Props": {
                "Flip": true,
                "Edit": true
            },
            "Desc": "Payment",
            "NextState": "DigitalReceipt",
            "Schema": "@schema/Commerce:public:0x5a434df2248b349caf0b77e5a51324f2ea533b9ffcd9a1323b7e6c8041416200"
        },
        "Contract": {
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
            "Props": null,
            "Desc": "Contract"
        },
        "Invoice": {
            "Owner": [
                "Seller"
            ],
            "Props": null,
            "Desc": "Invoice",
            "SubStates": {},
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
            "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9"
        },
        "AcceptNote": {
            "Props": null,
            "End": true,
            "SubStates": {},
            "Visibility": {
                "Seller": true,
                "Buyer": true
            },
            "Desc": "Accept Note",
            "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
            "Owner": [
                "Seller"
            ]
        },
        "CreditNote": {
            "End": true,
            "Desc": "Credit Note",
            "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
            "Owner": [
                "Buyer"
            ],
            "Props": null,
            "SubStates": {},
            "Visibility": {
                "Seller": true,
                "Buyer": true
            }
        },
        "DigitalReceipt": {
            "Props": null,
            "End": true,
            "Desc": "Digital Receipt",
            "SubStates": {},
            "Visibility": {
                "Buyer": true,
                "Seller": true
            },
            "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
            "Owner": [
                "Seller"
            ]
        },
        "PurchaseReq": {
            "Desc": "Purchase Requisition",
            "SubStates": {},
            "Visibility": {
                "Buyer": true,
                "Seller": true
            },
            "NextState": "Contract",
            "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
            "Owner": [
                "Buyer"
            ],
            "Props": null
        },
        "GRN": {
            "Visibility": {
                "Buyer": true,
                "Seller": true
            },
            "Props": null,
            "End": true,
            "Desc": "GRN",
            "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
            "Owner": [
                "Buyer"
            ],
            "SubStates": {}
        }
    },
    "installed": 1,
    "orgParamID": "0x44568D2535f2DEf8fEEC08d5FbC9c8F1ae56D5A7",
    "smID": "public:0xa20df8b1ba7a5a2e96d7069b32d406b1cd282713d52ff119199cfca94d8bdab4"
}
};

// Define majorWorkflows dynamically from the state machine's top-level states
const majorWorkflows = [
  { name: 'Purchase Requisition', path: '/procurement/PurchaseReq', shortName: 'PurchaseReq', workflowPath: 'PurchaseReq' },
  { name: 'Contract', path: '/procurement/Contract', shortName: 'Contract', workflowPath: 'Contract' },
  { name: 'Orders', path: '/procurement/Orders', shortName: 'Orders', workflowPath: 'Orders' },
  { name: 'Invoices', path: '/procurement/Invoice', shortName: 'Invoice', workflowPath: 'Invoice' },
  { name: 'Payment', path: '/procurement/Payment', shortName: 'Payment', workflowPath: 'Payment' },
];

const workflowType = location.pathname.split('/')[2];
  const queryParams = new URLSearchParams(location.search);
  const stateParam = queryParams.get('state');
const stateFilter = stateParam?.includes('-') ? stateParam.split('-')[1] : stateParam; // Default to created state
  const substate = stateFilter; 

const AppLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeWorkflow, setActiveWorkflow] = useState('');
  const [activeWorkflowShortName, setActiveWorkflowShortName] = useState('');
  const [activeSidebarItems, setActiveSidebarItems] = useState([]);

  useEffect(() => {
    // Find the current workflow based on the path
    const currentWorkflow = majorWorkflows.find(workflow =>
      location.pathname.startsWith(workflow.path)
    );

    if (currentWorkflow) {
      setActiveWorkflow(currentWorkflow.name);
      setActiveWorkflowShortName(currentWorkflow.shortName);
      
      // Parse the state machine for the active workflow
      const stateMachine = stateMachines[currentWorkflow.name];
      if (stateMachine) {
        const { sidebarItems } = parseStateMachine(stateMachine);
        setActiveSidebarItems(sidebarItems);
      }
    } else {
      // Default to the first workflow if no path matches
      setActiveWorkflow(majorWorkflows[0].name);
      setActiveWorkflowShortName(majorWorkflows[0].shortName);
      
      // Parse the state machine for the default workflow
      const stateMachine = stateMachines[majorWorkflows[0].name];
      if (stateMachine) {
        const { sidebarItems } = parseStateMachine(stateMachine);
        setActiveSidebarItems(sidebarItems);
      }
    }
  }, [location.pathname]);

  // Find the workflowPath for the active workflow name
  const currentWorkflowData = majorWorkflows.find(workflow => workflow.name === activeWorkflow);
  // Ensure activeWorkflowPath is the correct standardized short form
  const activeWorkflowPath = currentWorkflowData ? currentWorkflowData.workflowPath : majorWorkflows[0].workflowPath;

  // Function to handle sidebar item click (for state filters)
  const handleSidebarItemClick = (item) => {
      const baseWorkflowPath = item.workflowPath || activeWorkflowPath;
      const targetPath = `/procurement/${baseWorkflowPath}?state=${item.state}`;
      navigate(targetPath);
  };

  // Function to handle Upload button click
  const handleUploadClick = () => {
      const targetPath = `/procurement/${activeWorkflowPath}/upload`;
      navigate(targetPath);
  };

  // Function to handle Add button click
  const handleAddClick = () => {
      const targetPath = `/procurement/${activeWorkflowPath}/create?state=${workflowType}-${stateFilter}`;
      navigate(targetPath);
  };

  // Function to handle Top Bar tab click
  const handleTopBarClick = (workflow) => {
      setActiveWorkflow(workflow.name);
      setActiveWorkflowShortName(workflow.shortName);
      
      // Get the state machine for the selected workflow
      const stateMachine = stateMachines[workflow.name];
      if (stateMachine) {
        // First try to find the StartAt state and its Start substate
        const startAtState = stateMachine.StartAt;
        if (startAtState) {
          const state = stateMachine.States[startAtState];
          if (state && state.SubStates) {
            const startSubState = Object.entries(state.SubStates).find(([_, subState]) => subState.Start);
            if (startSubState) {
              const [subStateName] = startSubState;
              // Navigate to the workflow with the default state
              navigate(`${workflow.path}?state=${startAtState}-${subStateName}`);
              return;
            }
          }
        }

        // If no StartAt state with Start substate is found, use the workflow's StartAt state
        if (startAtState) {
          // Navigate to the workflow with just the StartAt state
          navigate(`${workflow.path}?state=${startAtState}`);
          return;
        }
      }
      
      // Fallback to default navigation if no suitable state is found
      navigate(workflow.path);
  };

  return (
    <div className={styles.layout}>
      {/* Top Bar */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.projectInfo}>
            <PurchaseRequisitionIcon /> {/* Use the SVG component here */}
            <span className={styles.projectName}>P2P SaaS</span>
          </div>
        </div>

        <div className={styles.headerCenter}>
          <nav>
            <ul className={styles.topNavList}>
              {majorWorkflows.map((workflow) => (
                <li className={styles.topNavItem} key={workflow.name}>
                  <button
                    onClick={() => handleTopBarClick(workflow)}
                    className={`${styles.topNavLink} ${activeWorkflow === workflow.name ? styles.activeTopNav : ''}`}
                  >
                    {workflow.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={styles.headerRight}>
          <button className={`btn ${styles.iconButton}`} title="Notifications">
            <i className="bi bi-bell"></i>
          </button>
          <div className="dropdown ms-3">
            <button
              className="btn btn-link"
              type="button"
              id="userMenu"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ color: '#333', textDecoration: 'none' }}
            >
              User Name
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
              <li><a className="dropdown-item" href="#" onClick={() => console.log('Logout')}><i className="bi bi-box-arrow-right me-2"></i>Logout</a></li>
            </ul>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
      {/* Sidebar */}
        <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1 className="h5 mb-0 text-dark">
            {activeWorkflow === 'Purchase Requisition'
              ? 'PR Workflow'
              : `${activeWorkflow} Workflow`}
          </h1>
        </div>
        <div className={styles.sidebarContent}>
          <nav>
              <ul className="nav flex-column">
              {activeSidebarItems.map((item, index) => {
                const isActive = location.search.includes(`state=${item.state}`);
                return (
                  <li
                    key={index}
                    className={`nav-item ${styles.sidebarNavLink} ${isActive ? styles.activeSidebarItem : ''}`}
                    onClick={() => handleSidebarItemClick(item)}
                    style={{ cursor: 'pointer' }}
                  >
                    {item.label}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

        {/* Page Content */}
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;