import React, { useState } from 'react';
import { PlusIcon, Cog6ToothIcon, KeyIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { PlatformAccount, PersonaConfig, KnowledgeDocument } from '../types';

// 模拟数据
const mockAccounts: PlatformAccount[] = [
  { id: '1', platform: 'douyin', accountName: '科技前沿君', avatar: '', status: 'connected', authType: 'cookie', group: '科技矩阵' },
  { id: '2', platform: 'xiaohongshu', accountName: 'AI工具测评', avatar: '', status: 'connected', authType: 'oauth', group: '科技矩阵' },
  { id: '3', platform: 'tiktok', accountName: 'TechDaily', avatar: '', status: 'disconnected', authType: 'oauth', group: '海外矩阵' },
];

const mockPersonas: PersonaConfig[] = [
  {
    id: '1',
    name: '科技专家',
    targetAudience: '科技爱好者、开发者',
    tone: 'professional',
    style: '专业、严谨，注重技术细节',
    forbiddenWords: ['骗人的', '垃圾'],
    systemPrompt: '你是一个资深的科技专家...'
  },
];

const mockDocuments: KnowledgeDocument[] = [
  { id: '1', title: 'AI产品手册2024.pdf', type: 'manual', uploadTime: '2024-01-15', size: 2048, status: 'completed', chunks: 45 },
  { id: '2', title: '历史爆款文案集.txt', type: 'history', uploadTime: '2024-01-14', size: 1024, status: 'processing' },
];

const Accounts: React.FC = () => {
  const [activeTab, setActiveTab] = useState('accounts');

  const platformIcons = {
    douyin: '🎵',
    xiaohongshu: '📕',
    tiktok: '🎵',
    youtube: '📺',
    x: '🐦',
    weibo: '🔴'
  };

  const statusColors = {
    connected: 'bg-green-100 text-green-800',
    disconnected: 'bg-gray-100 text-gray-800',
    error: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    connected: '已连接',
    disconnected: '未连接',
    error: '连接错误'
  };

  return (
    <div className="p-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">配置与账号中台</h1>
          <p className="text-gray-600">管理多平台账号、人设配置和知识库</p>
        </div>
        <button className="btn btn-primary">
          <PlusIcon className="h-4 w-4 mr-2" />
          添加新账号
        </button>
      </div>

      {/* 标签页导航 */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'accounts', name: '平台账号管理', icon: UserGroupIcon },
            { id: 'personas', name: '人设配置', icon: Cog6ToothIcon },
            { id: 'knowledge', name: '知识库管理', icon: KeyIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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

      {/* 标签页内容 */}
      <div className="min-h-[600px]">
        {/* 平台账号管理 */}
        {activeTab === 'accounts' && (
          <div>
            {/* 账号统计 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="card">
                <h3 className="text-sm font-medium text-gray-500">总账号数</h3>
                <p className="text-2xl font-bold text-gray-900">{mockAccounts.length}</p>
              </div>
              <div className="card">
                <h3 className="text-sm font-medium text-gray-500">活跃账号</h3>
                <p className="text-2xl font-bold text-green-600">
                  {mockAccounts.filter(acc => acc.status === 'connected').length}
                </p>
              </div>
              <div className="card">
                <h3 className="text-sm font-medium text-gray-500">账号分组</h3>
                <p className="text-2xl font-bold text-blue-600">2</p>
              </div>
            </div>

            {/* 账号列表 */}
            <div className="card">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">账号列表</h3>
                <div className="flex space-x-2">
                  <button className="btn btn-secondary text-sm">批量操作</button>
                  <button className="btn btn-secondary text-sm">导入账号</button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        账号信息
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        平台
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        状态
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        分组
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        最后活跃
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockAccounts.map((account) => (
                      <tr key={account.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                {platformIcons[account.platform]}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{account.accountName}</div>
                              <div className="text-sm text-gray-500">{account.authType}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{account.platform}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[account.status]}`}>
                            {statusLabels[account.status]}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {account.group}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {account.lastActive || '从未'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">编辑</button>
                          <button className="text-red-600 hover:text-red-900">删除</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 人设配置 */}
        {activeTab === 'personas' && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 人设列表 */}
              <div className="card">
                <div className="mb-4 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">人设模板</h3>
                  <button className="btn btn-primary text-sm">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    创建人设
                  </button>
                </div>

                <div className="space-y-4">
                  {mockPersonas.map((persona) => (
                    <div key={persona.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{persona.name}</h4>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Cog6ToothIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">目标受众: {persona.targetAudience}</p>
                      <p className="text-sm text-gray-600 mb-2">风格: {persona.style}</p>
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {persona.tone}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 人设编辑器 */}
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">编辑人设</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">人设名称</label>
                    <input type="text" className="input" placeholder="例：科技专家" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">目标受众</label>
                    <textarea className="input h-20" placeholder="描述你的目标受众..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">语言风格</label>
                    <select className="input">
                      <option>专业严谨</option>
                      <option>轻松幽默</option>
                      <option>亲切友好</option>
                      <option>严肃权威</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">System Prompt</label>
                    <textarea className="input h-32" placeholder="输入AI的系统提示词..." />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button className="btn btn-secondary">取消</button>
                    <button className="btn btn-primary">保存</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 知识库管理 */}
        {activeTab === 'knowledge' && (
          <div>
            <div className="card mb-6">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">知识库文档</h3>
                <button className="btn btn-primary">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  上传文档
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockDocuments.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm truncate">{doc.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {(doc.size / 1024).toFixed(1)} MB • {doc.chunks || 0} 个片段
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        doc.status === 'completed' ? 'bg-green-100 text-green-800' :
                        doc.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {doc.status === 'completed' ? '已完成' :
                         doc.status === 'processing' ? '处理中' : '失败'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>类型: {doc.type === 'manual' ? '手册' : doc.type === 'history' ? '历史' : '参考'}</span>
                      <span>{doc.uploadTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 向量数据库状态 */}
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">向量数据库状态</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">1,245</div>
                  <div className="text-sm text-gray-500">总向量数</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">45</div>
                  <div className="text-sm text-gray-500">文档片段</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">2.3GB</div>
                  <div className="text-sm text-gray-500">存储使用</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accounts;