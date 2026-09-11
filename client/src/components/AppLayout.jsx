import { Layout, Menu, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const { Header, Content } = Layout;

export default function AppLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={[
            { key: '/products', label: 'Products', onClick: () => navigate('/products') },
            { key: '/report', label: 'Report', onClick: () => navigate('/report') },
          ]}
          style={{ flex: 1 }}
        />
        <Button onClick={handleLogout}>Logout</Button>
      </Header>
      <Content style={{ padding: 24 }}>
        {children}
      </Content>
    </Layout>
  );
}