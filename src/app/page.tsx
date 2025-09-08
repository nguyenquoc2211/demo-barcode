'use client';

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {RootState} from "docker-manager-web/store";


export default function Home() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  useEffect(() => {
    if (user.error.length > 0) {
      router.push('/login');
    } else {
      router.push('/stock/load')
    }
  }, []);
  return (
    <div></div>
  );
}
