import React from 'react';
import { useAppContext } from '../context/AppContext';

function UnitSelectionView() {
  const { units, selectUnit } = useAppContext();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">选择学习单元</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {units.map((unit, index) => (
          <div 
            key={index}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
            onClick={() => selectUnit(unit)}
          >
            <div className="p-5">
              <h3 className="text-xl font-semibold mb-2 text-blue-600">{unit.unitName}</h3>
              <h4 className="text-lg text-gray-700 mb-4">{unit.unitTitle}</h4>
              <p className="text-gray-600 text-sm">包含 {unit.grammarPoints.length} 个语法点</p>
            </div>
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
              <button
                className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  selectUnit(unit);
                }}
              >
                <span>查看语法点</span>
                <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UnitSelectionView;