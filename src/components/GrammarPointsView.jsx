import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import LoadingSpinner from './LoadingSpinner';

function GrammarPointsView() {
  const { 
    currentUnit, 
    selectGrammarPoint, 
    generateExercises, 
    isGeneratingExercises,
    goToUnitSelection
  } = useAppContext();
  
  const [selectedGrammarPointIndex, setSelectedGrammarPointIndex] = useState(null);
  const [exerciseCount, setExerciseCount] = useState(5);

  if (!currentUnit) {
    return null;
  }

  const handleExerciseGeneration = async () => {
    if (selectedGrammarPointIndex !== null) {
      const grammarPoint = currentUnit.grammarPoints[selectedGrammarPointIndex].content;
      selectGrammarPoint(grammarPoint);
      generateExercises(exerciseCount, grammarPoint);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button 
          className="flex items-center text-blue-600 hover:text-blue-800"
          onClick={goToUnitSelection}
        >
          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          返回单元列表
        </button>
        <h2 className="text-2xl font-bold text-center text-gray-800 flex-grow">
          {currentUnit.unitName}: {currentUnit.unitTitle}
        </h2>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">选择语法点进行练习</h3>
        
        {currentUnit.grammarPoints.map((grammarPoint, index) => (
          <div 
            key={index}
            className={`mb-4 p-4 border rounded-lg transition-all ${
              selectedGrammarPointIndex === index 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setSelectedGrammarPointIndex(index)}
          >
            <div className="flex items-start">
              <div className="mr-3 mt-1">
                <input 
                  type="radio" 
                  id={`grammar-point-${index}`}
                  name="grammarPoint"
                  checked={selectedGrammarPointIndex === index}
                  onChange={() => setSelectedGrammarPointIndex(index)}
                  className="h-4 w-4 text-blue-600" 
                />
              </div>
              <div className="flex-grow">
                <label 
                  htmlFor={`grammar-point-${index}`} 
                  className="text-gray-800 cursor-pointer block mb-2"
                >
                  {grammarPoint.content}
                </label>
                
                {grammarPoint.examples.length > 0 && (
                  <div className="mt-2 text-gray-600 text-sm">
                    <p className="font-medium mb-1">示例：</p>
                    <ul className="list-disc list-inside pl-2 space-y-1">
                      {grammarPoint.examples.map((example, i) => (
                        <li key={i}>{example}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedGrammarPointIndex !== null && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <label htmlFor="exerciseCount" className="text-gray-700 font-medium">
              题目数量：
            </label>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setExerciseCount(Math.max(1, exerciseCount - 1))}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700"
                disabled={exerciseCount <= 1}
              >
                -
              </button>
              <input
                id="exerciseCount"
                type="number"
                min="1"
                max="10"
                value={exerciseCount}
                onChange={(e) => setExerciseCount(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-12 text-center border rounded p-1"
              />
              <button 
                onClick={() => setExerciseCount(Math.min(10, exerciseCount + 1))}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700"
                disabled={exerciseCount >= 10}
              >
                +
              </button>
            </div>
          </div>
          
          <button
            onClick={handleExerciseGeneration}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
            disabled={isGeneratingExercises}
          >
            {isGeneratingExercises ? (
              <>
                <div className="w-5 h-5 mr-3 border-t-2 border-white rounded-full animate-spin"></div>
                正在生成习题...
              </>
            ) : (
              '生成练习题'
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default GrammarPointsView;
