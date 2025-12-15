import React, { useState } from 'react';
import {
  PlayIcon,
  StopIcon,
  PencilSquareIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { ContentTask, ContentPackage } from '../types';

// 模拟数据
const mockActiveTasks: ContentTask[] = [
  {
    id: '1',
    topicSource: '抖音热榜 - DeepSeek发布',
    targetAccount: '科技前沿君',
    strategy: {
      angleType: '对比测评',
      coreMessage: '国产模型 DeepSeek 到底能不能打过 GPT-4？',
      tone: '客观、数据流、语速快',
      requiredElements: ['代码生成速度对比', '测试地址引导']
    },
    priority: 'High',
    status: 'in_progress',
    createTime: '2024-01-15 09:30'
  },
  {
    id: '2',
    topicSource: '手动选题',
    targetAccount: 'AI工具测评',
    strategy: {
      angleType: '实用教程',
      coreMessage: '用AI 10倍提升工作效率的实用技巧',
      tone: '轻松、实用、接地气',
      requiredElements: ['实际演示', '效果对比']
    },
    priority: 'Medium',
    status: 'pending',
    createTime: '2024-01-15 10:15'
  }
];

const mockContentPackages: ContentPackage[] = [
  {
    id: '1',
    taskId: '1',
    contentType: 'video',
    status: 'Ready_to_Publish',
    assets: {
      videoFile: 's3://bucket/deepseek_review_v1.mp4',
      coverImage: 's3://bucket/cover_thumb.jpg',
      srtFile: 's3://bucket/subs.srt'
    },
    metadata: {
      title: '国产之光？DeepSeek 深度测评，结果吓我一跳！',
      description: '实测国产大模型 DeepSeek，代码生成能力直逼 GPT-4...',
      tags: ['AI', '科技', '编程'],
      duration: 180
    }
  },
  {
    id: '2',
    taskId: '2',
    contentType: 'image',
    status: 'processing',
    assets: {
      coverImage: 's3://bucket/ai_efficiency_tips.jpg'
    },
    metadata: {
      title: 'AI提效技巧合集',
      description: '10个让你工作效率翻倍的AI工具使用技巧',
      tags: ['AI', '效率', '工具']
    }
  }
];

const Content: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'production' | 'library'>('tasks');
  const [selectedTask, setSelectedTask] = useState<ContentTask | null>(null);

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <VideoCameraIcon className="h-5 w-5" />;
      case 'image': return <PhotoIcon className="h-5 w-5" />;
      case 'text': return <DocumentTextIcon className="h-5 w-5" />;
      default: return <DocumentTextIcon className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready_to_Publish': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Ready_to_Publish': return '待发布';
      case 'processing': return '生产中';
      case 'completed': return '已完成';
      case 'pending': return '等待中';
      case 'failed': return '失败';
      default: return status;
    }
  };

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">多模态内容生产工厂</h1>
          <p className="text-gray-600">AI智能生成文案、图片、视频内容</p>
        </div>
        <div className="flex space-x-2">
          <button className="btn btn-outline">
            <ClockIcon className="h-4 w-4 mr-2" />
            生产历史
          </button>
          <button className="btn btn-primary">
            <PencilSquareIcon className="h-4 w-4 mr-2" />
            创建内容
          </button>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'tasks', name: '生产任务', icon: PlayIcon },
            { id: 'production', name: '内容包管理', icon: DocumentTextIcon },
            { id: 'library', name: '素材库', icon: PhotoIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'tasks' | 'production' | 'library')}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧主要内容 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 生产任务列表 */}
          {activeTab === 'tasks' && (
            <div className="card">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">生产任务队列</h3>
                <div className="text-sm text-gray-500">
                  共 {mockActiveTasks.length} 个任务
                </div>
              </div>

              <div className="space-y-4">
                {mockActiveTasks.map((task) => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs rounded font-medium ${
                          task.priority === 'High' ? 'bg-red-100 text-red-800' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority === 'High' ? '高' : task.priority === 'Medium' ? '中' : '低'}优先级
                        </span>
                        <span className={`px-2 py-1 text-xs rounded font-medium ${getStatusColor(task.status)}`}>
                          {task.status === 'in_progress' ? '生产中' : task.status === 'pending' ? '等待中' : task.status}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedTask(task)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        查看详情
                      </button>
                    </div>

                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900 mb-1">{task.strategy.coreMessage}</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>目标账号: {task.targetAccount}</p>
                        <p>内容风格: {task.strategy.tone}</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-1">必须包含:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {task.strategy.requiredElements.map((element, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                            {element}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">创建时间: {task.createTime}</span>
                      <div className="flex space-x-2">
                        {task.status === 'pending' && (
                          <button className="btn btn-primary text-sm">
                            <PlayIcon className="h-4 w-4 mr-2" />
                            开始生产
                          </button>
                        )}
                        {task.status === 'in_progress' && (
                          <button className="btn btn-outline text-sm">
                            <StopIcon className="h-4 w-4 mr-2" />
                            暂停
                          </button>
                        )}
                        <button className="btn btn-secondary text-sm">编辑</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 内容包管理 */}
          {activeTab === 'production' && (
            <div className="card">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">内容包</h3>
                <button className="btn btn-primary text-sm">
                  导出内容包
                </button>
              </div>

              <div className="space-y-4">
                {mockContentPackages.map((pkg) => (
                  <div key={pkg.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        {getContentTypeIcon(pkg.contentType)}
                        <span className={`px-2 py-1 text-xs rounded font-medium ${getStatusColor(pkg.status)}`}>
                          {getStatusLabel(pkg.status)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {pkg.contentType === 'video' && pkg.metadata.duration &&
                          `时长: ${Math.floor(pkg.metadata.duration / 60)}:${(pkg.metadata.duration % 60).toString().padStart(2, '0')}`
                        }
                      </span>
                    </div>

                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900 mb-1">{pkg.metadata.title}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{pkg.metadata.description}</p>
                    </div>

                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {pkg.metadata.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        {pkg.assets.videoFile && '视频 ✅ '}
                        {pkg.assets.coverImage && '封面 ✅ '}
                        {pkg.assets.srtFile && '字幕 ✅ '}
                      </div>
                      <div className="flex space-x-2">
                        <button className="btn btn-secondary text-sm">预览</button>
                        <button className="btn btn-primary text-sm">发布</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 素材库 */}
          {activeTab === 'library' && (
            <div className="card">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">素材库</h3>
                <div className="flex space-x-2">
                  <button className="btn btn-outline text-sm">上传素材</button>
                  <button className="btn btn-outline text-sm">AI生成</button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* 模拟素材项 */}
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 cursor-pointer">
                    <div className="aspect-video bg-gray-200 flex items-center justify-center">
                      <PhotoIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-gray-900 truncate">素材文件 {item}</p>
                      <p className="text-xs text-gray-500">2024-01-{15 + item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 右侧面板 */}
        <div className="space-y-6">
          {/* 任务详情 */}
          {selectedTask && (
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">任务详情</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">{selectedTask.strategy.coreMessage}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">任务ID:</span>
                      <span className="font-mono text-xs">{selectedTask.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">目标账号:</span>
                      <span>{selectedTask.targetAccount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">切入角度:</span>
                      <span>{selectedTask.strategy.angleType}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-700 mb-2">生产进度</h5>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>文案生成</span>
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>图片生成</span>
                      {selectedTask.status === 'in_progress' ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                          <span className="text-blue-600">进行中</span>
                        </div>
                      ) : (
                        <ExclamationCircleIcon className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>视频合成</span>
                      <ExclamationCircleIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">
                    预计完成时间: 10-15分钟
                  </div>
                  <button className="btn btn-primary w-full text-sm">
                    查看生产日志
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 生产统计 */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">今日生产统计</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">完成任务</span>
                <span className="text-sm font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">生产中</span>
                <span className="text-sm font-medium text-blue-600">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">等待队列</span>
                <span className="text-sm font-medium text-gray-600">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">成功率</span>
                <span className="text-sm font-medium text-green-600">96%</span>
              </div>
            </div>
          </div>

          {/* AI模型状态 */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">AI模型状态</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">文案生成 (GPT-4)</span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm text-green-600">正常</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">图片生成 (DALL-E)</span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm text-green-600">正常</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">语音合成 (Azure)</span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm text-green-600">正常</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">视频处理 (FFmpeg)</span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  <span className="text-sm text-yellow-600">高负载</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;