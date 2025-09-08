'use client';
import {JSX, useEffect, useState} from "react";
import {Button, Col, Input, Row, Select, SelectProps} from "antd";
import LabeledField from "docker-manager-web/components/LabeledField/LabeledField";
import {loadDrivers} from "docker-manager-web/service/driver";
import {loadVehicles} from "docker-manager-web/service/vehicle";
import {Vehicle} from "docker-manager-web/type/vehicle";

type DriverBoxOptions = {
  value: string;
  label: string;
}

type VehicleBoxOptions = DriverBoxOptions

function CreateStockContainer(): JSX.Element {
  const [drivers, setDrivers] = useState<DriverBoxOptions[]>([]);
  const [vehicles, setVehicles] = useState<VehicleBoxOptions[]>([]);

  useEffect(() => {
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
  }, []);

  return (
    <div className={'my-5'}>
      <Row justify={'start'} gutter={[24, 24]} className={'items-center flex'}>
        <Col xs={2}>
          <LabeledField label={'Mã chuyến xe'}>
            <Input value={'abc'} disabled/>
          </LabeledField>
        </Col>
        <Col xs={4}>
          <LabeledField label={'Tên tài xế'}>
            <Select
              style={{width:'100%'}}
              placeholder={'Tài xế'}
              options={drivers}
            />
          </LabeledField>
        </Col>
        <Col xs={4}>
          <LabeledField label={'Biển số xe'}>
            <Select
              style={{width:'100%'}}
              placeholder={'Biển số xe'}
              options={vehicles}
            />
          </LabeledField>
        </Col>
        <Col xs={4}>
          <Button type="primary" className={'w-full h-full'}>
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
    </div>
  )
}

export default CreateStockContainer;