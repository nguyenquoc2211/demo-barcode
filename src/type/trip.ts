export interface Trip {
  _id: string;
  tripCode: string;
  fromRoute: string;
  driverName: string;
  vehiclePlate: string;
  status: 'draft' | 'departed_from_hub';
  createdAt: string;
  updatedAt: string;
}

export interface ParcelInput {
  parcel_id: string;
  name: string;
  scanned_at: number; // unix timestamp
  barcode: string;
  quantity: number;
}

export interface UpdateTripRequest {
  driver_name: string;
  vehicle_plate: string;
  parcels: ParcelInput[];
}

export interface GetTripListResponse {
  data: Trip[];
  pagination: {
    total: number,
    page: number
    limit: number
  },
}

export interface Parcel {
  _id: string;
  parcelId: string;
  name: string;
  scannedAt: string;
  barcode: string;
  departureTime: Date;
  quantity: number;
  tripId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetParcelListResponse {
  data: Parcel[];
  pagination: {
    total: number,
    page: number,
    limit: number,
  }
}