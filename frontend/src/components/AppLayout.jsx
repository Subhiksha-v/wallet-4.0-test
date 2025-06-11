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


const { sidebarItems: prSidebarItems, actionMaps: prActionMaps } = parseStateMachine(purchaseRequisitionStateMachine);

// Define majorWorkflows dynamically from the state machine's top-level states
const majorWorkflows = [
  { name: 'Purchase Requisition', path: '/procurement/pr', shortName: 'PR', workflowPath: 'purchasereq' },
  { name: 'Contract', path: '/procurement/contracts', shortName: 'Contracts', workflowPath: 'contract' },
  { name: 'Orders', path: '/procurement/orders', shortName: 'Orders', workflowPath: 'orders' },
  { name: 'Invoices', path: '/procurement/invoices', shortName: 'Invoice', workflowPath: 'invoice' },
  { name: 'Payment', path: '/procurement/payments', shortName: 'Payment', workflowPath: 'payment' },
];

// Combine the parsed sidebar items with a mapping for each workflow
const allSidebarItems = {
  'Purchase Requisition': prSidebarItems,
  'Contract': [], // To be parsed from Contract State Machine
  'Orders': [],   // To be parsed from Orders State Machine
  'Invoices': [], // To be parsed from Invoices State Machine
  'Payment': [],  // To be parsed from Payment State Machine
};

const AppLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeWorkflow, setActiveWorkflow] = useState('');
  const [activeWorkflowShortName, setActiveWorkflowShortName] = useState('');

  useEffect(() => {
    // Find the current workflow based on the path
    const currentWorkflow = majorWorkflows.find(workflow =>
      location.pathname.startsWith(workflow.path)
    );

    if (currentWorkflow) {
      setActiveWorkflow(currentWorkflow.name);
      setActiveWorkflowShortName(currentWorkflow.shortName);
    } else {
      // Default to the first workflow if no path matches
      setActiveWorkflow(majorWorkflows[0].name);
      setActiveWorkflowShortName(majorWorkflows[0].shortName);
    }
  }, [location.pathname]);

  const activeSidebarItems = allSidebarItems[activeWorkflow] || [];
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
      const targetPath = `/procurement/${activeWorkflowPath}/create`;
      navigate(targetPath);
  };

  // Function to handle Top Bar tab click
  const handleTopBarClick = (workflow) => {
      setActiveWorkflow(workflow.name);
      setActiveWorkflowShortName(workflow.shortName);
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
              {/* Upload Button as li */}
              <li
                className={`nav-item ${styles.sidebarNavLink} ${location.pathname.endsWith('/upload') ? styles.activeSidebarItem : ''}`}
                onClick={handleUploadClick}
                style={{ cursor: 'pointer' }}
              >
                <i className="bi bi-cloud-arrow-up me-2"></i>
                Upload {activeWorkflowShortName}
              </li>
              {/* Add Button as li */}
              <li
                className={`nav-item ${styles.sidebarNavLink} ${location.pathname.endsWith('/create') ? styles.activeSidebarItem : ''}`}
                onClick={handleAddClick}
                style={{ cursor: 'pointer' }}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add {activeWorkflowShortName}
              </li>
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