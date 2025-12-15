// frontend/src/App.jsx
import { useState } from 'react';
import TrendPanel from './components/TrendPanel';
import DraftPanel from './components/DraftPanel';
import { FireOutlined, FileTextOutlined } from '@ant-design/icons';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('trends'); // 'trends' or 'drafts'

  return (
    <div className="app-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>🤖 AI Social Bot 控制台</h1>
      
      {/* 顶部导航栏 (Tabs) */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', gap: '20px' }}>
        <div 
            onClick={() => setActiveTab('trends')}
            style={activeTab === 'trends' ? activeTabStyle : tabStyle}
        >
            <FireOutlined /> 热点抓取 (Hunter)
        </div>
        <div 
            onClick={() => setActiveTab('drafts')}
            style={activeTab === 'drafts' ? activeTabStyle : tabStyle}
        >
            <FileTextOutlined /> 内容草稿 (Factory)
        </div>
      </div>

      {/* 内容区域：根据当前 Tab 显示不同组件 */}
      <div className="content-area">
        {activeTab === 'trends' ? <TrendPanel /> : <DraftPanel />}
      </div>
      
    </div>
  );
}

// 样式对象
const tabStyle = {
    padding: '12px 30px',
    cursor: 'pointer',
    borderRadius: '8px',
    background: '#f5f5f5',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
    transition: 'all 0.3s'
};

const activeTabStyle = {
    ...tabStyle,
    background: '#1677ff',
    color: 'white',
    fontWeight: 'bold',
    boxShadow: '0 4px 10px rgba(22, 119, 255, 0.3)'
};

export default App;