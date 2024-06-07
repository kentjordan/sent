"use client";
import ProfileContainer from "@/components/profile/profileContainer";
import EditProfileDialog from "@/components/profile/editProfileDialog";
import { IProfileInitState, setActiveProfile, toggleCreatePost } from "@/redux/profile.slice";
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
import { MdPostAdd } from "react-icons/md";
import CreatePost from "@/components/profile/CreatePost";
import DeletePost from "@/components/profile/DeletePost";
import UpdatePost from "@/components/profile/UpdatePost";
import PageLoading from "@/components/PageLoading";
import Followers from "@/components/profile/Followers";

const ProfilePage = (props: PageProps) => {
  const {
    isEditProfileVisible,
    isSendMessageVisible,
    isCreatePostVisible,
    isDeletePostVisible,
    isUpdatePostVisible,
    isFollowersDialogVisible,
  } = useSelector<RootState, IProfileInitState>((state) => state.profile);

  const dispatch = useDispatch();

  const [isUserFound, setIsUserFound] = useState(true);
  const { user } = useAppState();
  const router = useRouter();

  const [isPageLoading, setIsPageLoading] = useState(true);

  const { accessToken } = useAppState();

  useEffect(() => {
    const getProfileById = async () => {
      try {
        const res = await axios.get(`${process.env.API_HOSTNAME}/profiles/${props.params.username}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        dispatch(
          setActiveProfile({
            ...res.data,
            userId: res.data.id,
          }),
        );
        setIsPageLoading(false);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            setIsUserFound(false);
          }
        }
      }
    };

    if (props.params.username && accessToken) {
      getProfileById();
    }

    dispatch(setActivePath("/profile"));
  }, [props.params.username, accessToken]);

  if (isPageLoading) return <PageLoading />;

  return (
    <>
      {props.accessToken && (
        <div className="relative flex h-screen w-full justify-center pb-12 lg:pb-0">
          {isFollowersDialogVisible && <Followers username={props.params.username} />}
          {isCreatePostVisible && <CreatePost />}
          {isUpdatePostVisible && <UpdatePost />}
          {isDeletePostVisible && <DeletePost />}
          <div
            onClick={() => dispatch(toggleCreatePost(true))}
            className="absolute bottom-0 right-0 z-10 mb-20 mr-6 flex rounded-full bg-slate-800 p-3 shadow-2xl lg:mb-6"
          >
            <MdPostAdd className="cursor-pointer" color="white" size={32} />
          </div>
          {isEditProfileVisible && <EditProfileDialog />}
          {isSendMessageVisible && <NewMessage />}
          <div className="flex w-full justify-center overflow-y-auto">
            {/* User Found */}
            {isUserFound && <ProfileContainer username={props.params.username} />}
            {/* User NOT found */}
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
