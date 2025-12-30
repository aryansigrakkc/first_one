import React, { useEffect } from 'react'
import { Button, Checkbox, Form, Input } from 'antd'
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/slice/userSlice';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const dispatch = useDispatch();
  const getData = useSelector((state) => state.user);
  console.log(getData,"getdatat");
  
  const navigate = useNavigate();

  const onFinish = (values) => {
    dispatch(loginUser(values));
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

useEffect(() => {
  const status = getData?.data?.status;
  const token = getData?.data?.data?.token;
  const role = getData?.data?.data?.role;
  console.log(role, "role");

  if (status === true && token) {
    if (role === "admin") {
      localStorage.setItem('token', token); // token sirf admin ke liye store
      toast.success("Login successful!");
      setTimeout(() => {
        navigate('/dashboard');  
      }, 100);
    } else {
      toast.error("You are not authorized to access the admin dashboard!");
      // yaha navigate nahi karenge
    }
  } else if (status === false) {
    toast.error("Login failed!");
  }
}, [getData, navigate]);

  return (
    <>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" label={null}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>

      <ToastContainer />
    </>
  );
};

export default Login;
