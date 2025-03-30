import React from 'react';
import { AppContextProvider, useAppContext } from './context/AppContext';
import UnitSelectionView from './components/UnitSelectionView';
import GrammarPointsView from './components/GrammarPointsView';
import ExerciseSessionView from './components/ExerciseSessionView';
import ResultsView from './components/ResultsView';
import WeakPointsView from './components/WeakPointsView';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

// Main application component wrapper with context provider
function AppWrapper() {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}

// The actual app content that uses the context
function AppContent() {
  const { 
    loading, 
    error, 
    activeView,
    goToUnitSelection,
    goToWeakPoints
  } = useAppContext();

  // Show loading spinner while data is loading
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <LoadingSpinner />
        </main>
        <Footer />
      </div>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center p-8 max-w-md mx-auto">
            <div className="text-red-500 text-xl mb-4">
              <svg className="w-12 h-12 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p>{error}</p>
            </div>
            <button 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => window.location.reload()}
            >
              刷新页面
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header onUnitSelection={goToUnitSelection} onWeakPoints={goToWeakPoints} />
      
      <main className="flex-grow container mx-auto p-4 md:p-6">
        {activeView === 'unitSelection' && <UnitSelectionView />}
        {activeView === 'grammarPoints' && <GrammarPointsView />}
        {activeView === 'exerciseSession' && <ExerciseSessionView />}
        {activeView === 'results' && <ResultsView />}
        {activeView === 'weakPoints' && <WeakPointsView />}
      </main>
      
      <Footer />
    </div>
  );
}

export default AppWrapper;