import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import {
  UserGroupIcon,
  DocumentTextIcon,
  PaperAirplaneIcon,
  ChartBarIcon,
  TrendingUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { DashboardData } from '../types';

// 模拟数据
const mockDashboardData: DashboardData = {
  totalAccounts: 12,
  activeAccounts: 10,
  todayPublished: 24,
  avgEngagement: '4.8%',
  weeklyTrend: [
    { date: '周一', published: 20, engagement: 4.2, views: 15000 },
    { date: '周二', published: 22, engagement: 4.5, views: 18000 },
    { date: '周三', published: 18, engagement: 3.8, views: 12000 },
    { date: '周四', published: 25, engagement: 5.1, views: 22000 },
    { date: '周五', published: 30, engagement: 5.8, views: 28000 },
    { date: '周六', published: 24, engagement: 4.8, views: 24000 },
    { date: '周日', published: 24, engagement: 4.8, views: 20000 },
  ],
  topPerforming: [
    { contentId: '001', title: 'AI办公效率提升技巧', platform: '小红书', score: 95 },
    { contentId: '002', title: 'DeepSeek深度测评', platform: '抖音', score: 88 },
    { contentId: '003', title: '元宇宙营销策略', platform: '知乎', score: 82 },
  ],
  recentActivity: [
    { id: '1', type: 'publish', message: '成功发布内容到抖音账号', time: '2分钟前' },
    { id: '2', type: 'optimize', message: '系统自动优化视频生成Prompt', time: '15分钟前' },
    { id: '3', type: 'error', message: '小红书账号Token需要更新', time: '1小时前' },
    { id: '4', type: 'publish', message: '批量发布5条内容到多个平台', time: '2小时前' },
  ]
};

const Dashboard: React.FC = () => {
  const data = mockDashboardData;

  const stats = [
    { name: '总账号数', value: data.totalAccounts, icon: UserGroupIcon, color: 'bg-blue-500' },
    { name: '活跃账号', value: data.activeAccounts, icon: TrendingUpIcon, color: 'bg-green-500' },
    { name: '今日发布', value: data.todayPublished, icon: PaperAirplaneIcon, color: 'bg-purple-500' },
    { name: '平均互动率', value: data.avgEngagement, icon: ChartBarIcon, color: 'bg-orange-500' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
        <p className="text-gray-600">AI社交媒体机器人系统概览</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 发布趋势图 */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">本周发布趋势</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="published" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 互动率趋势图 */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">互动率趋势</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="engagement" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 热门内容和活动记录 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 热门内容 */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">热门内容</h3>
          <div className="space-y-3">
            {data.topPerforming.map((content) => (
              <div key={content.contentId} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{content.title}</p>
                  <p className="text-sm text-gray-500">{content.platform}</p>
                </div>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${content.score}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{content.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 最近活动 */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">最近活动</h3>
          <div className="space-y-3">
            {data.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${
                  activity.type === 'publish' ? 'bg-blue-100' :
                  activity.type === 'optimize' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {
                    activity.type === 'publish' ? <PaperAirplaneIcon className="h-4 w-4 text-blue-600" /> :
                    activity.type === 'optimize' ? <TrendingUpIcon className="h-4 w-4 text-green-600" /> :
                    <ExclamationTriangleIcon className="h-4 w-4 text-red-600" />
                  }
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;