import React, { useState } from 'react';
import {
  PaperAirplaneIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { PublishRecord } from '../types';

// 模拟数据
const mockPublishRecords: PublishRecord[] = [
  {
    id: '1',
    taskId: '1',
    platform: '抖音',
    accountId: '科技前沿君',
    status: 'Success',
    publishTime: '2024-01-15 10:30',
    postResult: {
      platformPostId: 'douyin_123456',
      postUrl: 'https://douyin.com/video/123456',
      screenshotPath: '/screenshots/douyin_123456.jpg'
    }
  },
  {
    id: '2',
    taskId: '2',
    platform: '小红书',
    accountId: 'AI工具测评',
    status: 'Pending',
    publishTime: '2024-01-15 11:00',
    postResult: {}
  },
  {
    id: '3',
    taskId: '3',
    platform: '知乎',
    accountId: '科技专栏',
    status: 'Failed',
    publishTime: '2024-01-15 09:45',
    postResult: {},
  }
];

const Distribution: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'queue' | 'history' | 'schedule'>('queue');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-blue-100 text-blue-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Success': return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'Pending': return <ClockIcon className="h-4 w-4 text-blue-500" />;
      case 'Failed': return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case '抖音': return '🎵';
      case '小红书': return '📕';
      case '知乎': return '🔍';
      case '微博': return '🔴';
      case 'TikTok': return '🎵';
      default: return '📱';
    }
  };

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">自动化分发矩阵</h1>
          <p className="text-gray-600">一键发布到多平台，智能排期管理</p>
        </div>
        <div className="flex space-x-2">
          <button className="btn btn-outline">
            <CalendarIcon className="h-4 w-4 mr-2" />
            排期管理
          </button>
          <button className="btn btn-primary">
            <PaperAirplaneIcon className="h-4 w-4 mr-2" />
            立即发布
          </button>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'queue', name: '发布队列', icon: ClockIcon },
            { id: 'history', name: '发布历史', icon: ChartBarIcon },
            { id: 'schedule', name: '定时发布', icon: CalendarIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'queue' | 'history' | 'schedule')}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500 rounded-lg">
              <PaperAirplaneIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">今日发布</p>
              <p className="text-2xl font-semibold text-gray-900">24</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-500 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">成功率</p>
              <p className="text-2xl font-semibold text-gray-900">95%</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-500 rounded-lg">
              <ClockIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">等待中</p>
              <p className="text-2xl font-semibold text-gray-900">8</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-500 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">覆盖平台</p>
              <p className="text-2xl font-semibold text-gray-900">6</p>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="card">
        {activeTab === 'queue' && (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">发布队列</h3>
              <button className="btn btn-secondary text-sm">批量发布</button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      内容
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      平台账号
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      计划时间
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockPublishRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                              📹
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">DeepSeek测评视频</div>
                            <div className="text-sm text-gray-500">时长: 3:00</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="mr-2">{getPlatformIcon(record.platform)}</span>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{record.platform}</div>
                            <div className="text-sm text-gray-500">{record.accountId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(record.status)}
                          <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                            {record.status === 'Success' ? '发布成功' :
                             record.status === 'Pending' ? '等待发布' : '发布失败'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.publishTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {record.status === 'Success' ? (
                          <a href={record.postResult.postUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900 mr-3">
                            查看
                          </a>
                        ) : (
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            重试
                          </button>
                        )}
                        <button className="text-gray-600 hover:text-gray-900">
                          详情
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">发布历史</h3>
            </div>
            <div className="text-center py-12 text-gray-500">
              <ChartBarIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>暂无历史数据</p>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">定时发布计划</h3>
              <button className="btn btn-primary text-sm">添加计划</button>
            </div>
            <div className="text-center py-12 text-gray-500">
              <CalendarIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>暂无定时发布计划</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Distribution;