import React, { useState } from 'react';
import { FireIcon, TrendingUpIcon, SparklesIcon, ClockIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { TrendingTopic, ContentTask } from '../types';

// 模拟数据
const mockTrendingTopics: TrendingTopic[] = [
  {
    id: '1',
    platform: '抖音',
    title: 'DeepSeek发布新版本，代码生成能力提升50%',
    heat: 95,
    category: 'AI科技',
    keywords: ['DeepSeek', 'AI', '编程', '代码生成'],
    matched: true,
    score: 92
  },
  {
    id: '2',
    platform: '微博',
    title: '2024年最佳AI工具评选',
    heat: 88,
    category: '工具测评',
    keywords: ['AI工具', '评选', '2024'],
    matched: true,
    score: 85
  },
  {
    id: '3',
    platform: '小红书',
    title: '用AI提高工作效率的10个技巧',
    heat: 76,
    category: '效率提升',
    keywords: ['AI', '工作效率', '技巧'],
    matched: false,
    score: 45
  },
  {
    id: '4',
    platform: '知乎',
    title: '程序员如何利用AI副业月入过万',
    heat: 82,
    category: '职场话题',
    keywords: ['程序员', 'AI', '副业'],
    matched: true,
    score: 78
  },
];

const mockContentTasks: ContentTask[] = [
  {
    id: '1',
    topicSource: '抖音热榜TOP3 - DeepSeek发布',
    targetAccount: '科技博主_01',
    strategy: {
      angleType: '对比测评',
      coreMessage: '国产模型 DeepSeek 到底能不能打过 GPT-4？',
      tone: '客观、数据流、语速快',
      requiredElements: [
        '必须包含代码生成速度对比画面',
        '结尾引导用户去评论区领测试地址'
      ]
    },
    priority: 'High',
    status: 'in_progress',
    createTime: '2024-01-15 09:30'
  },
  {
    id: '2',
    topicSource: '微博热点 - AI工具评选',
    targetAccount: 'AI工具测评',
    strategy: {
      angleType: '盘点推荐',
      coreMessage: '2024年最值得使用的5款AI工具',
      tone: '轻松、实用、有说服力',
      requiredElements: [
        '每个工具展示实际使用效果',
        '包含价格对比'
      ]
    },
    priority: 'Medium',
    status: 'pending',
    createTime: '2024-01-15 10:15'
  },
];

const Trends: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<TrendingTopic | null>(null);
  const [activeView, setActiveView] = useState<'topics' | 'tasks'>('topics');

  const getHeatColor = (heat: number) => {
    if (heat >= 90) return 'text-red-600 bg-red-100';
    if (heat >= 70) return 'text-orange-600 bg-orange-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">趋势感知与决策引擎</h1>
          <p className="text-gray-600">实时监控全网热点，智能生成内容策略</p>
        </div>
        <div className="flex space-x-2">
          <button className="btn btn-outline">
            <ClockIcon className="h-4 w-4 mr-2" />
            手动刷新
          </button>
          <button className="btn btn-primary">
            <SparklesIcon className="h-4 w-4 mr-2" />
            AI智能分析
          </button>
        </div>
      </div>

      {/* 视图切换 */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'topics', name: '热点话题监控', icon: FireIcon },
            { id: 'tasks', name: '选题任务队列', icon: TrendingUpIcon },
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as 'topics' | 'tasks')}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeView === view.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <view.icon className="h-4 w-4 mr-2" />
              {view.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧主要内容 */}
        <div className="lg:col-span-2">
          {/* 热点话题监控 */}
          {activeView === 'topics' && (
            <div className="card">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">实时热点</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <EyeIcon className="h-4 w-4" />
                  <span>每5分钟自动更新</span>
                </div>
              </div>

              <div className="space-y-4">
                {mockTrendingTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
                    onClick={() => setSelectedTopic(topic)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {topic.platform}
                          </span>
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                            {topic.category}
                          </span>
                          {topic.matched && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                              已匹配
                            </span>
                          )}
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2">{topic.title}</h4>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {topic.keywords.map((keyword, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                                {keyword}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getHeatColor(topic.heat)}`}>
                              🔥 {topic.heat}
                            </div>
                            {topic.score && (
                              <div className="text-sm text-gray-500">
                                匹配度: {topic.score}%
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 选题任务队列 */}
          {activeView === 'tasks' && (
            <div className="card">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">待生产任务</h3>
                <button className="btn btn-primary text-sm">
                  创建任务
                </button>
              </div>

              <div className="space-y-4">
                {mockContentTasks.map((task) => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority === 'High' ? '高优先级' : task.priority === 'Medium' ? '中优先级' : '低优先级'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded font-medium ${getStatusColor(task.status)}`}>
                          {task.status === 'pending' ? '等待中' :
                           task.status === 'in_progress' ? '生产中' :
                           task.status === 'completed' ? '已完成' : '失败'}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{task.createTime}</span>
                    </div>

                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900 mb-1">{task.strategy.coreMessage}</h4>
                      <p className="text-sm text-gray-600">来源: {task.topicSource}</p>
                      <p className="text-sm text-gray-600">目标账号: {task.targetAccount}</p>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">策略要求:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {task.strategy.requiredElements.map((element, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                            {element}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button className="btn btn-secondary text-sm">编辑</button>
                      <button className="btn btn-primary text-sm">立即生产</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 右侧面板 */}
        <div className="space-y-6">
          {/* 选题分析详情 */}
          {selectedTopic && activeView === 'topics' && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">选题分析</h3>
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{selectedTopic.title}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">热度指数:</span>
                      <span className="font-medium">{selectedTopic.heat}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">人设匹配度:</span>
                      <span className="font-medium">{selectedTopic.score || 0}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">竞争程度:</span>
                      <span className="font-medium text-orange-600">中等</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">建议切入角度:</h5>
                  <div className="space-y-2">
                    <div className="p-2 bg-blue-50 rounded text-sm">
                      1. 技术对比分析 - 深度测评优势劣势
                    </div>
                    <div className="p-2 bg-green-50 rounded text-sm">
                      2. 实用教程 - 手把手教大家使用
                    </div>
                    <div className="p-2 bg-purple-50 rounded text-sm">
                      3. 行业影响 - 分析对从业者的影响
                    </div>
                  </div>
                </div>

                <button className="btn btn-primary w-full">
                  创建选题任务
                </button>
              </div>
            </div>
          )}

          {/* 系统状态 */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">监控状态</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">抖音热搜</span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm text-green-600">正常</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">微博热榜</span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm text-green-600">正常</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">小红书热门</span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  <span className="text-sm text-yellow-600">延迟</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">知乎热榜</span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm text-green-600">正常</span>
                </span>
              </div>
            </div>
          </div>

          {/* 今日统计 */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">今日统计</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">监控话题</span>
                <span className="text-sm font-medium">248</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">匹配成功</span>
                <span className="text-sm font-medium text-green-600">42</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">生成任务</span>
                <span className="text-sm font-medium text-blue-600">18</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">AI建议采纳率</span>
                <span className="text-sm font-medium">87%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trends;