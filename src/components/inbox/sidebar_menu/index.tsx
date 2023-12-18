"use client";
import { BiMessageRounded } from "react-icons/bi";
import { IoPersonCircleOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { useRouter } from "next/navigation";
import useGlobalStore from "@/zustand/store.global";
import axios from "axios";
import { initial_state } from "@/zustand/store.global";

const SidebarMenu = () => {
  const router = useRouter();
  const resetState = useGlobalStore((state) => state.resetState);

  return (
    <div className='h-full w-16 bg-stone-50 flex flex-col justify-between p-4'>
      <div className='flex justify-center flex-col items-center'>
        {/* <IoPersonCircleOutline className='mb-6 cursor-pointer' size={32} /> */}
        <div className='p-2 bg-stone-200 mb-6 cursor-pointer rounded-lg'>
          <BiMessageRounded color='black' size={32} />
        </div>
      </div>
      <div
        onClick={() => {
          const logout = async () => {
            resetState(initial_state);
            await axios.get(`${process.env.API_HOSTNAME}/auth/logout`, {
              withCredentials: true,
            });
            router.replace("/login");
          };
          logout();
        }}
        className='flex justify-center flex-col items-center cursor-pointer'>
        <CiLogout size={32} />
      </div>
    </div>
  );
};

export default SidebarMenu;
