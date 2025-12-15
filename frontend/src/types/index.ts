// 平台账号类型
export interface PlatformAccount {
  id: string;
  platform: 'douyin' | 'xiaohongshu' | 'tiktok' | 'youtube' | 'x' | 'weibo';
  accountName: string;
  avatar?: string;
  status: 'connected' | 'disconnected' | 'error';
  authType: 'oauth' | 'cookie';
  lastActive?: string;
  group?: string;
}

// 人设配置
export interface PersonaConfig {
  id: string;
  name: string;
  targetAudience: string;
  tone: 'professional' | 'casual' | 'humorous' | 'serious';
  style: string;
  forbiddenWords: string[];
  systemPrompt: string;
}

// 知识库文档
export interface KnowledgeDocument {
  id: string;
  title: string;
  type: 'manual' | 'history' | 'reference';
  uploadTime: string;
  size: number;
  status: 'processing' | 'completed' | 'failed';
  chunks?: number;
}

// 热点话题
export interface TrendingTopic {
  id: string;
  platform: string;
  title: string;
  heat: number;
  category: string;
  keywords: string[];
  url?: string;
  publishTime: string;
  matched?: boolean;
  score?: number;
}

// 内容任务
export interface ContentTask {
  id: string;
  topicSource: string;
  targetAccount: string;
  strategy: {
    angleType: string;
    coreMessage: string;
    tone: string;
    requiredElements: string[];
  };
  priority: 'High' | 'Medium' | 'Low';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  createTime: string;
}

// 内容包
export interface ContentPackage {
  id: string;
  taskId: string;
  contentType: 'video' | 'image' | 'text';
  status: 'Ready_to_Publish' | 'processing' | 'completed';
  assets: {
    videoFile?: string;
    coverImage?: string;
    srtFile?: string;
    audioFile?: string;
  };
  metadata: {
    title: string;
    description: string;
    tags: string[];
    duration?: number;
  };
}

// 发布记录
export interface PublishRecord {
  id: string;
  taskId: string;
  platform: string;
  accountId: string;
  status: 'Success' | 'Failed' | 'Pending';
  publishTime: string;
  postResult: {
    platformPostId?: string;
    postUrl?: string;
    screenshotPath?: string;
  };
  metrics?: ContentMetrics;
}

// 内容数据指标
export interface ContentMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  ctr?: string;
  retentionRate?: string;
  engagement?: string;
  publishTime: string;
  fetchTime: string;
}

// 诊断报告
export interface DiagnosticReport {
  id: string;
  contentId: string;
  performanceScore: number;
  metrics: ContentMetrics;
  diagnosis: {
    status: string;
    issues: Array<{
      type: string;
      timestamp?: string;
      reason?: string;
      description: string;
    }>;
  };
  actionableInsight: string;
  reportTime: string;
}

// 优化规则
export interface OptimizationRule {
  id: string;
  type: 'script' | 'visual' | 'topic';
  name: string;
  description: string;
  promptTemplate: string;
  version: string;
  active: boolean;
  createTime: string;
  lastApplied?: string;
}

// 仪表盘数据
export interface DashboardData {
  totalAccounts: number;
  activeAccounts: number;
  todayPublished: number;
  avgEngagement: string;
  weeklyTrend: Array<{
    date: string;
    published: number;
    engagement: number;
    views: number;
  }>;
  topPerforming: Array<{
    contentId: string;
    title: string;
    platform: string;
    score: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'publish' | 'optimize' | 'error';
    message: string;
    time: string;
  }>;
}