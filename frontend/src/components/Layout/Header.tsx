import React from 'react';
import { BellIcon, Cog6ToothIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              AI社交媒体机器人管理系统
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* 通知铃铛 */}
            <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              <BellIcon className="h-6 w-6" />
            </button>

            {/* 帮助按钮 */}
            <button className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <QuestionMarkCircleIcon className="h-6 w-6" />
            </button>

            {/* 设置按钮 */}
            <button className="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Cog6ToothIcon className="h-6 w-6" />
            </button>

            {/* 系统状态指示器 */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">系统运行中</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;