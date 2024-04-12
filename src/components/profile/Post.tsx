import { DateTime } from "luxon";
import Image from "next/image";
import { IoHeartOutline, IoPersonCircle } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { setActivePost, toggleDeletePost, toggleUpdatePost } from "@/redux/profile.slice";
import { useState } from "react";
import { MdClose, MdOutlineDeleteOutline } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import useAppState from "@/hooks/useAppState";

interface IPost {
  user_id: string;
  post_id: string;
  first_name: string;
  last_name: string;
  content: string;
  profile_photo: string | undefined;
  created_at: string;
}

const Post = ({ user_id, post_id, first_name, last_name, content, profile_photo, created_at }: IPost) => {
  const dispatch = useDispatch();

  const [isPostMenuVisible, setPostMenuVisible] = useState(false);

  const { user } = useAppState();

  return (
    <div className="relative flex w-full justify-between border-b py-4">
      <div className="flex ">
        {profile_photo ? (
          <Image
            src={profile_photo}
            className="mx-4 h-8 w-8 rounded-full sm:h-12 sm:w-12"
            alt="Profile Photo"
            width={500}
            height={500}
          />
        ) : (
          <IoPersonCircle className="mx-4 h-12 w-12 rounded-full sm:h-16 sm:w-16" />
        )}
        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap gap-1">
            <h1 className="text-sm font-bold">
              {first_name} {last_name}
            </h1>
            <p className="text-sm text-stone-400">•</p>
            <p className="text-sm text-stone-400">{DateTime.fromISO(created_at).toRelative({ style: "short" })}</p>
          </div>
          <div className="mt-2">
            <p className="text-sm">{content}</p>
          </div>
          <div className="mt-4">
            <IoHeartOutline size={24} />
          </div>
        </div>
      </div>
      <div className="mx-8 cursor-pointer">
        {user?.id === user_id ? (
          <BsThreeDots onClick={() => setPostMenuVisible(!isPostMenuVisible)} size={20} />
        ) : (
          <></>
        )}
      </div>
      {isPostMenuVisible && (
        <div className="absolute right-0 top-0 m-2  flex flex-col gap-y-2 rounded-md border bg-white p-3 text-white shadow-lg">
          <div
            onClick={() => {
              dispatch(toggleDeletePost(true));
              dispatch(setActivePost({ id: post_id, content }));
            }}
            className="flex cursor-pointer items-center justify-start gap-2"
          >
            <MdOutlineDeleteOutline className="text-red-500" size={20} />
            <p className="text-sm text-red-500">Delete</p>
          </div>
          <div
            onClick={() => {
              dispatch(toggleUpdatePost(true));
              dispatch(setActivePost({ id: post_id, content }));
            }}
            className="flex cursor-pointer items-center justify-start gap-2"
          >
            <MdEdit className="text-black" size={20} />
            <p className="text-sm text-black">Update</p>
          </div>
          <div
            onClick={() => setPostMenuVisible(!isPostMenuVisible)}
            className="flex cursor-pointer items-center justify-start gap-2"
          >
            <MdClose className="text-black" size={20} />
            <p className="text-sm text-black">Cancel</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
