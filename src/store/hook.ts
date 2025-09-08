import {useDispatch} from "react-redux";
import {AppDispatch} from "docker-manager-web/store/index";

export const useAppDispatch = () => {
  return useDispatch<AppDispatch>();
}