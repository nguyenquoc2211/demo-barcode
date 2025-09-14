'use client'
import React, {useEffect, useState} from 'react';
import '@ant-design/v5-patch-for-react-19';
import {useSelector} from "react-redux";
import {RootState} from "docker-manager-web/store";
import {Col, Row, Menu, Space, Dropdown, MenuProps, Avatar} from "antd";
import Image from "next/image";
import {useAppDispatch} from "docker-manager-web/store/hook";
import {getUserProfile} from "docker-manager-web/store/userSlice";
import {usePathname, useRouter} from "next/navigation";
import {removeAllTokens} from "docker-manager-web/service/token";
import {UserOutlined} from "@ant-design/icons";

const items = [
  {
    label: 'Lên hàng',
    key: 'load',
    children: [
      {
        label: 'Danh sách đã lên hàng',
        key: '/stock/load',
      },
      {
        label: 'Tạo chuyến xe mới',
        key: '/stock/load/create',
      },
    ],
  },
  {
    label: 'Xuống hàng',
    key: '/stock/unload',
  },
  {
    label: 'Kiểm kê hàng hoá',
    key: '/stock/audit',
  }
];

const dropDownItems: MenuProps['items'] = [
  {
    label: 'Logout',
    key: '0',
    onClick: () => {
      removeAllTokens()
      window.location.href = '/login';
    }
  }
];

export default function Header({ children }: { children: React.ReactNode }) {
  const userInfo = useSelector((state: RootState) => state.user);
  const user = userInfo.user
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()

  const [selectedMenu, setSelectedMenu] = useState('')

  useEffect(() => {
    dispatch(getUserProfile())
  }, []);

  useEffect(() => {
    setSelectedMenu(pathname)
  }, [pathname]);

  useEffect(() => {
    if (userInfo.error.length > 0) {
      router.push('/');
    }
  }, [userInfo.error]);

  if (!userInfo.user) {
    return (
      <React.Fragment key={userInfo.user}>
        {children}
      </React.Fragment>
    )
  }

  return (
    <div key={userInfo.user.username}>
      <Row justify={'center'} gutter={[24, 0]} className={"pt-2 header-border px-5"}>
        <Col xs={2}>
          <div className={'w-[80px] h-[40px] flex items-center cursor-pointer relative'}>
            <Image
              src="/img.svg"
              alt="Logo"
              fill
              className={"object-contain"}
            />
          </div>

        </Col>
        <Col xs={18}>
          <Menu
            onClick={({ key }) => {
              router.push(key);
            }}
            mode="horizontal"
            items={items}
            theme="light"
            selectedKeys={[selectedMenu]}
          />
        </Col>
        <Col xs={4}>
          <Row justify={'center'} gutter={[16, 16]}>
            <Col xs={12}>
              <div className={'p-1.5 border border-blue-400 text-center rounded-lg'}>
                <span className={'text-blue-600'}>{user?.route.name ?? ''}</span>
              </div>

            </Col>
            <Col xs={12}>
              <Dropdown menu={{ items: dropDownItems }}>
                <span
                  onClick={(e) => e.preventDefault()}
                >
                  <Space className={'p-1.5'}>
                    <Avatar
                      size="default"
                      src={'example'}
                      icon={<UserOutlined />}
                    />
                    {user?.username}
                  </Space>
                </span>
              </Dropdown>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col xs={24}>
          {children}
        </Col>
      </Row>
    </div>
  )
}