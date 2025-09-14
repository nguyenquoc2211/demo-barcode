'use client';
import {Row, Col, Typography, Table, Button, Space} from 'antd';
import React, {JSX, useEffect, useState} from "react";
import {ColumnsType} from "antd/es/table";
import {DeliveryItem} from "docker-manager-web/type/ship";
import moment from "moment/moment";
import {useSelector} from "react-redux";
import {RootState} from "docker-manager-web/store";
import {getParcelListByTripId, getTripList} from "docker-manager-web/service/ship";
import {GetParcelListResponse, GetTripListResponse, Parcel, Trip} from "docker-manager-web/type/trip";
import {useRouter} from "next/navigation";

const { Title } = Typography;

export default function LoadPageContainer(): JSX.Element {
  const user = useSelector((state: RootState) => state.user);
  const [loadingParcel, setLoadingParcel] = useState(false);
  const [tripData, setTripData] = useState<GetTripListResponse>();
  const [parcelData, setParcelData] = useState<GetParcelListResponse>();
  const router = useRouter();

  useEffect(() => {
    if (!user || !user.user) { return }

    getTripList(user.user.route.code).then(tripData => {
      if (!tripData) { return }
      setTripData(tripData);
    })
  }, []);

  const onRowClick = (row: Trip) => {
    setLoadingParcel(true);
    getParcelListByTripId(row._id).then(parcelData => {
      setLoadingParcel(false);
      if (!parcelData) { return }
      setParcelData(parcelData);
    })
  }

  return (
    <Row gutter={[24, 24]} className={"p-5"}>
      <Col xs={12}>
          <Title level={3}>Danh sách lên hàng trong ngày</Title>
      </Col>
      <Col xs={12} className="text-right flex items-center">
        <Button type={"primary"} onClick={() => {
          router.push('/stock/load/create')
        }}>
          Tạo lên hàng
        </Button>
      </Col>
      <Col xs={12}>
        <Row gutter={[12, 12]}>
          <Col xs={24}>
            <TableTrip data={tripData} onRowClick={onRowClick} />
          </Col>
        </Row>
      </Col>
      <Col xs={12}>
        <Row gutter={[12, 12]}>
          <Col xs={24}>
            <TableParcel data={parcelData} loading={loadingParcel}/>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

interface TableTripProps {
  data: GetTripListResponse | undefined;
  onRowClick: (record: Trip) => void;
}

function TableTrip(props: TableTripProps): JSX.Element {
  const { data, onRowClick } = props;
  const columns: ColumnsType<Trip> = [
    {
      title: 'Mã chuyến hàng',
      dataIndex: 'tripCode',
      key: 'tripCode'
    },
    {
      title: 'Tài xế',
      dataIndex: 'driverName',
      key: 'driver_name'
    },
    {
      title: 'Biển số xe',
      dataIndex: 'vehiclePlate',
      key: 'vehicle_plate'
    },
    {
      title: 'Ngày khởi hàng',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (value) => moment(value).format('DD-MM-YYYY HH:mm:ss'),
    },
  ];
  return (
    <Table
      rowKey="_id"
      onRow={(record, rowIndex) => {
        return {
          onClick: () => onRowClick(record),
        }
      }}
      columns={columns}
      dataSource={data?.data ?? []}
      pagination={false}
    />
  )
}

interface TableParcelProps {
  data: GetParcelListResponse | undefined;
  loading: boolean;
}

function TableParcel(props: TableParcelProps): JSX.Element {
  const { data, loading } = props;
  const columns: ColumnsType<Parcel> = [
    {
      title: 'Mã vạch',
      dataIndex: 'barcode',
      key: 'barcode'
    },
    {
      title: 'Tên hàng',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: 'Ngày quét',
      dataIndex: 'scannedAt',
      key: 'scannedAt',
      render: (value) => moment(value).format('DD-MM-YYYY HH:mm:ss'),
    },
  ];

  return (
    <Table
      rowKey="_id"
      columns={columns}
      dataSource={data?.data ?? []}
      pagination={false}
      loading={loading}
    />
  )
}