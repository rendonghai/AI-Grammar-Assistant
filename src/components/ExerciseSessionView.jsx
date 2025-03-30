import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import LoadingSpinner from './LoadingSpinner';

function ExerciseSessionView() {
  const { exerciseSession, setActiveView, weakPointsManager } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  
  if (!exerciseSession) {
    return null;
  }
  
  const currentExercise = exerciseSession.getCurrentExercise();
  
  // Initialize answer state when exercise changes
  useEffect(() => {
    if (currentExercise && currentExercise.userAnswer !== undefined) {
      setCurrentAnswer(currentExercise.userAnswer || '');
    }
  }, [exerciseSession.currentIndex, currentExercise]);
  
  const handleAnswerInput = (value) => {
    setCurrentAnswer(value);
    exerciseSession.setCurrentAnswer(value);
  };
  
  const handleNextExercise = () => {
    if (exerciseSession.currentIndex < exerciseSession.exercises.length - 1) {
      // Save current answer before moving
      exerciseSession.setCurrentAnswer(currentAnswer);
      
      // Move to next question
      exerciseSession.goToNextExercise();
      
      // Update the display with saved answer for the next question
      const nextExercise = exerciseSession.getCurrentExercise();
      setCurrentAnswer(nextExercise.userAnswer || '');
    }
  };
  
  const handlePrevExercise = () => {
    if (exerciseSession.currentIndex > 0) {
      // Save current answer before moving
      exerciseSession.setCurrentAnswer(currentAnswer);
      
      // Move to previous question
      exerciseSession.goToPrevExercise();
      
      // Update the display with saved answer for the previous question
      const prevExercise = exerciseSession.getCurrentExercise();
      setCurrentAnswer(prevExercise.userAnswer || '');
    }
  };
  
  const handleSubmitAll = async () => {
    if (!exerciseSession.areAllAnswered()) {
      alert('请先回答所有题目！');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await exerciseSession.submitAnswers();
      
      // Check exercise results
      if (exerciseSession.results.incorrectExercises.length > 0) {
        // Add to weak points if there are incorrect exercises
        exerciseSession.results.incorrectExercises.forEach(() => {
          weakPointsManager.addWeakPoint(exerciseSession.grammarPoint);
        });
      } else if (exerciseSession.results.total > 0) {
        // Remove from weak points if all exercises are correct
        weakPointsManager.removeWeakPoint(exerciseSession.grammarPoint);
      }
      
      setActiveView('results');
    } catch (error) {
      console.error('Error submitting answers:', error);
      alert('提交答案时发生错误，请重试。');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderExerciseContent = () => {
    return (
      <div className="prose max-w-none mb-6">
        <h3 className="text-lg font-medium mb-2">
          题目 {exerciseSession.currentIndex + 1}/{exerciseSession.exercises.length}
        </h3>
        <div className="p-4 bg-blue-50 rounded-md">
          {currentExercise.type === '应用题' ? (
            <p className="whitespace-pre-line">{currentExercise.content}</p>
          ) : (
            <p>{currentExercise.content}</p>
          )}
        </div>
      </div>
    );
  };
  
  const renderAnswerInput = () => {
    const value = currentExercise.userAnswer || '';
    
    switch (currentExercise.type) {
      case '选择题':
        return (
          <div className="space-y-3">
            {currentExercise.options.map((option, idx) => (
              <label 
                key={idx} 
                className={`flex items-start p-3 rounded-md border cursor-pointer transition-all ${
                  currentExercise.userAnswer === option.charAt(0) 
                    ? 'bg-blue-50 border-blue-500' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <input 
                  type="radio" 
                  name={`answer-${exerciseSession.currentIndex}`} 
                  value={option.charAt(0)} 
                  checked={currentExercise.userAnswer === option.charAt(0)}
                  onChange={(e) => handleAnswerInput(e.target.value)}
                  className="mt-1 mr-3"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
        
      case '填空题':
        return (
          <div className="mt-4">
            <label className="block mb-2 text-gray-700">
              请填写答案{currentExercise.answer.includes(';') ? '（多个空格用分号分隔）' : ''}：
            </label>
            <input 
              type="text"
              value={value}
              onChange={(e) => handleAnswerInput(e.target.value)}
              placeholder="请输入答案"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
        
      case '应用题':
        return (
          <div className="mt-4">
            <label className="block mb-2 text-gray-700">请输入你的回答：</label>
            <textarea
              value={value}
              onChange={(e) => handleAnswerInput(e.target.value)}
              rows={4}
              placeholder="请输入你的回答"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">语法练习</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {renderExerciseContent()}
        {renderAnswerInput()}
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={handlePrevExercise}
          disabled={exerciseSession.currentIndex === 0}
          className={`px-4 py-2 rounded-md ${
            exerciseSession.currentIndex === 0
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700 cursor-pointer'
          }`}
          aria-disabled={exerciseSession.currentIndex === 0}
        >
          上一题
        </button>
        
        {exerciseSession.currentIndex === exerciseSession.exercises.length - 1 ? (
          <button
            onClick={handleSubmitAll}
            disabled={isSubmitting || !exerciseSession.areAllAnswered()}
            className={`px-6 py-2 rounded-md ${
              isSubmitting || !exerciseSession.areAllAnswered()
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                提交中...
              </div>
            ) : (
              '提交答案'
            )}
          </button>
        ) : (
          <button
            onClick={handleNextExercise}
            className={`px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white cursor-pointer`}
          >
            下一题
          </button>
        )}
      </div>
      
      <div className="mt-6 flex justify-center">
        <div className="flex items-center space-x-1">
          {exerciseSession.exercises.map((_, idx) => (
            <span 
              key={idx}
              className={`h-2 w-2 rounded-full ${
                idx === exerciseSession.currentIndex
                  ? 'bg-blue-600'
                  : exerciseSession.exercises[idx].userAnswer !== null
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExerciseSessionView;