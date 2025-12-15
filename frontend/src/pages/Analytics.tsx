import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import {
  ChartBarIcon,
  TrendingUpIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ArrowPathIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { ContentMetrics, DiagnosticReport } from '../types';

// 模拟数据
const mockMetrics: ContentMetrics[] = [
  { views: 15000, likes: 450, comments: 89, shares: 34, ctr: '8.5%', retentionRate: '65%', engagement: '3.8%', publishTime: '2024-01-15 10:00', fetchTime: '2024-01-16 10:00' },
  { views: 23000, likes: 890, comments: 156, shares: 78, ctr: '12.3%', retentionRate: '78%', engagement: '4.9%', publishTime: '2024-01-14 15:30', fetchTime: '2024-01-15 15:30' },
];

const mockDiagnosticReports: DiagnosticReport[] = [
  {
    id: '1',
    contentId: 'video_001',
    performanceScore: 45,
    metrics: mockMetrics[0],
    diagnosis: {
      status: 'High_Click_Low_Retention',
      issues: [
        {
          type: 'retention_drop',
          timestamp: '00:03',
          reason: 'Audio_Silence',
          description: '检测到第3秒有长达2秒的静音，导致用户流失'
        },
        {
          type: 'sentiment_negative',
          description: '评论区出现"听不清"、"声音小"等负面反馈'
        }
      ]
    },
    actionableInsight: 'Audio_Volume_Boost_Required',
    reportTime: '2024-01-16 10:00'
  }
];

const weeklyData = [
  { name: '周一', views: 12000, engagement: 3.2 },
  { name: '周二', views: 18000, engagement: 4.1 },
  { name: '周三', views: 15000, engagement: 3.8 },
  { name: '周四', views: 22000, engagement: 5.2 },
  { name: '周五', views: 28000, engagement: 6.1 },
  { name: '周六', views: 24000, engagement: 5.5 },
  { name: '周日', views: 20000, engagement: 4.8 },
];

const platformData = [
  { name: '抖音', value: 45, color: '#FF6B6B' },
  { name: '小红书', value: 30, color: '#4ECDC4' },
  { name: '知乎', value: 15, color: '#45B7D1' },
  { name: '微博', value: 10, color: '#FFA07A' },
];

const Analytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'diagnosis'>('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return '优秀';
    if (score >= 60) return '良好';
    if (score >= 40) return '一般';
    return '较差';
  };

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">数据归因与分析中心</h1>
          <p className="text-gray-600">深度分析内容表现，AI智能诊断优化建议</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            className="input"
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
          >
            <option value="24h">最近24小时</option>
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
          </select>
          <button className="btn btn-outline">
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            刷新数据
          </button>
          <button className="btn btn-primary">
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            导出报告
          </button>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: '数据概览', icon: ChartBarIcon },
            { id: 'content', name: '内容分析', icon: EyeIcon },
            { id: 'diagnosis', name: 'AI诊断报告', icon: TrendingUpIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'content' | 'diagnosis')}
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

      {/* 数据概览 */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 关键指标卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">总播放量</p>
                  <p className="text-2xl font-bold text-gray-900">156.8K</p>
                  <p className="text-xs text-green-600">↑ 12.5% vs 上周</p>
                </div>
                <EyeIcon className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">总互动量</p>
                  <p className="text-2xl font-bold text-gray-900">12.4K</p>
                  <p className="text-xs text-green-600">↑ 8.3% vs 上周</p>
                </div>
                <HeartIcon className="h-8 w-8 text-red-500" />
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">平均完播率</p>
                  <p className="text-2xl font-bold text-gray-900">68.2%</p>
                  <p className="text-xs text-red-600">↓ 2.1% vs 上周</p>
                </div>
                <ChartBarIcon className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">平均互动率</p>
                  <p className="text-2xl font-bold text-gray-900">4.6%</p>
                  <p className="text-xs text-green-600">↑ 0.8% vs 上周</p>
                </div>
                <TrendingUpIcon className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* 图表区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 播放量趋势 */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">播放量趋势</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 平台分布 */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">平台分布</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {platformData.map((platform) => (
                  <div key={platform.name} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: platform.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{platform.name}: {platform.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 互动率趋势 */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">互动率趋势</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="engagement" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 内容分析 */}
      {activeTab === 'content' && (
        <div className="card">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">内容表现详情</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    内容
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    播放量
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    点赞数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    评论数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    分享数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    完播率
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    综合评分
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockMetrics.map((metrics, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        DeepSeek测评视频 #{index + 1}
                      </div>
                      <div className="text-sm text-gray-500">
                        发布: {metrics.publishTime}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {metrics.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {metrics.likes}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {metrics.comments}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {metrics.shares}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {metrics.retentionRate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900 mr-2">
                          {index === 0 ? '45' : '78'}
                        </div>
                        <span className={`text-sm ${getScoreColor(index === 0 ? 45 : 78)}`}>
                          {getScoreLabel(index === 0 ? 45 : 78)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI诊断报告 */}
      {activeTab === 'diagnosis' && (
        <div className="space-y-6">
          {mockDiagnosticReports.map((report) => (
            <div key={report.id} className="card">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    内容诊断报告 - {report.contentId}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">综合评分:</span>
                    <span className={`text-2xl font-bold ${getScoreColor(report.performanceScore)}`}>
                      {report.performanceScore}
                    </span>
                    <span className="text-sm text-gray-600">/100</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 数据表现 */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">数据表现</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">播放量:</span>
                      <span className="text-sm font-medium">{report.metrics.views.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">点击率:</span>
                      <span className="text-sm font-medium">{report.metrics.ctr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">完播率:</span>
                      <span className="text-sm font-medium text-red-600">{report.metrics.retentionRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">互动率:</span>
                      <span className="text-sm font-medium">{report.metrics.engagement}</span>
                    </div>
                  </div>
                </div>

                {/* 问题诊断 */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">问题诊断</h4>
                  <div className="space-y-3">
                    {report.diagnosis.issues.map((issue, index) => (
                      <div key={index} className="border-l-4 border-red-500 pl-4 py-2 bg-red-50 rounded">
                        <div className="flex items-center mb-1">
                          <span className="text-sm font-medium text-red-800">
                            {issue.type === 'retention_drop' ? '用户流失' : '负面反馈'}
                          </span>
                          {issue.timestamp && (
                            <span className="ml-2 text-xs text-red-600">
                              时间点: {issue.timestamp}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-red-700">{issue.description}</p>
                        {issue.reason && (
                          <p className="text-xs text-red-600 mt-1">原因: {issue.reason}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 优化建议 */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-md font-medium text-blue-900 mb-2">AI优化建议</h4>
                <p className="text-sm text-blue-800">
                  {report.actionableInsight === 'Audio_Volume_Boost_Required' &&
                    '建议提升音频音量，确保前3秒没有静音片段，并在视频开头增加更强的吸引力钩子。'}
                </p>
              </div>

              {/* 操作按钮 */}
              <div className="mt-6 flex justify-end space-x-3">
                <button className="btn btn-secondary">查看详细分析</button>
                <button className="btn btn-primary">应用优化建议</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Analytics;