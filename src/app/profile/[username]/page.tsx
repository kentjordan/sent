"use client";
import ProfileContainer from "@/components/profile/profileContainer";
import EditProfileDialog from "@/components/profile/editProfileDialog";
import { IProfileInitState, setActiveProfile } from "@/redux/profile.slice";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import NewMessage from "@/components/profile/newMessage";
import withAuth from "@/hoc/withAuth";
import { PageProps } from "@/@types/page";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { setActivePath } from "@/redux/app.slice";
import { Button } from "@/components/ui/button";
import useAppState from "@/hooks/useAppState";
import { useRouter } from "next/navigation";

const ProfilePage = (props: PageProps) => {
  const { isEditProfileVisible, isSendMessageVisible } = useSelector<RootState, IProfileInitState>(
    (state) => state.profile,
  );

  const dispatch = useDispatch();

  const [isUserFound, setIsUserFound] = useState(false);
  const { user } = useAppState();
  const router = useRouter();

  useEffect(() => {
    const getProfileById = async () => {
      try {
        const res = await axios.get(`${process.env.API_HOSTNAME}/profiles/${props.params.username}`);
        setIsUserFound(true);
        dispatch(
          setActiveProfile({
            ...res.data,
            userId: res.data.id,
          }),
        );
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            setIsUserFound(false);
          }
        }
      }
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
            {isUserFound && <ProfileContainer username={props.params.username} />}
            {!isUserFound && (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4">
                <h1 className="text-lg font-bold">Profile not found</h1>
                <Button onClick={() => router.replace(`/profile/${user?.username}`)} className="h-12 text-sm">
                  Back to my profile
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default withAuth(ProfilePage);
