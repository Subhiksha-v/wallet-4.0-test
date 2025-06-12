const parseStateMachine = (stateMachine) => {
  const sidebarItems = [];
  const actionMaps = {};

  if (!stateMachine || !stateMachine.StartAt || !stateMachine.States) {
    console.error("Invalid state machine structure.");
    return { sidebarItems, actionMaps };
  }

  // Helper function to extract schema type
  const getSchemaType = (schema) => {
    if (!schema) return null;
    const match = schema.match(/@schema\/([^:]+)/);
    return match ? match[1] : null;
  };

  // Helper function to check if state should be rendered
  const shouldRenderState = (state) => {
    const schemaType = getSchemaType(state.Schema);
    const hasFlip = state.Props && state.Props.Flip !== undefined && state.Props.Flip !== null;
    return hasFlip;
  };

  let currentStateName = stateMachine.StartAt;
  let currentState = stateMachine.States[currentStateName];

  while (currentState) {
    const baseLabel = currentState.Desc || currentStateName;
    const workflowPath = currentStateName.toLowerCase().replace(/[^a-z0-9]/g, ''); // Simple slug for workflowPath

    // Handle SubStates
    if (currentState.SubStates && typeof currentState.SubStates === 'object' && Object.keys(currentState.SubStates).length > 0) {
      const subStateKeys = Object.keys(currentState.SubStates);
      
      // Find the start substate and traverse
      let currentSubStateName = subStateKeys.find(key => currentState.SubStates[key].Start);
      if (!currentSubStateName && subStateKeys.length > 0) {
        // Fallback: If no 'Start' substate, use the first one
        currentSubStateName = subStateKeys[0];
      }

      const traversedSubStates = [];
      while(currentSubStateName && currentState.SubStates[currentSubStateName] && !traversedSubStates.includes(currentSubStateName)) {
        const subState = currentState.SubStates[currentSubStateName];
        const subStateLabel = subState.Desc || currentSubStateName;
        
        // Add the substate to sidebar items
        sidebarItems.push({
          label: `${baseLabel} - ${subStateLabel}`,
          state: `${workflowPath}-${currentSubStateName.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
          workflowPath: workflowPath
        });

        // Store actions for this specific state/substate
        const currentActions = {
          edit: currentState.Props && currentState.Props.Edit,
          flip: currentState.Props && currentState.Props.Flip,
        };
        actionMaps[`${workflowPath}-${currentSubStateName.toLowerCase().replace(/[^a-z0-9]/g, '')}`] = currentActions;
        
        traversedSubStates.push(currentSubStateName);
        currentSubStateName = subState.NextState;

        // REMOVED: The problematic code that was adding duplicate entries
        // The main loop will handle adding the next states properly
      }
    } else {
      // Handle main states without sub-states
      // Check if state should be rendered based on conditions
      if (shouldRenderState(currentState)) {
        sidebarItems.push({
          label: baseLabel,
          state: workflowPath,
          workflowPath: workflowPath
        });

        // Store actions for this main state
        const currentActions = {
          edit: currentState.Props && currentState.Props.Edit,
          flip: currentState.Props && currentState.Props.Flip,
        };
        actionMaps[workflowPath] = currentActions;
      }
    }

    // Move to the next main state
    if (currentState.NextState) {
      currentStateName = currentState.NextState;
      currentState = stateMachine.States[currentStateName];
    } else {
      currentState = null; // Stop if no next state
    }
  }

  return { sidebarItems, actionMaps };
};
export default parseStateMachine; 