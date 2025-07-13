import React from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { Button, Result, Typography, Space, Card } from 'antd';
import { HomeOutlined, ReloadOutlined, MailOutlined } from '@ant-design/icons';
import './ErrorPage.scss';

const { Text } = Typography;

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  
  // Определяем тип ошибки
  const getErrorContent = () => {
    console.error('Routing error:', error);
    
    switch(error?.status) {
      case 404:
        return {
          status: '404',
          title: 'Страница не найдена',
          subTitle: 'Запрошенная страница не существует или была перемещена',
        };
      case 403:
        return {
          status: '403',
          title: 'Доступ запрещен',
          subTitle: 'У вас недостаточно прав для просмотра этой страницы',
        };
      case 401:
        return {
          status: '401',
          title: 'Требуется авторизация',
          subTitle: 'Для доступа к этой странице необходимо войти в систему',
        };
      default:
        return {
          status: '500',
          title: 'Произошла ошибка',
          subTitle: 'Что-то пошло не так. Пожалуйста, попробуйте позже',
        };
    }
  };

  const { status, title, subTitle } = getErrorContent();

  return (
    <div className="error-page-container">
      <Card className="error-card">
        <Result
          status={status}
          title={title}
          subTitle={subTitle}
          extra={
            <Space direction="vertical" size="middle">
              <Button
                type="primary"
                icon={<HomeOutlined />}
                onClick={() => navigate('/')}
              >
                На главную
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => window.location.reload()}
              >
                Обновить страницу
              </Button>
              {error?.status === 401 && (
                <Button
                  icon={<MailOutlined />}
                  onClick={() => navigate('/login', { state: { from: location } })}
                >
                  Войти в систему
                </Button>
              )}
            </Space>
          }
        />
        
        {process.env.NODE_ENV === 'development' && (
          <div className="error-details">
            <Text type="secondary" className="error-message">
              {error?.message || error?.toString()}
            </Text>
            <Text code className="error-stack">
              {error?.stack}
            </Text>
          </div>
        )}
      </Card>
    </div>
  );
}
