import axiosClient from "docker-manager-web/utils/axios";
import {
  API_SHIPMENT_GET_TRIP_CODE,
  API_SHIPMENT_LIST,
  API_SHIPMENT_PUT,
  API_TRIP_LIST, API_TRIP_PARCEL_LIST
} from "docker-manager-web/constant/url";
import {DeliveryResponse} from "docker-manager-web/type/ship";
import {GetParcelListResponse, GetTripListResponse, Trip, UpdateTripRequest} from "docker-manager-web/type/trip";

export const loadShipmentInDay = async (routeId: string): Promise<DeliveryResponse | null> => {
  try {
    const res = await axiosClient<DeliveryResponse>({
        url: API_SHIPMENT_LIST + `?routeId=${routeId}`,
        method: 'get',
      }
    )

    if (res.status === 200) {
      return res.data
    }

    return null
  } catch(err) {
    return null;
  }
}

type GetTripCodeResponse = {
  message: string;
  trip: Trip;
}
export const getTripCode = async (routeId: string): Promise<Trip | null> => {
  try {
    const res = await axiosClient<GetTripCodeResponse>({
        url: API_SHIPMENT_GET_TRIP_CODE,
        method: 'post',
        data: {
          routeId,
        }
      }
    )

    if (res.status === 201) {
      return res.data.trip;
    }

    return null
  } catch(err) {
    return null;
  }
}

type UpdateTripResponse = {
  message: string;
  trip: Trip;
}

export const putTrip = async (routeId: string, trip: UpdateTripRequest): Promise<Trip | null> => {
  try {
    const url = API_SHIPMENT_PUT.replace(":id", routeId);
    const res = await axiosClient<UpdateTripResponse>({
        url,
        method: 'put',
        data: trip,
      }
    )

    if (res.status === 200) {
      return res.data.trip;
    }

    return null
  } catch(err) {
    return null;
  }
}

export const getTripList = async (routeId: string): Promise<GetTripListResponse | null> => {
  try {
    const res = await axiosClient<GetTripListResponse>({
        url: API_TRIP_LIST + `?from_route=${routeId}`,
        method: 'get',
      }
    )

    if (res.status === 200) {
      return res.data;
    }

    return null
  } catch(err) {
    return null;
  }
}

export const getParcelListByTripId = async (routeId: string): Promise<GetParcelListResponse | null> => {
  try {
    const url = API_TRIP_PARCEL_LIST.replace(":id", routeId);
    const res = await axiosClient<GetParcelListResponse>({
        url: url,
        method: 'get',
      }
    )

    if (res.status === 200) {
      return res.data;
    }

    return null
  } catch(err) {
    return null;
  }
}