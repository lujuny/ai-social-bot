import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserAddOutlined, QrcodeOutlined, CheckCircleOutlined, SyncOutlined, DeleteOutlined } from '@ant-design/icons';

const DistributorPanel = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [binding, setBinding] = useState(false);

    const fetchAccounts = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:8000/api/v1/accounts/list');
            setAccounts(res.data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleBind = async (platform) => {
        setBinding(true);
        alert("即将启动浏览器，通过扫码登录。请在弹出的浏览器中完成操作。");
        try {
            await axios.post(`http://localhost:8000/api/v1/accounts/bind/${platform}`);
            alert("✅ 绑定成功！");
            fetchAccounts();
        } catch (error) {
            console.error(error);
            alert("绑定失败或超时");
        }
        setBinding(false);
    };

    const handleUnbind = async (id, name) => {
        if (!window.confirm(`确认要解绑账号 [${name}] 吗？`)) return;
        try {
            await axios.delete(`http://localhost:8000/api/v1/accounts/${id}`);
            alert("✅ 解绑成功！");
            fetchAccounts();
        } catch (error) {
            console.error(error);
            alert("解绑失败");
        }
    };

    return (
        <div style={{ padding: '20px', background: '#fff', borderRadius: '8px', border: '1px solid #eee' }}>
            <h2>📢 多平台账号管理</h2>

            <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '8px', margin: '20px 0' }}>
                <h3>添加新账号</h3>
                <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
                    <button
                        onClick={() => handleBind('xhs')}
                        disabled={binding}
                        style={bindBtnStyle('#ff2442')}
                    >
                        {binding ? <SyncOutlined spin /> : <QrcodeOutlined />}
                        绑定小红书账号
                    </button>

                    <button
                        onClick={() => alert("暂未支持微博")}
                        disabled={binding}
                        style={bindBtnStyle('#E6162D', true)}
                    >
                        <UserAddOutlined /> 绑定微博账号 (开发中)
                    </button>
                </div>
            </div>

            <h3>已绑定账号</h3>
            <div style={{ marginTop: '15px' }}>
                {loading ? <p>加载中...</p> : (
                    accounts.length === 0 ? <p style={{ color: '#999' }}>暂无绑定账号</p> : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#fafafa', textAlign: 'left' }}>
                                    <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>ID</th>
                                    <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>平台</th>
                                    <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>账号标识</th>
                                    <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>状态</th>
                                    <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>最后检查</th>
                                    <th style={{ padding: '10px', borderBottom: '1px solid #eee' }}>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts.map(acc => (
                                    <tr key={acc.id}>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{acc.id}</td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                            {acc.platform === 'xhs' ? '小红书' : acc.platform}
                                        </td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{acc.account_name}</td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                            <span style={{ color: '#52c41a' }}><CheckCircleOutlined /> {acc.status}</span>
                                        </td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                            {new Date(acc.last_checked_at).toLocaleString()}
                                        </td>
                                        <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                                            <button
                                                onClick={() => handleUnbind(acc.id, acc.account_name)}
                                                style={{ border: 'none', background: 'none', color: '#ff4d4f', cursor: 'pointer' }}
                                                title="解绑/删除"
                                            >
                                                <DeleteOutlined /> 解绑
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                )}
            </div>
        </div>
    );
};

const bindBtnStyle = (color, disabled = false) => ({
    padding: '10px 20px',
    background: disabled ? '#ccc' : color,
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '15px'
});

export default DistributorPanel;
