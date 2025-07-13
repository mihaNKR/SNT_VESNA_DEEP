import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Alert, Button, Card, Form, Input, Typography, Divider } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import './AuthPage.scss';

const { Title, Text } = Typography;

export default function AuthPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authType, setAuthType] = useState(
    location.pathname.includes('register') ? 'register' : 'login'
  );

  const handleSubmit = async (values) => {
    try {
      setError('');
      setLoading(true);

      if (authType === 'login') {
        await login(values.email, values.password);
      } else {
        await register(values.email, values.password, values.name);
      }

      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (err) {
      console.error('Auth error:', err);
      setError(
        err.response?.data?.message || 
        'Не удалось выполнить вход. Проверьте данные и попробуйте снова'
      );
    } finally {
      setLoading(false);
    }
  };

  const switchAuthType = () => {
    setAuthType(authType === 'login' ? 'register' : 'login');
    form.resetFields();
    setError('');
  };

  return (
    <div className="auth-page-container">
      <Card className="auth-card">
        <div className="auth-header">
          <Title level={3} className="auth-title">
            {authType === 'login' ? 'Вход в личный кабинет' : 'Регистрация'}
          </Title>
          <Text type="secondary">
            {authType === 'login' 
              ? 'Введите email и пароль для входа' 
              : 'Заполните форму для регистрации'}
          </Text>
        </div>

        {error && (
          <Alert
            message="Ошибка"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError('')}
            className="auth-alert"
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="auth-form"
        >
          {authType === 'register' && (
            <Form.Item
              name="name"
              label="ФИО"
              rules={[
                { required: true, message: 'Пожалуйста, введите ваше имя' },
                { min: 3, message: 'Имя должно содержать минимум 3 символа' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Иванов Иван Иванович"
                size="large"
              />
            </Form.Item>
          )}

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Пожалуйста, введите email' },
              { type: 'email', message: 'Введите корректный email' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="example@domain.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Пароль"
            rules={[
              { required: true, message: 'Пожалуйста, введите пароль' },
              { min: 6, message: 'Пароль должен содержать минимум 6 символов' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="••••••"
              size="large"
            />
          </Form.Item>

          {authType === 'register' && (
            <Form.Item
              name="confirmPassword"
              label="Подтвердите пароль"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Пожалуйста, подтвердите пароль' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Пароли не совпадают'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="••••••"
                size="large"
              />
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              {authType === 'login' ? 'Войти' : 'Зарегистрироваться'}
            </Button>
          </Form.Item>
        </Form>

        <Divider plain>или</Divider>

        <div className="auth-footer">
          <Button type="link" onClick={switchAuthType}>
            {authType === 'login'
              ? 'Нет аккаунта? Зарегистрироваться'
              : 'Уже есть аккаунт? Войти'}
          </Button>

          {authType === 'login' && (
            <Link to="/forgot-password" className="forgot-password-link">
              Забыли пароль?
            </Link>
          )}
        </div>
      </Card>
    </div>
  );
}
