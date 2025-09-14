export type DeliveryDetails = {
  _id: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  isOverweight: boolean;
}

export type DeliveryItem = {
  _id: string;
  code: string;
  fullCode: string;
  subCode: string;
  sender: string;
  receiver: string;
  fromRoute: string;
  toRoute: string;
  name: string;
  quantity: number;
  cost: number;
  homeDelivery: string;
  homeDeliveryCost: number;
  itemValue: number;
  itemCost: number;
  collectCost: number;
  collectForCustomer: number;
  collectForCustomerCost: number;
  totalCost: number;
  collectForCustomerNote: string;
  details: DeliveryDetails;
  notes: string;
  paymentType: 'paid' | 'debt'; // nếu có thể có thêm loại thì mở rộng union
  createdByUser: string;
  createdAt: string; // hoặc Date nếu bạn parse về Date
  updatedAt: string;
  scannedAt: string;
  __v: number;
}

export type DeliveryResponse = {
  data: DeliveryItem[];
}
