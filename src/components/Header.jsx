import React from 'react';
import { useAppContext } from '../context/AppContext';

function Header({ onUnitSelection, onWeakPoints }) {
  const { activeView } = useAppContext();
  
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold">AI 小学英语语法助教</h1>
        
        <nav>
          <ul className="flex space-x-4">
            <li>
              <button 
                onClick={onUnitSelection}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeView === 'unitSelection' || activeView === 'grammarPoints' 
                    ? 'bg-white text-blue-600' 
                    : 'hover:bg-blue-700'
                }`}
              >
                语法单元
              </button>
            </li>
            <li>
              <button 
                onClick={onWeakPoints}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeView === 'weakPoints' 
                    ? 'bg-white text-blue-600' 
                    : 'hover:bg-blue-700'
                }`}
              >
                薄弱点
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;