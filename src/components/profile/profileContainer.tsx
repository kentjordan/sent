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
import Post from "./Post";

const MAX_CHAR_LENGTH = "56ch";

interface IUserPost {
  id: string;
  created_at: string;
  updated_at: string;
  content: string;
  user_id: string;
}

const MyProfileContainer = ({ username }: { username: string }) => {
  const dispatch = useDispatch();
  const { user } = useAppState();

  const [profile, setProfile] = useState({
    first_name: "Lorem",
    last_name: "Ipsum",
    bio: "N/A",
    profilePhoto: undefined,
    coverPhoto: undefined,
    username: "N/A",
  });

  const [isDPLoading, setIsDPLoading] = useState(true);
  const [userPosts, setUserPosts] = useState<Array<IUserPost>>([]);

  useEffect(() => {
    const getProfile = async () => {
      const profile = await axios.get(`${process.env.API_HOSTNAME}/profiles/${username}`);
      const profilePhoto = await axios.get(`${process.env.API_HOSTNAME}/images/profile-photo/${profile.data.id}`);
      setProfile({ ...profile.data, profilePhoto: profilePhoto.data.url });
    };

    const getUserPosts = async () => {
      const res = await axios.get(`${process.env.API_HOSTNAME}/posts/${username}`);
      setUserPosts(res.data);
    };

    getProfile();
    getUserPosts();
  }, []);

  return (
    <div className="h-fit w-full max-w-[56rem] border-l border-r border-l-stone-200 border-r-stone-200">
      <div className="min-h-[200px] w-full bg-stone-200"></div>

      <div className="flex items-start justify-between border-b p-4 sm:px-6 sm:pt-4">
        <div>
          {isDPLoading && profile.profilePhoto && (
            <div className="absolute z-20 mt-[-64px] h-24 w-24 rounded-full bg-stone-200 sm:h-32 sm:w-32"></div>
          )}
          {profile.profilePhoto && (
            <Image
              style={{
                opacity: isDPLoading ? 0 : 1,
              }}
              onLoad={(e) => {
                setIsDPLoading(false);
              }}
              className="mt-[-64px] h-24 w-24 rounded-full sm:h-32 sm:w-32"
              src={profile.profilePhoto}
              alt={"Profile Photo"}
              width={800}
              height={800}
            />
          )}
          {!profile.profilePhoto && (
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
      <div className="my-4 flex flex-col items-center">
        {userPosts.length <= 0 && <h1 className="text-center font-bold">No posts yet</h1>}
        {userPosts.map((post: IUserPost, i: number) => (
          <Post
            key={i}
            post_id={post.id}
            first_name={profile.first_name}
            last_name={profile.last_name}
            content={post.content}
            created_at={post.created_at}
            profile_photo={profile.profilePhoto}
          />
        ))}
      </div>
    </div>
  );
};

export default MyProfileContainer;
