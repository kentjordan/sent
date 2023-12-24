"use client";
import { BiMessageRounded } from "react-icons/bi";
import { IoPersonCircleOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import useLogout from "@/hooks/useLogout";
import useAppState from "@/hooks/useAppState";
import { useRouter } from "next/navigation";

const SidebarMenu = () => {
  const { activePath } = useAppState();

  const logout = useLogout();
  const router = useRouter();
  const { user, accessToken } = useAppState();

  if (accessToken) {
    return (
      <div className="flex h-full w-14 flex-col justify-between bg-stone-100 sm:p-4">
        <div className="mt-4 flex flex-col items-center justify-center sm:m-0">
          <div
            onClick={() => router.replace(`/profile/${user?.username}`)}
            className={`mb-4 cursor-pointer rounded-lg ${activePath === "/profile" ? " bg-stone-300" : ""} p-2`}
          >
            <IoPersonCircleOutline className="cursor-pointer" size={24} />
          </div>
          <div
            onClick={() => router.replace("/inbox")}
            className={`mb-4 cursor-pointer rounded-lg ${activePath === "/inbox" ? " bg-stone-300" : ""} p-2`}
          >
            <BiMessageRounded className="cursor-pointer" color="black" size={24} />
          </div>
        </div>
        <div onClick={logout} className="mb-4 flex cursor-pointer flex-col items-center justify-center sm:m-0">
          <CiLogout size={24} />
        </div>
      </div>
    );
  }
};

export default SidebarMenu;
