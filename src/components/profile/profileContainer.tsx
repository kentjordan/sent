"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { BiMessageRounded } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { toggleSendMessage, toggleEditProfile } from "@/redux/profile.slice";
import { IoPersonCircle } from "react-icons/io5";
import { useEffect, useState } from "react";
import axios from "axios";
import useAppState from "@/hooks/useAppState";

const MAX_CHAR_LENGTH = "56ch";

const MyProfileContainer = ({ username }: { username: string }) => {
  const dispatch = useDispatch();
  const { user } = useAppState();

  const [profile, setProfile] = useState({
    first_name: "Lorem",
    last_name: "Ipsum",
    bio: "",
    profilePhoto: undefined,
    coverPhoto: undefined,
    username: "",
  });

  useEffect(() => {
    const getProfile = async () => {
      const profile = await axios.get(`${process.env.API_HOSTNAME}/profiles/${username}`);
      console.log(profile.data);

      const profilePhoto = await axios.get(`${process.env.API_HOSTNAME}/images/profile-photo/${profile.data.id}`);
      setProfile({ ...profile.data, profilePhoto: profilePhoto.data.url });
    };

    getProfile();
  }, []);

  return (
    <div className="w-full max-w-[56rem] border-l border-r border-l-stone-200 border-r-stone-200">
      <div className="h-[200px] w-full bg-stone-300"></div>
      {/* <Image className="" src="https://picsum.photos/1500/500" alt={"Profile Photo"} width={1500} height={500} /> */}
      <div className="flex items-start justify-between border-b p-4 sm:px-6 sm:py-4">
        <div>
          {profile.profilePhoto ? (
            <Image
              className="mt-[-64px] h-24 w-24 rounded-full sm:h-32 sm:w-32"
              src={profile.profilePhoto}
              alt={"Profile Photo"}
              width={800}
              height={800}
            />
          ) : (
            <IoPersonCircle className="mt-[-64px] h-24 w-24 rounded-full bg-white sm:h-32 sm:w-32" />
          )}
          <h1 className="mt-4 text-base font-bold sm:text-xl">
            {profile.first_name} {profile.last_name}
          </h1>
          <p className="text-sm text-stone-400">@{profile.username}</p>
          <p className={`line-clamp-4 sm:line-clamp-2 max-w-[${MAX_CHAR_LENGTH}] my-4 text-sm`}>{profile.bio}</p>
        </div>
        <div className="flex items-center">
          {user?.username !== decodeURIComponent(username) && (
            <Button
              onClick={() => dispatch(toggleSendMessage())}
              className="mr-1 flex h-fit items-center justify-center rounded-full bg-slate-800 "
            >
              <BiMessageRounded className="cursor-pointer" color="white" size={22} />
            </Button>
          )}
          {/* {user?.id === user_id && (
            <Button
              // onClick={() => dispatch(toggleEditProfile())}
              className="group mx-1 flex h-fit items-center justify-center rounded-full border border-slate-800 bg-transparent px-3 py-2"
            >
              <p className="text-slate-800 group-hover:text-white">Hide me</p>
            </Button>
          )} */}
          {user?.username === decodeURIComponent(username) && (
            <Button
              onClick={() => dispatch(toggleEditProfile())}
              className="mx-1 flex h-fit items-center justify-center rounded-full bg-slate-800 px-3 py-2"
            >
              <p className="text-white">Edit profile</p>
            </Button>
          )}
        </div>
      </div>
      <div className="flex h-56 items-center justify-center">
        <h1>No posts yet</h1>
      </div>
    </div>
  );
};

export default MyProfileContainer;
