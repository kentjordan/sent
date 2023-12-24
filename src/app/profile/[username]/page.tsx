"use client";
import ProfileContainer from "@/components/profile/profileContainer";
import EditProfileDialog from "@/components/profile/editProfileDialog";
import { IProfileInitState, setActiveProfile } from "@/redux/profile.slice";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import NewMessage from "@/components/profile/newMessage";
import withAuth from "@/hoc/withAuth";
import { PageProps } from "@/@types/page";
import { useEffect } from "react";
import axios from "axios";
import { setActivePath } from "@/redux/app.slice";

const ProfilePage = (props: PageProps) => {
  const { isEditProfileVisible, isSendMessageVisible } = useSelector<RootState, IProfileInitState>(
    (state) => state.profile,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const getProfileById = async () => {
      const res = await axios.get(`${process.env.API_HOSTNAME}/profiles/${props.params.username}`);

      dispatch(
        setActiveProfile({
          ...res.data,
          userId: res.data.id,
        }),
      );
    };

    if (props.params.username) {
      getProfileById();
    }

    dispatch(setActivePath("/profile"));
  }, [props.params.username]);

  return (
    <>
      {props.accessToken && (
        <div className="relative flex h-screen w-full">
          {isEditProfileVisible && <EditProfileDialog />}
          {isSendMessageVisible && <NewMessage />}
          <div className="flex w-full justify-center overflow-y-auto ">
            <ProfileContainer username={props.params.username} />
          </div>
        </div>
      )}
    </>
  );
};

export default withAuth(ProfilePage);
