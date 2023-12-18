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
    <div className="hidden h-full w-16 flex-col justify-between bg-stone-50 p-4 sm:flex">
      <div className="flex flex-col items-center justify-center">
        {/* <IoPersonCircleOutline className='mb-6 cursor-pointer' size={32} /> */}
        <div className="mb-6 cursor-pointer rounded-lg bg-stone-200 p-2">
          <BiMessageRounded color="black" size={32} />
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
        className="flex cursor-pointer flex-col items-center justify-center"
      >
        <CiLogout size={32} />
      </div>
    </div>
  );
};

export default SidebarMenu;
