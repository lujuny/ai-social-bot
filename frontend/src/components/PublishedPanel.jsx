import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons';

const PublishedPanel = () => {
    const [publishedList, setPublishedList] = useState([]);

    const fetchPublished = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/content/published');
            setPublishedList(res.data);
        } catch (error) {
            console.error("获取已发布列表失败", error);
        }
    };

    useEffect(() => {
        fetchPublished();
    }, []);

    return (
        <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>🏆 已发布作品库 ({publishedList.length})</h2>
                <button onClick={fetchPublished} style={{ cursor: 'pointer', padding: '5px 15px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <ReloadOutlined /> 刷新
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {publishedList.length === 0 ? (
                    <p style={{ color: '#999' }}>暂无已发布的作品。</p>
                ) : (
                    publishedList.map((d) => (
                        <div key={d.id} style={cardStyle} title="已发布的内容无法编辑">
                            <div style={headerStyle}>
                                <span className={`badge xhs`} style={{ background: '#ff2442', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>小红书</span>
                                <span style={{ fontSize: '12px', color: '#999' }}>{new Date(d.updated_at || d.created_at).toLocaleDateString()}</span>
                            </div>

                            <h3 style={{ margin: '10px 0', fontSize: '16px' }}>{d.title}</h3>

                            <div style={{ marginBottom: '10px' }}>
                                {d.images && JSON.parse(d.images).length > 0 && (
                                    <span style={{ fontSize: '12px', background: '#f0f0f0', padding: '2px 6px', borderRadius: '4px', color: '#666' }}>
                                        🖼️ {JSON.parse(d.images).length} 张图片
                                    </span>
                                )}
                            </div>

                            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', height: '60px', overflow: 'hidden' }}>
                                {d.content.slice(0, 80)}...
                            </p>

                            <div style={footerStyle}>
                                <span style={{ color: '#1677ff', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <CheckCircleOutlined /> 发布成功
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// === 样式定义 (复用风格) ===
const cardStyle = {
    border: '1px solid #e6f7ff', borderRadius: '8px', padding: '15px',
    boxShadow: '0 2px 8px rgba(22, 119, 255, 0.1)', display: 'flex', flexDirection: 'column',
    height: '220px', background: '#f0f5ff', transition: 'all 0.2s'
};
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' };
const footerStyle = { marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #d6e4ff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' };

export default PublishedPanel;
