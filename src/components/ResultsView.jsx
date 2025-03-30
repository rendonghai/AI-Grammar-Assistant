import React from 'react';
import { useAppContext } from '../context/AppContext';

function ResultsView() {
  const { exerciseSession, setActiveView, goToUnitSelection } = useAppContext();
  
  if (!exerciseSession || !exerciseSession.completed) {
    return null;
  }
  
  const { results } = exerciseSession;
  const correctPercentage = Math.round((results.correct / results.total) * 100);
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">练习结果</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-xl font-semibold text-gray-800">总体表现</h3>
            <p className="text-gray-600">题目总数：{results.total}</p>
            <p className="text-gray-600">正确题数：{results.correct}</p>
            <p className="text-gray-600">错误题数：{results.total - results.correct}</p>
          </div>
          
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="stroke-current text-gray-200"
                strokeWidth="4"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`stroke-current ${correctPercentage >= 80 ? 'text-green-500' : correctPercentage >= 60 ? 'text-yellow-500' : 'text-red-500'}`}
                strokeWidth="4"
                strokeDasharray={`${correctPercentage}, 100`}
                strokeLinecap="round"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.5" className="text-lg font-semibold" textAnchor="middle" fill="#333">
                {correctPercentage}%
              </text>
            </svg>
          </div>
        </div>
        
        {results.incorrectExercises.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">错题解析</h3>
            <div className="space-y-6">
              {results.incorrectExercises.map((exercise, idx) => (
                <div key={idx} className="p-4 border rounded-lg border-red-200 bg-red-50">
                  <div className="mb-3">
                    <span className="font-medium text-gray-700">题目 {idx + 1}：</span>
                    <span>{exercise.content}</span>
                  </div>
                  
                  {exercise.options && (
                    <div className="mb-3 text-sm text-gray-600">
                      <p>选项：</p>
                      <ul className="list-disc list-inside pl-4">
                        {exercise.options.map((option, i) => (
                          <li key={i}>{option}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="mb-2">
                    <span className="font-medium text-red-600">你的回答：</span>
                    <span>{exercise.userAnswer || '(未作答)'}</span>
                  </div>
                  
                  <div className="mb-4">
                    <span className="font-medium text-green-600">正确答案：</span>
                    <span>{exercise.answer}</span>
                  </div>
                  
                  {exercise.explanation && (
                    <div className="p-3 bg-white rounded border border-gray-200">
                      <p className="font-medium text-gray-700 mb-1">解析：</p>
                      <p className="text-gray-600 text-sm whitespace-pre-line">{exercise.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row justify-center space-y-3 md:space-y-0 md:space-x-4">
        <button
          onClick={goToUnitSelection}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          返回单元列表
        </button>
        {results.incorrectExercises.length > 0 && (
          <button
            onClick={() => setActiveView('weakPoints')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            查看薄弱点
          </button>
        )}
      </div>
    </div>
  );
}

export default ResultsView;