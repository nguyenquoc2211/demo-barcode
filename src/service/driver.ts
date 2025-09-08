import axiosClient from "docker-manager-web/utils/axios";
import {Driver} from "docker-manager-web/type/driver";
import {API_DRIVER} from "docker-manager-web/constant/url";

export const loadDrivers = async (): Promise<Driver[]> => {
  try {
    const res = await axiosClient<Driver[]>({
        url: API_DRIVER,
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