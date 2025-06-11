const parseStateMachine = (stateMachine) => {
  const sidebarItems = [];
  const actionMaps = {};

  if (!stateMachine || !stateMachine.StartAt || !stateMachine.States) {
    console.error("Invalid state machine structure.");
    return { sidebarItems, actionMaps };
  }

  let currentStateName = stateMachine.StartAt;
  let currentState = stateMachine.States[currentStateName];

  while (currentState) {
    const baseLabel = currentState.Desc || currentStateName;
    const workflowPath = currentStateName.toLowerCase().replace(/[^a-z0-9]/g, ''); // Simple slug for workflowPath

    // Handle SubStates
    if (currentState.SubStates && typeof currentState.SubStates === 'object') {
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
      }
    } else {
      // Handle main states without sub-states
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