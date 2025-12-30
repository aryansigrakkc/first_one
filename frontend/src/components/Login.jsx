import React, { useEffect } from 'react';
import { Form, Input, Button, Checkbox, Card } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slice/userSlice';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css'; // optional styling

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data } = useSelector((state) => state.user);
  console.log(data,"sdffsdfsdfdsdsd");
  

  const onFinish = (values) => {
    dispatch(loginUser(values));
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    toast.error('Form submission failed!');
  };

  useEffect(() => {
    const status = data?.status;
    const token = data?.data?.token;
    const role = data?.data?.role;
    console.log(role,"role")

    if (status && token) {
      if (role === 'user') {
        localStorage.setItem('token', token);
        toast.success('Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/homepage');
        }, 1000);
      } else {
        toast.error('Only users can login here!');
      }
    } else if (status === false) {
      toast.error(data?.message || 'Login failed!');
    }
  }, [data, navigate]);

  return (
    <div className="login-wrapper">
      <Card title="Login" className="login-card">
        <Form
          name="loginForm"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Enter a valid email!' },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default Login;
