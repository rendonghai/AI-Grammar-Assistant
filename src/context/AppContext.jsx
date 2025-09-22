import React, { createContext, useContext, useEffect, useReducer } from 'react';
import UnitManager from '../utils/UnitManager';
import WeaknessManager from '../utils/WeaknessManager';
import GrammarPoint from '../utils/GrammarPoint';
import ExerciseSession from '../utils/ExerciseSession';

// Initial state for the application
const initialState = {
  // Data
  loading: true,
  error: null,
  units: [],
  currentUnit: null,
  currentGrammarPoint: null,
  
  // Exercise session
  exerciseSession: null,
  isGeneratingExercises: false,
  
  // Weak points
  weakPointsManager: new WeaknessManager(),
  
  // UI state
  activeView: 'unitSelection', // 'unitSelection', 'grammarPoints', 'exerciseSession', 'results', 'weakPoints'
};

// Create the context
const AppContext = createContext();

// Reducer to handle state updates
function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_UNITS':
      return { ...state, units: action.payload, loading: false };
    case 'SET_CURRENT_UNIT':
      return { 
        ...state, 
        currentUnit: action.payload, 
        activeView: action.payload ? 'grammarPoints' : 'unitSelection' 
      };
    case 'SET_CURRENT_GRAMMAR_POINT':
      return { ...state, currentGrammarPoint: action.payload };
    case 'SET_EXERCISE_SESSION':
      return { 
        ...state, 
        exerciseSession: action.payload,
        activeView: action.payload ? 'exerciseSession' : state.activeView
      };
    case 'SET_GENERATING_EXERCISES':
      return { ...state, isGeneratingExercises: action.payload };
    case 'SET_ACTIVE_VIEW':
      return { ...state, activeView: action.payload };
    default:
      return state;
  }
}

// Provider component
export const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Initialize the unit manager and load data on component mount
  useEffect(() => {
    const loadData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      try {
        const unitManager = new UnitManager();
        await unitManager.loadUnits();
        
        dispatch({ type: 'SET_UNITS', payload: unitManager.getAllUnits() });
      } catch (error) {
        console.error('Failed to load units:', error);
        dispatch({ 
          type: 'SET_ERROR', 
          payload: 'Failed to load grammar units. Please refresh the page.' 
        });
      }
    };
    
    loadData();
  }, []);
  
  // Utility functions to be exposed in the context
  const selectUnit = (unit) => {
    dispatch({ type: 'SET_CURRENT_UNIT', payload: unit });
  };
  
  const selectGrammarPoint = (grammarPoint) => {
    dispatch({ type: 'SET_CURRENT_GRAMMAR_POINT', payload: grammarPoint });
  };
  
  const generateExercises = async (count = 5, grammarPointContent) => {
    const activeGrammarPoint = grammarPointContent || state.currentGrammarPoint;
    if (!activeGrammarPoint) {
      return;
    }

    // Clear any previous errors
    dispatch({ type: 'SET_ERROR', payload: null });
    dispatch({ type: 'SET_GENERATING_EXERCISES', payload: true });
    
    try {
      const grammarPointObj = new GrammarPoint(activeGrammarPoint);
      const exercises = await grammarPointObj.generateExercises(count);
      
      // Validate that we received proper exercises
      if (!Array.isArray(exercises) || exercises.length === 0) {
        throw new Error('No exercises were generated. Please try again.');
      }
      
      // Ensure each exercise has the required properties
      const validExercises = exercises.filter(ex => {
        return ex && typeof ex === 'object' && ex.content && ex.answer;
      });
      
      if (validExercises.length === 0) {
        throw new Error('Generated exercises are invalid. Please try again.');
      }
      
      const session = new ExerciseSession(validExercises, activeGrammarPoint);
      dispatch({ type: 'SET_EXERCISE_SESSION', payload: session });
    } catch (error) {
      console.error('Failed to generate exercises:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Failed to generate exercises. Please try again.' 
      });
    } finally {
      dispatch({ type: 'SET_GENERATING_EXERCISES', payload: false });
    }
  };
  
  const setActiveView = (view) => {
    dispatch({ type: 'SET_ACTIVE_VIEW', payload: view });
  };
  
  // The value to be provided to consumers
  const contextValue = {
    ...state,
    selectUnit,
    selectGrammarPoint,
    generateExercises,
    setActiveView,
    goToUnitSelection: () => {
      dispatch({ type: 'SET_CURRENT_UNIT', payload: null });
      dispatch({ type: 'SET_CURRENT_GRAMMAR_POINT', payload: null });
      dispatch({ type: 'SET_EXERCISE_SESSION', payload: null });
      dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'unitSelection' });
    },
    goToWeakPoints: () => {
      dispatch({ type: 'SET_ACTIVE_VIEW', payload: 'weakPoints' });
    }
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

export default AppContext;
