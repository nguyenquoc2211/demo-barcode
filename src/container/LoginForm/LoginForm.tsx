'use client';

import React from 'react';
import { Form, Input, Button, message } from 'antd';
import Image from "next/image";
import {useDispatch, useSelector} from "react-redux";
import {getUserProfile, loginUser} from "docker-manager-web/store/userSlice";
import {AppDispatch, RootState} from "docker-manager-web/store";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const router = useRouter();
  const loginLoading = useSelector((state: RootState) => state.user.loginLoading);
  const dispatch = useDispatch<AppDispatch>();

  const onFinish = async (values: any) => {
    const username = values.username as string;
    const password = values.password as string;

    const result = await dispatch(loginUser({ username, password }));

    if (loginUser.fulfilled.match(result)) {
      // Login success
      message.success(`Đăng nhập thành công`)
      localStorage.setItem('accessToken', result.payload.accessToken);
      localStorage.setItem('refreshToken', result.payload.refreshToken);
      dispatch(getUserProfile()).then(() => {
        router.push('/stock/load')
      })
    } else {
      // Login failed
      message.error(`😢 Đăng nhập thất bại`)
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto' }}>
      <div className="mb-6">
        <Image
          src="/tc-logo.png"
          alt="Logo"
          width={400}
          height={150}
          className="w-full h-auto object-contain"
        />

      </div>
      <Form name="login" onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input placeholder="Enter username" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loginLoading}>
            Log In
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
