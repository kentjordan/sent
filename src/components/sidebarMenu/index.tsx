"use client";
import { BiMessageRounded } from "react-icons/bi";
import { IoPersonCircleOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import useLogout from "@/hooks/useLogout";
import useAppState from "@/hooks/useAppState";
import { useRouter } from "next/navigation";
import { LuNewspaper } from "react-icons/lu";
import { IoSearch } from "react-icons/io5";

const SidebarMenu = () => {
  const { activePath } = useAppState();

  const logout = useLogout();
  const router = useRouter();
  const { user, accessToken } = useAppState();

  if (accessToken) {
    return (
      <div className="fixed z-50 hidden h-full w-14 flex-col items-center justify-between bg-stone-100 lg:flex">
        <div className="flex flex-col items-center justify-center gap-y-2 sm:m-0">
          <div
            onClick={() => router.replace("/newsfeed")}
            className={`cursor-pointer rounded-lg ${activePath === "/newsfeed" ? " bg-stone-300" : ""} m-2 p-1`}
          >
            <LuNewspaper className="cursor-pointer" color="black" size={20} />
          </div>
          <div
            onClick={() => router.replace("/search")}
            className={`cursor-pointer rounded-lg ${activePath === "/search" ? " bg-stone-300" : ""} m-2 p-1`}
          >
            <IoSearch className="cursor-pointer" color="black" size={24} />
          </div>
          <div
            onClick={() => router.replace("/inbox")}
            className={`cursor-pointer rounded-lg ${activePath === "/inbox" ? " bg-stone-300" : ""} m-2 p-1`}
          >
            <BiMessageRounded className="cursor-pointer" color="black" size={24} />
          </div>
          <div
            onClick={() => router.replace(`/profile/${user?.username}`)}
            className={`cursor-pointer rounded-lg ${activePath === "/profile" ? " bg-stone-300" : ""} m-2 p-1`}
          >
            <IoPersonCircleOutline className="cursor-pointer" size={24} />
          </div>
        </div>
        <div onClick={logout} className="flex w-full cursor-pointer flex-col items-center justify-center p-3 sm:m-0">
          <CiLogout className="font-bold text-red-700" size={24} />
        </div>
      </div>
    );
  }
};

export default SidebarMenu;
