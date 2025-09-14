'use client';
import {JSX, useEffect, useState} from "react";
import {Button, Col, Input, Row, Select, Table, Tabs} from "antd";
import LabeledField from "docker-manager-web/components/LabeledField/LabeledField";
import {loadDrivers} from "docker-manager-web/service/driver";
import {loadVehicles} from "docker-manager-web/service/vehicle";
import {getTripCode, loadShipmentInDay, putTrip} from "docker-manager-web/service/ship";
import {useSelector} from "react-redux";
import {RootState} from "docker-manager-web/store";
import {DeliveryItem} from "docker-manager-web/type/ship";
import {ColumnsType} from "antd/es/table";
import moment from "moment";
import InputBarcode from "docker-manager-web/components/InputBarcode/InputBarcode";
import lodash from "lodash";
import {speak} from "docker-manager-web/utils/tts";
import {ParcelInput, Trip, UpdateTripRequest} from "docker-manager-web/type/trip";
import {useRouter} from "next/navigation";

type DriverBoxOptions = {
  value: string;
  label: string;
}

type VehicleBoxOptions = DriverBoxOptions

function CreateStockContainer(): JSX.Element {
  const user = useSelector((state: RootState) => state.user)
  const [drivers, setDrivers] = useState<DriverBoxOptions[]>([]);
  const [vehicles, setVehicles] = useState<VehicleBoxOptions[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryItem[]>([]);
  const [scannedDeliveries, setScannedDeliveries] = useState<DeliveryItem[]>([]);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [driverName, setDriverName] = useState<string>('');
  const [vehiclePalette, setVehiclePalette] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    if (!user || !user.user) {
      return
    }

    loadDrivers().then((data) => {
      setDrivers(data.map(d => {
        return {
          label: d.name,
          value: d.name
        }
      }))
    })

    loadVehicles().then((data) => {
      setVehicles(data.map(d => {
        return {
          label: d.license_plate,
          value: d.license_plate
        }
      }))
    })

    loadShipmentInDay(user.user.route.id).then(data => {
      if (!data) { return }
      const shipmentData = data.data;
      setDeliveries(shipmentData);
    })

    getTripCode(user.user.route.id).then(data => {
      if (!data) { return }
      setTrip(data)
    })
  }, []);

  const onScanBarcode = (barcode: string) => {
    console.log(barcode);
    const shipmentIdx = deliveries.findIndex(d => d.subCode === barcode);

    if (shipmentIdx < 0) {
      // TODO: Implement "danh sách hàng đã quét nhưng không rõ"
      return
    }

    speak(deliveries[shipmentIdx].name)
    let scannedShipmentIdx = scannedDeliveries.findIndex(d => d.subCode === barcode);
    if (scannedShipmentIdx < 0) {
      let tmp = lodash.cloneDeep(deliveries[shipmentIdx]);
      tmp.quantity = 0;
      tmp.scannedAt = moment().format("YYYY-MM-DD HH:mm:ss");
      scannedDeliveries.push(tmp);
      scannedShipmentIdx = scannedDeliveries.length - 1;
    }

    console.log(scannedDeliveries);

    scannedDeliveries[scannedShipmentIdx].quantity++;
    deliveries[shipmentIdx].quantity--;


    if (deliveries[shipmentIdx].quantity === 0) {
      deliveries.splice(shipmentIdx, 1);
    }

    console.log('scannedDeliveries', deliveries);
    console.log(scannedDeliveries);
    setDeliveries([...deliveries]);
    setScannedDeliveries([...scannedDeliveries]);
  }

  const onDelete = (barcode: string) => {
    const scannedIdx = scannedDeliveries.findIndex(d => d.subCode === barcode);

    if (scannedIdx < 0) {
      // TODO: Implement "danh sách hàng đã quét nhưng không rõ"
      return
    }

    let deliveryIdx = deliveries.findIndex(d => d.subCode === barcode);
    if (deliveryIdx < 0) {
      let tmp = lodash.cloneDeep(scannedDeliveries[scannedIdx]);
      tmp.quantity = 0;
      deliveries.push(tmp);
      deliveryIdx = deliveries.length - 1;
    }

    console.log(scannedDeliveries);

    deliveries[deliveryIdx].quantity++;
    scannedDeliveries[scannedIdx].quantity--;


    if (scannedDeliveries[scannedIdx].quantity === 0) {
      scannedDeliveries.splice(scannedIdx, 1);
    }

    setDeliveries([...deliveries]);
    setScannedDeliveries([...scannedDeliveries]);
  }

  const saveTrip = () => {
    if (!trip) { return }
    const routeId = trip._id;
    let data: UpdateTripRequest = {
      driver_name: driverName,
      vehicle_plate: vehiclePalette,
      parcels:  scannedDeliveries.map((d) => {
        return {
          parcel_id: d._id,
          name: d.name,
          barcode: d.subCode,
          quantity: d.quantity,
          scanned_at: moment(d.scannedAt).unix(),
        }
      }),
    };
    putTrip(routeId, data).then(d => {
      if (!d) { return }
      router.push('/stock/load')
    })
  }


  return (
    <div className={'my-5'}>
      <Row justify={'start'} gutter={[24, 24]} className={'items-center flex'}>
        <Col xs={2}>
          <LabeledField label={'Mã chuyến xe'}>
            <Input value={trip?.tripCode ?? ''} disabled/>
          </LabeledField>
        </Col>
        <Col xs={4}>
          <LabeledField label={'Tên tài xế'}>
            <Select
              style={{width:'100%'}}
              placeholder={'Tài xế'}
              options={drivers}
              value={driverName}
              onChange={(v) => setDriverName(v)}
            />
          </LabeledField>
        </Col>
        <Col xs={4}>
          <LabeledField label={'Biển số xe'}>
            <Select
              style={{width:'100%'}}
              placeholder={'Biển số xe'}
              options={vehicles}
              value={vehiclePalette}
              onChange={(v) => setVehiclePalette(v)}
            />
          </LabeledField>
        </Col>
        <Col xs={4}>
          <Button
            type="primary"
            className={'w-full h-full'}
            onClick={() => { saveTrip() }}
          >
            <span className={'p-3'}>
              Chấp nhận điều xe
            </span>
          </Button>
        </Col>
        <Col xs={4}>
          <Button type="primary" className={'w-full'}>
            <span className={'p-3'}>
              Lên hàng
            </span>
          </Button>
        </Col>
        <Col xs={4}>
          <Button type="primary" className={'w-full'}>
            <span className={'p-3'}>
              Kiểm tra hàng sót
            </span>
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={24}>
          <InputBarcode onScan={onScanBarcode} />
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col xs={12} >
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: '1',
                label: 'Danh sách hàng gửi đi',
                children: <TableShipment data={deliveries} />
              }
            ]}
          />
        </Col>
        {/*Scan barcode*/}
        <Col xs={12} >
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: '1',
                label: 'Danh sách hàng đã quét',
                children: <TableShipmentScanned data={scannedDeliveries} onDelete={onDelete}/>
              }
            ]}
          />
        </Col>
      </Row>
    </div>
  )
}

type TableShipmentType = {
  data: DeliveryItem[];
}

function TableShipment(props: TableShipmentType) {
  const columns: ColumnsType<DeliveryItem> = [
    {
      title: 'Số mã vạch',
      dataIndex: 'subCode',
      key: 'subcode'
    },
    {
      title: 'Mã tiếp nhận',
      dataIndex: 'fullCode',
      key: 'fullCode'
    },
    {
      title: 'Ngày tiếp nhận',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => moment(value).format('DD-MM-YYYY')
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
    }
  ];
  return (
    <Table
      rowKey="_id"
      columns={columns}
      dataSource={props.data}
      pagination={false}
    />
  )
}

type TableShipmentScannedProps = {
  data: DeliveryItem[];
  onDelete: (barcode: string) => void;
}

function TableShipmentScanned(props: TableShipmentScannedProps) {
  const { onDelete } = props;
  const columns: ColumnsType<DeliveryItem> = [
    { title: 'Số mã vạch', dataIndex: 'subCode', key: 'subCode' },
    { title: 'Mã tiếp nhận', dataIndex: 'fullCode', key: 'fullCode' },
    {
      title: 'Ngày tiếp nhận',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => moment(value).format('DD-MM-YYYY')
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
    { title: 'TG BẠN MÃ VẠCH', dataIndex: 'scannedAt', key: 'scannedAt' },
    {
      title: 'Xoá',
      key: 'action',
      render: (_, record) => (
        <Button
          danger
          size="small"
          onClick={() => {
            onDelete(record.subCode);
          }}
        >
          Xóa
        </Button>
      )
    }
  ];
  return (
    <Table
      rowKey="_id"
      columns={columns}
      dataSource={props.data}
      pagination={false}

    />
  )
}

export default CreateStockContainer;