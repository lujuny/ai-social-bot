import React, { useState } from 'react';
import {
  CpuChipIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  BeakerIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { OptimizationRule } from '../types';

// 模拟数据
const mockOptimizationRules: OptimizationRule[] = [
  {
    id: '1',
    type: 'script',
    name: '视频开头优化规则',
    description: '基于分析，前3秒用户流失严重，自动优化视频开头内容',
    promptTemplate: '视频开头必须包含强烈的吸引钩子，语速提升1.2倍，避免静音...',
    version: 'v2.1',
    active: true,
    createTime: '2024-01-15 09:00',
    lastApplied: '2024-01-15 14:30'
  },
  {
    id: '2',
    type: 'visual',
    name: '封面图点击率优化',
    description: '提升封面图对比度，使用更鲜明的色彩搭配',
    promptTemplate: '封面图要求高对比度，主体突出，文字清晰可辨...',
    version: 'v1.3',
    active: true,
    createTime: '2024-01-14 16:20',
    lastApplied: '2024-01-15 10:15'
  },
  {
    id: '3',
    type: 'topic',
    name: '选题策略调整',
    description: '避免过度竞争的热点，寻找蓝海话题',
    promptTemplate: '优先选择热度适中但竞争较小的话题...',
    version: 'v1.0',
    active: false,
    createTime: '2024-01-13 11:45'
  }
];

const mockABTests = [
  {
    id: '1',
    name: '视频开头A/B测试',
    description: '测试不同类型开头钩子的用户留存效果',
    status: 'running',
    variants: [
      { name: 'A组：问题悬念式', traffic: 50, performance: 4.2 },
      { name: 'B组：利益展示式', traffic: 50, performance: 5.8 }
    ],
    startTime: '2024-01-15 10:00',
    estimatedEnd: '2024-01-17 10:00'
  },
  {
    id: '2',
    name: '封面图风格测试',
    description: '测试不同封面图风格对点击率的影响',
    status: 'completed',
    variants: [
      { name: 'A组：简约风格', traffic: 50, performance: 3.8 },
      { name: 'B组：炫彩风格', traffic: 50, performance: 6.1 }
    ],
    startTime: '2024-01-13 09:00',
    estimatedEnd: '2024-01-15 09:00',
    winner: 'B组：炫彩风格'
  }
];

const Optimization: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rules' | 'tests' | 'history'>('rules');

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'script': return 'bg-blue-100 text-blue-800';
      case 'visual': return 'bg-purple-100 text-purple-800';
      case 'topic': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'script': return '脚本优化';
      case 'visual': return '视觉优化';
      case 'topic': return '选题优化';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">自优化闭环核心</h1>
          <p className="text-gray-600">AI智能分析反馈，自动优化内容生产策略</p>
        </div>
        <div className="flex space-x-2">
          <button className="btn btn-outline">
            <ClockIcon className="h-4 w-4 mr-2" />
            优化历史
          </button>
          <button className="btn btn-primary">
            <CpuChipIcon className="h-4 w-4 mr-2" />
            AI智能优化
          </button>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'rules', name: '优化规则', icon: DocumentTextIcon },
            { id: 'tests', name: 'A/B测试', icon: BeakerIcon },
            { id: 'history', name: '优化历史', icon: ArrowPathIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'rules' | 'tests' | 'history')}
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

      {/* 优化规则 */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">活跃规则</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockOptimizationRules.filter(r => r.active).length}
                  </p>
                </div>
                <CheckCircleIcon className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">今日优化</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <ArrowPathIcon className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">效果提升</p>
                  <p className="text-2xl font-bold text-green-600">+18%</p>
                </div>
                <CpuChipIcon className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">学习样本</p>
                  <p className="text-2xl font-bold text-gray-900">256</p>
                </div>
                <DocumentTextIcon className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* 规则列表 */}
          <div className="card">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">优化规则库</h3>
              <button className="btn btn-primary text-sm">
                创建新规则
              </button>
            </div>

            <div className="space-y-4">
              {mockOptimizationRules.map((rule) => (
                <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs rounded font-medium ${getTypeColor(rule.type)}`}>
                        {getTypeLabel(rule.type)}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded font-medium ${
                        rule.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rule.active ? '运行中' : '已停用'}
                      </span>
                      <span className="text-sm text-gray-500">版本: {rule.version}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">编辑</button>
                      <button className="text-gray-600 hover:text-gray-800 text-sm">
                        {rule.active ? '停用' : '启用'}
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <h4 className="font-medium text-gray-900 mb-1">{rule.name}</h4>
                    <p className="text-sm text-gray-600">{rule.description}</p>
                  </div>

                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Prompt模板:</h5>
                    <div className="bg-gray-50 p-2 rounded text-sm text-gray-600 font-mono text-xs">
                      {rule.promptTemplate.length > 100
                        ? rule.promptTemplate.substring(0, 100) + '...'
                        : rule.promptTemplate}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>创建时间: {rule.createTime}</span>
                    {rule.lastApplied && <span>最后应用: {rule.lastApplied}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* A/B测试 */}
      {activeTab === 'tests' && (
        <div className="space-y-6">
          <div className="card">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">A/B测试实验</h3>
              <button className="btn btn-primary text-sm">
                创建新测试
              </button>
            </div>

            <div className="space-y-6">
              {mockABTests.map((test) => (
                <div key={test.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium text-gray-900">{test.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded font-medium ${getStatusColor(test.status)}`}>
                        {test.status === 'running' ? '进行中' :
                         test.status === 'completed' ? '已完成' : '失败'}
                      </span>
                      {test.winner && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded font-medium">
                          胜出: {test.winner}
                        </span>
                      )}
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      查看详情
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{test.description}</p>

                  <div className="mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {test.variants.map((variant, index) => (
                        <div key={index} className="border border-gray-200 rounded p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-sm text-gray-900">{variant.name}</span>
                            <span className="text-sm text-gray-600">{variant.traffic}% 流量</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">表现指标:</span>
                            <span className="text-lg font-semibold text-blue-600">{variant.performance}</span>
                          </div>
                          <div className="mt-2 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(variant.performance / 10) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>开始时间: {test.startTime}</span>
                    <span>预计结束: {test.estimatedEnd}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 优化历史 */}
      {activeTab === 'history' && (
        <div className="card">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900">优化历史记录</h3>
          </div>
          <div className="text-center py-12 text-gray-500">
            <ArrowPathIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>暂无优化历史记录</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Optimization;