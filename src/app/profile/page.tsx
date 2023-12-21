"use client";
import Link from "next/link";
import useLogout from "../hooks/useLogout";
import { BiMessageRounded } from "react-icons/bi";
import { CiLogout } from "react-icons/ci";
import { IoPersonCircleOutline } from "react-icons/io5";
import SidebarMenu from "@/components/sidebar_menu";
import ProfileContainer from "@/components/profile/profileContainer";
import EditProfileDialog from "@/components/profile/editProfileDialog";
import { IProfileInitState } from "@/redux/profile.slice";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import NewMessage from "@/components/profile/newMessage";

const ProfilePage = () => {
  const logout = useLogout();

  const { isEditProfileVisible, isSendMessageVisible } = useSelector<
    RootState,
    IProfileInitState
  >((state) => state.profile);

  return (
    <div className="flex h-full w-full">
      <SidebarMenu />
      {isEditProfileVisible && <EditProfileDialog />}
      {isSendMessageVisible && <NewMessage />}
      <div className="flex w-full justify-center overflow-y-auto ">
        <ProfileContainer />
      </div>
    </div>
  );
};

export default ProfilePage;
