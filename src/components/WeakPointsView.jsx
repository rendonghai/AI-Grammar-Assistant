import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import LoadingSpinner from './LoadingSpinner';

function WeakPointsView() {
  const { 
    weakPointsManager, 
    generateExercises,
    isGeneratingExercises,
    currentGrammarPoint,
    selectGrammarPoint
  } = useAppContext();
  
  const [selectedWeakPoint, setSelectedWeakPoint] = useState(null);
  const [exerciseCount, setExerciseCount] = useState(5);
  const weakPoints = weakPointsManager.getWeakPoints();
  
  const handleExerciseGeneration = () => {
    if (selectedWeakPoint) {
      selectGrammarPoint(selectedWeakPoint.grammarPoint);
      generateExercises(exerciseCount);
    }
  };
  
  // If there are no weak points, show a message
  if (weakPoints.length === 0) {
    return (
      <div className="text-center py-12">
        <svg 
          className="w-16 h-16 mx-auto text-green-500 mb-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <h3 className="text-xl font-semibold mb-2 text-gray-800">太棒了！</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          目前没有需要加强练习的薄弱语法点。继续保持良好的学习状态！
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">薄弱点专项练习</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">选择需要加强的语法点</h3>
        
        {weakPoints.map((weakPoint, index) => (
          <div 
            key={index}
            className={`mb-4 p-4 border rounded-lg transition-all ${
              selectedWeakPoint === weakPoint
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setSelectedWeakPoint(weakPoint)}
          >
            <div className="flex items-start">
              <div className="mr-3 mt-1">
                <input 
                  type="radio" 
                  id={`weak-point-${index}`}
                  name="weakPoint"
                  checked={selectedWeakPoint === weakPoint}
                  onChange={() => setSelectedWeakPoint(weakPoint)}
                  className="h-4 w-4 text-blue-600" 
                />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <label 
                    htmlFor={`weak-point-${index}`} 
                    className="text-gray-800 cursor-pointer block mb-2 flex-grow"
                  >
                    <div className="line-clamp-2">{weakPoint.grammarPoint}</div>
                  </label>
                  <div className="ml-2 flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      错误次数: {weakPoint.errorCount}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500">
                  上次练习: {weakPoint.lastPracticeDate.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedWeakPoint && (
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
              '生成专项练习题'
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default WeakPointsView;