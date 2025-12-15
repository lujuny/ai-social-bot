import { useState, useEffect } from 'react';
import axios from 'axios';
import { LeftOutlined, RightOutlined, SyncOutlined, CloudDownloadOutlined } from '@ant-design/icons'; // 如果你没装 antd 图标库，可以用文字代替，或者 npm install @ant-design/icons

const TrendPanel = () => {
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // 分页状态
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10); // 每页显示10条
    const [total, setTotal] = useState(0);

    // 获取列表 (带页码)
    const fetchTrends = async (pageNum = 1) => {
        try {
            // 注意：参数名要和后端对应 (page, size)
            const res = await axios.get(`http://localhost:8000/api/v1/trends/list?page=${pageNum}&size=${pageSize}`);
            
            // 后端现在返回的是 { items: [], total: 23, ... }
            setTrends(res.data.items);
            setTotal(res.data.total);
            setPage(pageNum); // 更新当前页码状态
        } catch (error) {
            console.error("获取失败", error);
        }
    };

    // 新增生成处理函数
    const handleGenerate = async (trendId) => {
        // 为了用户体验，先给个提示
        const btn = document.activeElement; 
        if(btn) { btn.innerText = "生成中..."; btn.disabled = true; }

        try {
            await axios.post(`http://localhost:8000/api/v1/content/generate?trend_id=${trendId}`);
            alert("✨ 写作完成！已存入草稿箱");
            // 刷新列表，状态会变成“✅ 已生成”
            fetchTrends(page); 
        } catch (error) {
            console.error(error);
            alert("生成失败，请检查后端日志");
            if(btn) { btn.innerText = "重试"; btn.disabled = false; }
        }
    };


    // 触发抓取
    const handleScrape = async () => {
        setLoading(true);
        try {
            await axios.post('http://localhost:8000/api/v1/trends/scrape');
            // 抓取完，重置回第1页看最新数据
            await fetchTrends(1); 
            alert("抓取完成！");
        } catch (error) {
            alert("抓取失败");
        }
        setLoading(false);
    };

    // 页面加载时读取第1页
    useEffect(() => {
        fetchTrends(1);
    }, []);

    // 计算总页数
    const totalPages = Math.ceil(total / pageSize);

    return (
        <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', background: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ margin: 0 }}>🔥 实时热点池</h2>
                    <span style={{ color: '#999', fontSize: '0.9em' }}>共找到 {total} 条热点数据</span>
                </div>
                <button 
                    onClick={handleScrape} 
                    disabled={loading}
                    style={{ 
                        padding: '10px 20px', 
                        backgroundColor: loading ? '#ccc' : '#1677ff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    {loading ? <SyncOutlined spin /> : <CloudDownloadOutlined />}
                    {loading ? '正在全网抓取...' : '立即抓取最新热点'}
                </button>
            </div>

            <table className="trend-table" style={{ width: '100%', marginBottom: '20px' }}>
                <thead>
                    <tr style={{ background: '#fafafa' }}>
                        <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>标题</th>
                        <th style={{ padding: '12px', width: '100px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>平台</th>
                        <th style={{ padding: '12px', width: '80px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>热度</th>
                        <th style={{ padding: '12px', width: '100px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>状态</th>
                    </tr>
                </thead>
                <tbody>
                    {trends.length === 0 ? (
                        <tr><td colSpan="4" style={{textAlign:'center', padding: '20px', color: '#999'}}>暂无数据</td></tr>
                    ) : (
                        trends.map((t) => (
                            <tr key={t.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <td style={{ padding: '12px' }}>
                                    <a href={t.url} target="_blank" rel="noreferrer" style={{ color: '#333', textDecoration: 'none' }}>
                                        {t.title}
                                    </a>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <span className={`badge ${t.platform.toLowerCase()}`} 
                                          style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: 'white', background: getPlatformColor(t.platform) }}>
                                        {t.platform}
                                    </span>
                                </td>
                                <td style={{ padding: '12px', textAlign: 'center', color: '#ff4d4f', fontWeight: 'bold' }}>{t.hot_score}</td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                    {t.is_used ? (
                                        <span style={{ color: '#52c41a', fontWeight: 'bold' }}>✅ 已生成</span>
                                    ) : (
                                        <button
                                            onClick={() => handleGenerate(t.id)}
                                            style={{
                                                padding: '4px 12px',
                                                border: '1px solid #1677ff',
                                                background: '#fff',
                                                color: '#1677ff',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '12px'
                                            }}
                                        >
                                            ✨ AI写作
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* 分页控制器 */}
            {total > 0 && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
                    <button 
                        disabled={page === 1}
                        onClick={() => fetchTrends(page - 1)}
                        style={paginationBtnStyle(page === 1)}
                    >
                        上一页
                    </button>
                    
                    <span style={{ fontSize: '14px' }}>
                        第 <strong>{page}</strong> / {totalPages} 页
                    </span>
                    
                    <button 
                        disabled={page >= totalPages}
                        onClick={() => fetchTrends(page + 1)}
                        style={paginationBtnStyle(page >= totalPages)}
                    >
                        下一页
                    </button>
                </div>
            )}
        </div>
    );
};

// 辅助函数：根据平台返回颜色
const getPlatformColor = (platform) => {
    const map = {
        'Weibo': '#E6162D',
        'Zhihu': '#0084FF',
        'Juejin': '#1E80FF',
        'Twitter': '#1DA1F2'
    };
    return map[platform] || '#333';
};

// 辅助样式：按钮样式
const paginationBtnStyle = (disabled) => ({
    padding: '6px 12px',
    border: '1px solid #d9d9d9',
    background: disabled ? '#f5f5f5' : 'white',
    color: disabled ? '#00000040' : '#000000d9',
    cursor: disabled ? 'not-allowed' : 'pointer',
    borderRadius: '4px',
    transition: 'all 0.3s'
});

export default TrendPanel;