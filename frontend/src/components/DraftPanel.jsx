import { useState, useEffect } from 'react';
import axios from 'axios';
import { CopyOutlined, EditOutlined, CheckCircleOutlined, CloseOutlined, SaveOutlined, SendOutlined } from '@ant-design/icons';

const DraftPanel = () => {
    const [drafts, setDrafts] = useState([]);

    // === 新增状态：控制弹窗和编辑 ===
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDraft, setCurrentDraft] = useState(null); // 当前正在编辑的草稿对象
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [accounts, setAccounts] = useState([]); // 新增：账号列表

    const fetchDrafts = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/content/list');
            setDrafts(res.data);
        } catch (error) {
            console.error("获取草稿失败", error);
        }
    };

    const fetchAccounts = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/accounts/list');
            setAccounts(res.data);
        } catch (error) {
            console.error("获取账号列表失败");
        }
    };

    useEffect(() => {
        fetchDrafts();
        fetchAccounts();
    }, []);

    // ... (中间代码不变) ...

    // === 新增：发布流程 ===
    const handlePublish = async (draft, e) => {
        e.stopPropagation(); // 阻止冒泡触发双击编辑

        // 简单处理：默认选取第一个有效的小红书账号
        const validAccount = accounts.find(a => a.platform === 'xhs' && a.status === 'active');
        if (!validAccount) {
            alert("❌ 未找到可用的账号，请先去 [账号与分发] 页面绑定！");
            return;
        }

        if (!window.confirm(`确定要使用账号 [${validAccount.account_name}] 发布这篇笔记吗？`)) return;

        try {
            alert("🚀 正在调用浏览器自动发布，请观察后端控制台或弹出的浏览器窗口...");
            await axios.post(`http://localhost:8000/api/v1/publish/now?draft_id=${draft.id}&account_id=${validAccount.id}`);
            alert("✅ 发布成功！");
            fetchDrafts();
        } catch (error) {
            console.error(error);
            alert("❌ 发布失败: " + (error.response?.data?.detail || "未知错误"));
        }
    };

    // ... (rest of code) ...
    // 在渲染部分修改 footerStyle 内容

    // ...
    //   <div style={footerStyle}>
    //      <div>
    //         {d.status === 'published' ? (
    //             <span style={{ color: '#1677ff', fontWeight: 'bold' }}>🚀 已发布</span>
    //         ) : (
    //             <span style={{ color: '#52c41a' }}><CheckCircleOutlined /> 已生成</span>
    //         )}
    //      </div>
    //      <div>
    //          <button 
    //              style={{...actionBtnStyle, color: d.status === 'published' ? '#ccc' : '#fa8c16'}} 
    //              title="一键发布" 
    //              disabled={d.status === 'published'}
    //              onClick={(e) => handlePublish(d, e)}>
    //              <SendOutlined /> 发布
    //          </button>
    //          <button style={actionBtnStyle} title="编辑" onClick={() => openEditModal(d)}><EditOutlined /></button>
    //      </div>
    //   </div>


    // === 打开编辑弹窗 ===
    const openEditModal = (draft) => {
        setCurrentDraft(draft);
        setEditTitle(draft.title);
        setEditContent(draft.content);
        setIsModalOpen(true);
    };

    // === 关闭弹窗 ===
    const closeEditModal = () => {
        setIsModalOpen(false);
        setCurrentDraft(null);
    };

    // === 保存修改 ===
    const handleSave = async () => {
        if (!currentDraft) return;
        try {
            await axios.put(`http://localhost:8000/api/v1/content/update/${currentDraft.id}`, {
                title: editTitle,
                content: editContent
            });
            alert("✅ 保存成功！");
            setIsModalOpen(false);
            fetchDrafts(); // 刷新列表显示最新内容
        } catch (error) {
            console.error(error);
            alert("保存失败，请检查后端");
        }
    };

    return (
        <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>📝 AI 草稿箱 (双击卡片可编辑)</h2>
                <button onClick={fetchDrafts} style={{ cursor: 'pointer', padding: '5px 15px' }}>🔄 刷新</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {drafts.length === 0 ? (
                    <p style={{ color: '#999' }}>暂无草稿，请去"热点池"生成几篇吧！</p>
                ) : (
                    drafts.map((d) => (
                        <div
                            key={d.id}
                            style={cardStyle}
                            onDoubleClick={() => openEditModal(d)} // 👈 绑定双击事件
                            title="双击查看详情/编辑"
                        >
                            <div style={headerStyle}>
                                <span className={`badge xhs`} style={{ background: '#ff2442', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>小红书</span>
                                <span style={{ fontSize: '12px', color: '#999' }}>{new Date(d.created_at).toLocaleDateString()}</span>
                            </div>

                            <h3 style={{ margin: '10px 0', fontSize: '16px' }}>{d.title}</h3>

                            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6', height: '80px', overflow: 'hidden' }}>
                                {d.content.slice(0, 100)}...
                            </p>

                            <div style={footerStyle}>
                                <div>
                                    {d.status === 'published' ? (
                                        <span style={{ color: '#1677ff', fontWeight: 'bold' }}>🚀 已发布</span>
                                    ) : (
                                        <span style={{ color: '#52c41a' }}><CheckCircleOutlined /> 已生成</span>
                                    )}
                                </div>
                                <div>
                                    <button
                                        style={{ ...actionBtnStyle, color: d.status === 'published' ? '#ccc' : '#fa8c16' }}
                                        title="一键发布"
                                        disabled={d.status === 'published'}
                                        onClick={(e) => handlePublish(d, e)}>
                                        <SendOutlined /> 发布
                                    </button>
                                    <button style={actionBtnStyle} title="编辑" onClick={() => openEditModal(d)}><EditOutlined /></button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* === 编辑弹窗 (Modal) === */}
            {isModalOpen && (
                <div style={modalOverlayStyle}>
                    <div style={modalContentStyle}>
                        <div style={modalHeaderStyle}>
                            <h3>✏️ 编辑草稿</h3>
                            <button onClick={closeEditModal} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}><CloseOutlined /></button>
                        </div>

                        <div style={modalBodyStyle}>
                            <label style={labelStyle}>标题</label>
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                style={inputStyle}
                            />

                            <label style={labelStyle}>正文内容</label>
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                style={textareaStyle}
                            />
                        </div>

                        <div style={modalFooterStyle}>
                            <button onClick={closeEditModal} style={cancelBtnStyle}>取消</button>
                            <button onClick={handleSave} style={saveBtnStyle}><SaveOutlined /> 保存修改</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// === 样式定义 ===
const cardStyle = {
    border: '1px solid #f0f0f0', borderRadius: '8px', padding: '15px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column',
    height: '220px', background: '#fafafa', cursor: 'pointer', transition: 'all 0.2s'
};
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' };
const footerStyle = { marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const actionBtnStyle = { border: 'none', background: 'transparent', cursor: 'pointer', marginLeft: '10px', fontSize: '16px', color: '#1677ff' };

// 弹窗相关样式
const modalOverlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
};
const modalContentStyle = {
    background: 'white', padding: '20px', borderRadius: '8px', width: '600px', maxWidth: '90%',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', maxHeight: '90vh'
};
const modalHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' };
const modalBodyStyle = { display: 'flex', flexDirection: 'column', gap: '15px', flex: 1, overflowY: 'auto' };
const modalFooterStyle = { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '10px', borderTop: '1px solid #eee' };

const labelStyle = { fontWeight: 'bold', fontSize: '14px', color: '#333' };
const inputStyle = { padding: '8px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '16px' };
const textareaStyle = { padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '14px', minHeight: '300px', fontFamily: 'inherit', lineHeight: '1.6', resize: 'vertical' };

const saveBtnStyle = { padding: '8px 20px', background: '#1677ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' };
const cancelBtnStyle = { padding: '8px 20px', background: '#f5f5f5', color: '#333', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' };

export default DraftPanel;