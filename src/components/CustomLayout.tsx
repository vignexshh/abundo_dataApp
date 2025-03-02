"use client";
import React, { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import { Layout, Menu, Button } from 'antd';
import type { MenuProps } from 'antd';
import type { ReactNode } from 'react';

const { Header, Sider, Content } = Layout;

const items: MenuProps['items'] = [
  {
    key: '1',
    icon: <UserOutlined />,
    label: 'User',
  },
  {
    key: '2',
    icon: <LaptopOutlined />,
    label: 'Laptop',
  },
  {
    key: '3',
    icon: <NotificationOutlined />,
    label: 'Notification',
  },
];

interface CustomLayoutProps {
  children: ReactNode;
}

const CustomLayout: React.FC<CustomLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <Header style={{ padding: 0, background: '#ffffff', display: 'flex', alignItems: 'center' }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ color: '#fff', marginLeft: 16 }}
        />
        <div style={{ flex: 1, textAlign: 'left', color: '#000000', fontSize: 18 }}>MedicalHunt</div>
      </Header>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            items={items}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: '#fff',
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default CustomLayout;