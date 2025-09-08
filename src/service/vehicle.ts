import axiosClient from "docker-manager-web/utils/axios";
import {API_VEHICLE} from "docker-manager-web/constant/url";
import {Vehicle} from "docker-manager-web/type/vehicle";

export const loadVehicles = async (): Promise<Vehicle[]> => {
  try {
    const res = await axiosClient<Vehicle[]>({
        url: API_VEHICLE,
        method: 'get',
      }
    )

    if (res.status === 200) {
      return res.data
    }

    return []
  } catch(err) {
    return [];
  }
}