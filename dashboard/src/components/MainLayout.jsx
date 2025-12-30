import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, logoutUser } from '../redux/slice/userSlice'; // adjust path
import { useNavigate } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, message } from 'antd';
import { Link } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

const MainLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userInfo = useSelector((state) => state.user.userInfo);
  console.log(userInfo,"userInfo");
  

  

  const handleLogout = () => {
    dispatch(logoutUser());
    message.success('Logged out successfully');
    navigate('/');
  };

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <Menu theme="light" mode="horizontal" defaultSelectedKeys={['1']} style={{ flex: 1, minWidth: 0 }} items={[
          {
            key: 'welcome',
            label: `Welcome to NIHFW Dashboard ${userInfo?.name || ''}`
          }
        ]} />
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {token ? (
            <li>
              <button
                onClick={handleLogout}
                className="nav-link btn btn-link text-white"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                Logout
              </button>
            </li>
          ) : (
            <li>
              <Link to="/">Login</Link>
            </li>
          )}
        </ul>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu mode="inline" defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} style={{ height: '100%', borderRight: 0 }} items={[
            {
              key: 'category',
              label: 'Category',
              children: [
                { key: 'getCategory', label: <Link to="/getcategoryblog">Get Category</Link> }
              ]
            },
            {
              key: 'blog',
              label: 'Blog',
              children: [
                { key: 'getBlog', label: <Link to="/getblog">Get Blog</Link> }
              ]
            },
            {
              key: 'user',
              label: 'User',
              children: [
                { key: 'getUser', label: <Link to="/user">User</Link> }
              ]
            }
          ]} />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }} />
          <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
