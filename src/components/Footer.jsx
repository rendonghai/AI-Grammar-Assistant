import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-4 mt-8">
      <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
        <p>© {currentYear} AI 小学英语语法助教 | 帮助学生更好地掌握英语语法知识</p>
      </div>
    </footer>
  );
}

export default Footer;