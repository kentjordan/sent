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

const ProfilePage = (props: PageProps) => {
  const { isEditProfileVisible, isSendMessageVisible, isCreatePostVisible, isDeletePostVisible, isUpdatePostVisible } =
    useSelector<RootState, IProfileInitState>((state) => state.profile);

  const dispatch = useDispatch();

  const [isUserFound, setIsUserFound] = useState(true);
  const { user } = useAppState();
  const router = useRouter();

  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const getProfileById = async () => {
      try {
        const res = await axios.get(`${process.env.API_HOSTNAME}/profiles/${props.params.username}`);
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

    if (props.params.username) {
      getProfileById();
    }

    dispatch(setActivePath("/profile"));
  }, [props.params.username]);

  if (isPageLoading) return <PageLoading />;

  return (
    <>
      {props.accessToken && (
        <div className="relative flex h-screen w-full justify-center">
          {isCreatePostVisible && <CreatePost />}
          {isUpdatePostVisible && <UpdatePost />}
          {isDeletePostVisible && <DeletePost />}
          <div
            onClick={() => dispatch(toggleCreatePost(true))}
            className="absolute bottom-0 right-0 z-10 m-8 flex rounded-full bg-slate-800 p-3 shadow-2xl"
          >
            <MdPostAdd className="cursor-pointer" color="white" size={32} />
          </div>
          {isEditProfileVisible && <EditProfileDialog />}
          {isSendMessageVisible && <NewMessage />}
          <div className="flex w-full justify-center overflow-y-auto ">
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
