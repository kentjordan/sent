"use client";
import { BiMessageRounded } from "react-icons/bi";
import { IoPersonCircleOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import useLogout from "@/app/hooks/useLogout";

const SidebarMenu = () => {
  const logout = useLogout();

  return (
    <div className="hidden h-full w-14 flex-col justify-between bg-stone-200 p-4 sm:flex">
      <div className="flex flex-col items-center justify-center">
        {/* <IoPersonCircleOutline className='mb-6 cursor-pointer' size={32} /> */}
        <div className=" mb-6 cursor-pointer rounded-lg bg-stone-300 p-2">
          <BiMessageRounded color="black" size={24} />
        </div>
      </div>
      <div
        onClick={logout}
        className="flex cursor-pointer flex-col items-center justify-center"
      >
        <CiLogout size={24} />
      </div>
    </div>
  );
};

export default SidebarMenu;
