"use client";
import { BiMessageRounded } from "react-icons/bi";
import { IoPersonCircleOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import useLogout from "@/app/hooks/useLogout";
import Link from "next/link";
import { setActivePath } from "@/redux/app.slice";
import { useDispatch } from "react-redux";
import useAppState from "@/app/hooks/useAppState";
import { useRouter } from "next/navigation";

const SidebarMenu = () => {
  const { activePath } = useAppState();
  const logout = useLogout();

  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <div className="hidden h-full w-14 flex-col justify-between bg-stone-100 p-4 sm:flex">
      <div className="flex flex-col items-center justify-center">
        <div
          onClick={() => {
            router.replace("/profile");
            dispatch(setActivePath("/profile"));
          }}
          className={`mb-4 cursor-pointer rounded-lg ${
            activePath === "/profile" ? " bg-stone-300" : ""
          } p-2`}
        >
          <IoPersonCircleOutline className="cursor-pointer" size={24} />
        </div>

        <div
          onClick={() => {
            router.replace("/inbox");
            dispatch(setActivePath("/inbox"));
          }}
          className={`mb-4 cursor-pointer rounded-lg ${
            activePath === "/inbox" ? " bg-stone-300" : ""
          } p-2`}
        >
          <BiMessageRounded
            className="cursor-pointer"
            color="black"
            size={24}
          />
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
