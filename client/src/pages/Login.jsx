import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const { data } = await api.post('/auth/login', values);
      localStorage.setItem('token', data.token);
      message.success('Welcome back');
      navigate('/products');
    } catch {
      message.error('Invalid username or password');
    }
  };

  return (
    <Card title="Inventory Tracker — Sign in" style={{ maxWidth: 360, margin: '80px auto' }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="username" label="Username" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>Sign in</Button>
      </Form>
    </Card>
  );
}