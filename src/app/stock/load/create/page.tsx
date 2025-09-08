import React from 'react'
import type {Metadata} from "next";
import CreateStockContainer from "docker-manager-web/app/stock/load/create/CreateStockContainer";

export const metadata: Metadata = {
  title: 'Tạo lên hàng | Gia Phước Express',
  description: 'Tạo lên hàng'
}

function CreateStockLoadPage() {
  return (
    <div className={'w-full h-full px-5'}>
      <CreateStockContainer />
    </div>
  )
}

export default CreateStockLoadPage;