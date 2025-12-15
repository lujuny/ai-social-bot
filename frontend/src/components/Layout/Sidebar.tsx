import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  CogIcon,
  TrendingUpIcon,
  PencilSquareIcon,
  PaperAirplaneIcon,
  ChartBarIcon,
  CpuChipIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: '仪表盘', href: '/', icon: HomeIcon },
  { name: '配置与账号中台', href: '/accounts', icon: CogIcon },
  { name: '趋势感知与决策', href: '/trends', icon: TrendingUpIcon },
  { name: '内容生产工厂', href: '/content', icon: PencilSquareIcon },
  { name: '自动化分发', href: '/distribution', icon: PaperAirplaneIcon },
  { name: '数据分析中心', href: '/analytics', icon: ChartBarIcon },
  { name: '自优化闭环', href: '/optimization', icon: CpuChipIcon },
  { name: '团队管理', href: '/team', icon: UserGroupIcon },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <CpuChipIcon className="w-5 h-5 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-gray-900">AI社媒机器人</h1>
              <p className="text-xs text-gray-500">智能内容自优化系统</p>
            </div>
          </div>
        </div>

        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`sidebar-item ${isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'}`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">管理员</p>
            <p className="text-xs text-gray-500">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;