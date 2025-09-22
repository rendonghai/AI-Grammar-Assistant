import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

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
  const [checkedWeakPoints, setCheckedWeakPoints] = useState([]);
  const [storedPassword, setStoredPassword] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [oldPasswordInput, setOldPasswordInput] = useState('');
  const [deletePasswordInput, setDeletePasswordInput] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const weakPoints = weakPointsManager.getWeakPoints();

  useEffect(() => {
    try {
      const savedPassword = localStorage.getItem('weak_points_admin_password');
      if (savedPassword) {
        setStoredPassword(savedPassword);
      }
    } catch (error) {
      console.error('Failed to load weak points password:', error);
    }
  }, []);

  // Reset checked items when weak points change
  useEffect(() => {
    setCheckedWeakPoints([]);
  }, [weakPoints.length]);

  const togglePasswordForm = () => {
    setShowPasswordForm(prev => !prev);
    setPasswordMessage('');
    setOldPasswordInput('');
    setPasswordInput('');
    setConfirmPasswordInput('');
  };

  const handlePasswordSave = () => {
    if (storedPassword) {
      if (!oldPasswordInput) {
        setPasswordMessage('请输入旧密码');
        return;
      }

      if (oldPasswordInput !== storedPassword) {
        setPasswordMessage('旧密码不正确');
        return;
      }
    }

    if (!passwordInput) {
      setPasswordMessage('密码不能为空');
      return;
    }

    if (passwordInput !== confirmPasswordInput) {
      setPasswordMessage('两次输入的密码不一致');
      return;
    }

    try {
      localStorage.setItem('weak_points_admin_password', passwordInput);
      setStoredPassword(passwordInput);
      setShowPasswordForm(false);
      setOldPasswordInput('');
      setPasswordInput('');
      setConfirmPasswordInput('');
      setPasswordMessage('');
    } catch (error) {
      console.error('Failed to save weak points password:', error);
      setPasswordMessage('保存密码失败，请重试');
    }
  };

  const handleExerciseGeneration = () => {
    if (selectedWeakPoint) {
      selectGrammarPoint(selectedWeakPoint.grammarPoint);
      generateExercises(exerciseCount);
    }
  };
  
  const handleCheckboxChange = (grammarPoint) => {
    setCheckedWeakPoints(prev => {
      if (prev.includes(grammarPoint)) {
        return prev.filter(point => point !== grammarPoint);
      } else {
        return [...prev, grammarPoint];
      }
    });
  };

  const handleDeleteSelected = () => {
    if (checkedWeakPoints.length === 0) return;

    if (!storedPassword) {
      setDeleteError('请先设置管理密码');
      return;
    }

    if (deletePasswordInput !== storedPassword) {
      setDeleteError('管理密码不正确');
      return;
    }

    // Remove the selected weak points
    weakPointsManager.removeMultipleWeakPoints(checkedWeakPoints);

    // Clear checked items
    setCheckedWeakPoints([]);
    setDeletePasswordInput('');
    setDeleteError('');

    // Clear selected weak point if it was deleted
    if (selectedWeakPoint && checkedWeakPoints.includes(selectedWeakPoint.grammarPoint)) {
      setSelectedWeakPoint(null);
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
      
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h3 className="text-xl font-semibold text-gray-700">选择需要加强的语法点</h3>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
          <button
            onClick={togglePasswordForm}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            {storedPassword ? '修改管理密码' : '设置管理密码'}
          </button>
          {checkedWeakPoints.length > 0 && (
            <button 
              onClick={handleDeleteSelected}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              删除选中项 ({checkedWeakPoints.length})
            </button>
          )}
        </div>
      </div>

      {showPasswordForm && (
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
          {storedPassword && (
            <div className="mb-3">
              <label htmlFor="oldAdminPassword" className="block text-gray-700 mb-1">输入旧密码</label>
              <input
                id="oldAdminPassword"
                type="password"
                value={oldPasswordInput}
                onChange={(e) => setOldPasswordInput(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入当前管理密码"
              />
            </div>
          )}
          <div className="mb-3">
            <label htmlFor="adminPassword" className="block text-gray-700 mb-1">输入新密码</label>
            <input
              id="adminPassword"
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入管理密码"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmAdminPassword" className="block text-gray-700 mb-1">确认新密码</label>
            <input
              id="confirmAdminPassword"
              type="password"
              value={confirmPasswordInput}
              onChange={(e) => setConfirmPasswordInput(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请再次输入密码"
            />
          </div>
          {passwordMessage && (
            <p className="text-sm text-red-600 mb-3">{passwordMessage}</p>
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={togglePasswordForm}
              className="px-3 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              取消
            </button>
            <button
              onClick={handlePasswordSave}
              className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              保存密码
            </button>
          </div>
        </div>
      )}

      <div className="mb-8">
        {weakPoints.map((weakPoint, index) => (
          <div 
            key={index}
            className={`mb-4 p-4 border rounded-lg transition-all ${
              selectedWeakPoint === weakPoint
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-start">
              <div className="flex space-x-2 mr-3 mt-1">
                <input 
                  type="checkbox" 
                  id={`check-weak-point-${index}`}
                  checked={checkedWeakPoints.includes(weakPoint.grammarPoint)}
                  onChange={(e) => {
                    // Prevent radio button click when clicking on checkbox
                    e.stopPropagation(); 
                    handleCheckboxChange(weakPoint.grammarPoint);
                  }}
                  className="h-4 w-4 text-red-600" 
                />
                <input 
                  type="radio" 
                  id={`weak-point-${index}`}
                  name="weakPoint"
                  checked={selectedWeakPoint === weakPoint}
                  onChange={() => setSelectedWeakPoint(weakPoint)}
                  className="h-4 w-4 text-blue-600" 
                />
              </div>
              <div 
                className="flex-grow cursor-pointer"
                onClick={() => setSelectedWeakPoint(weakPoint)}
              >
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

      {checkedWeakPoints.length > 0 && (
        <div className="mb-8 bg-white p-4 rounded-lg shadow-md">
          <label htmlFor="deletePassword" className="block text-gray-700 mb-2">
            输入管理密码以删除选中的薄弱点：
          </label>
          <input
            id="deletePassword"
            type="password"
            value={deletePasswordInput}
            onChange={(e) => {
              setDeletePasswordInput(e.target.value);
              setDeleteError('');
            }}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="请输入管理密码"
          />
          {deleteError && (
            <p className="text-sm text-red-600 mt-2">{deleteError}</p>
          )}
        </div>
      )}

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
