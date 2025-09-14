import type {Metadata} from "next";
import React from "react";
import LoadPageContainer from "docker-manager-web/app/stock/load/LoadPageContainer";

export const metadata: Metadata = {
  title: 'Danh sách đã lên hàng | Gia Phước Express',
  description: 'Danh sách đã lên hàng',
}

function StockLoadPage() {
  return (
    <div className={'w-full h-full px-5'}>
      <LoadPageContainer  />
    </div>
  )
}

export default StockLoadPage;