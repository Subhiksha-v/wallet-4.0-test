import React, { useState, useEffect, useRef } from 'react';
import { transitionDocumentState } from '../services/documentService';
import { stateMachines } from '../../../components/AppLayout';

const StateTransitionButton = ({ currentState, currentSubstate, workflowType, stateMachine, documentId, documentData, navigate }) => {
  const [options, setOptions] = useState([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const generateOptions = () => {
      const transitionOptions = [];
      
      // Add a check for stateMachine to prevent errors if it's undefined
      if (!stateMachine) {
        console.warn("State machine is undefined for current workflow type.");
        return [];
      }

      // Get current state from state machine
      const state = stateMachine.States[currentState];
      if (!state) return [];

      // Add all substates within current state (except current substate)
      if (state.SubStates && Object.keys(state.SubStates).length > 0) {
        Object.entries(state.SubStates).forEach(([subStateName, subState]) => {
          // Skip the current substate
          if (subStateName !== currentSubstate) {
            transitionOptions.push({
              label: `${currentState}: ${subStateName}`,
              value: `${currentState}-${subStateName}`,
              type: 'substate'
            });
          }
        });
      }

      // Add next states
      if (state.NextState) {
        const nextState = stateMachine.States[state.NextState];
        if (nextState) {
          // If next state has substates, add them
          if (nextState.SubStates && Object.keys(nextState.SubStates).length > 0) {
            Object.entries(nextState.SubStates).forEach(([subStateName, subState]) => {
              if (subState.Start) {
                transitionOptions.push({
                  label: `${state.NextState}: ${subStateName}`,
                  value: `${state.NextState}-${subStateName}`,
                  type: 'state'
                });
              }
            });
          } else {
            // If no substates, just add the state
            transitionOptions.push({
              label: state.NextState,
              value: state.NextState,
              type: 'state'
            });
          }
        }
      }

      return transitionOptions;
    };

    setOptions(generateOptions());
  }, [currentState, currentSubstate, stateMachine]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStateTransition = async (option) => {
    if (!documentId || isTransitioning) return;

    setIsTransitioning(true);
    setIsOpen(false); // Close dropdown after selection

    const [newState, newSubstate] = option.value.split('-');
    
    // Check if this is a cross-workflow transition
    const currentStateObj = stateMachine.States[currentState];
    const nextStateObj = currentStateObj?.NextState ? stateMachine.States[currentStateObj.NextState] : null;
    
    // If the next state is in a different workflow (props is null) AND it's not a substate transition
    if (nextStateObj && nextStateObj.Props === null && newState !== currentState) {
      // Get the target workflow type from the state name
      const targetWorkflowType = newState;
      
      // Get the target state machine
      const targetStateMachine = stateMachines[targetWorkflowType];
      
      if (targetStateMachine) {
        // Get the start state from the target workflow
        const startState = targetStateMachine.StartAt;
        const startStateObj = targetStateMachine.States[startState];
        
        // Find the initial substate if it exists
        let initialSubstate = startState;
        if (startStateObj.SubStates) {
          const startSubState = Object.entries(startStateObj.SubStates).find(([_, substate]) => substate.Start);
          if (startSubState) {
            initialSubstate = startSubState[0];
          }
        }
        
        // Navigate to create page with cross-workflow transition data
        navigate(`/procurement/${targetWorkflowType}/create`, {
          state: {
            isStateTransition: true,
            isCrossWorkflow: true,
            originalDocumentId: documentId,
            originalDocumentData: documentData,
            newState: startState,
            newSubstate: initialSubstate,
            originalWorkflowType: workflowType,
            originalState: currentState,
            originalSubstate: currentSubstate,
            targetWorkflowType: targetWorkflowType
          },
        });
      } else {
        console.error(`Target state machine not found for workflow: ${targetWorkflowType}`);
      }
    } else {
      // Handle normal within-workflow transition
      const updatedDocumentData = {
        ...documentData,
        DocDetails: {
          ...documentData.DocDetails,
          State: newState,
          SubState: newSubstate
        },
        state: newState,
        substate: newSubstate
      };

      navigate(`/procurement/${workflowType}/create`, {
        state: {
          isStateTransition: true,
          originalDocumentId: documentId,
          originalDocumentData: updatedDocumentData,
          newState: newState,
          newSubstate: newSubstate,
          originalWorkflowType: workflowType,
          originalState: currentState,
          originalSubstate: currentSubstate,
        },
      });
    }

    setIsTransitioning(false);
  };

  if (options.length === 0) {
    return null;
  }

  return (
    <div className="dropdown d-inline-block ms-2 position-static" ref={dropdownRef}>
      <button
               className="btn btn-outline-secondary dropdown-toggle"
        type="button"
        id="stateTransitionDropdown"
        aria-expanded={isOpen}
        title="Change State"
        disabled={isTransitioning}
        style={{
          backgroundColor: 'white',
          border: '1px solid var(--bs-secondary)',  
          minWidth: '90px',
          width : "110px",
          color: 'var(--bs-secondary)',
          '--bs-btn-color': 'var(--bs-secondary)', // Base text color
          '--bs-btn-hover-color': 'var(--bs-secondary)', // Text color on hover
          '--bs-btn-active-color': 'var(--bs-secondary)', // Text color when active
          '--bs-btn-hover-bg': 'white', // Ensure white background on hover
          '--bs-btn-active-bg': 'white', // Ensure white background when active
          '--bs-btn-focus-shadow-rgb': '108,117,125', // Keep focus shadow
          '--bs-btn-hover-border-color': 'var(--bs-secondary)', // Border color on hover
          '--bs-btn-active-border-color': 'var(--bs-secondary)', // Border color when active
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        Action
      </button>
      <ul className={`dropdown-menu ${isOpen ? 'show' : ''} shadow-sm`} aria-labelledby="stateTransitionDropdown">
        {options.map((option, index) => (
          <li key={index}>
            <button
              className="dropdown-item"
              type="button"
              onClick={() => handleStateTransition(option)}
              disabled={isTransitioning}
            >
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StateTransitionButton; 