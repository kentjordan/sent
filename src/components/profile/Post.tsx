import { DateTime } from "luxon";
import Image from "next/image";
import { IoHeart, IoHeartOutline, IoPersonCircle } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { setActivePost, toggleDeletePost, toggleUpdatePost } from "@/redux/profile.slice";
import { useEffect, useState } from "react";
import { MdClose, MdOutlineDeleteOutline } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import useAppState from "@/hooks/useAppState";
import axios, { AxiosError } from "axios";
import Link from "next/link";

export interface IPost {
  username: string;
  user_id: string;
  post_id: string;
  first_name: string;
  last_name: string;
  content: string;
  profile_photo: string | undefined;
  created_at: string;
}

const Post = ({ username, user_id, post_id, first_name, last_name, content, profile_photo, created_at }: IPost) => {
  // Hooks
  const dispatch = useDispatch();
  const { user, accessToken } = useAppState();

  // States
  const [isPostMenuVisible, setPostMenuVisible] = useState(false);
  const [isPostLiked, setIsPostLiked] = useState(false);
  const [postLikes, setPostLikes] = useState(0);

  const getPostLikesCount = async () => {
    try {
      const res = await axios.get(`${process.env.API_HOSTNAME}/post-reacts/${post_id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.status === 200) {
        setPostLikes(parseInt(res.data));
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response);
      }
    }
  };

  // Check if the user liked the post
  useEffect(() => {
    const checkUserReact = async () => {
      try {
        const res = await axios.get(`${process.env.API_HOSTNAME}/post-reacts/${post_id}/user-react`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.data >= 1) {
          setIsPostLiked(true);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(error.response);
        }
      }
    };
    checkUserReact();
  }, []);

  useEffect(() => {
    getPostLikesCount();
  }, [postLikes]);

  // OnClick Functions
  const onPostReact = () => {
    const reactPost = async () => {
      try {
        setIsPostLiked(true);
        const res = await axios.post(
          `${process.env.API_HOSTNAME}/post-reacts/${post_id}`,
          { react: "HEART" },
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );

        if (res.status === 201) {
          // Reacted to post successfully
          getPostLikesCount();
          setIsPostLiked(true);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(error.response);
        }
      }
    };
    reactPost();
  };

  const onPostRemoveReact = () => {
    const removeReactPost = async () => {
      try {
        setIsPostLiked(false);
        const res = await axios.delete(`${process.env.API_HOSTNAME}/post-reacts/${post_id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.status === 200) {
          // Post deleted successfully
          getPostLikesCount();
          setIsPostLiked(false);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(error.response);
        }
      }
    };
    removeReactPost();
  };

  return (
    <div className="relative flex w-full justify-between border-b py-4">
      <div className="flex ">
        {profile_photo ? (
          <Image
            src={profile_photo}
            className="min-h-8 min-w-8 mx-4 h-8 w-8 rounded-full"
            alt="Profile Photo"
            width={500}
            height={500}
          />
        ) : (
          <IoPersonCircle className="min-h-8 min-w-8 mx-4 h-10 w-10 rounded-full text-stone-300" />
        )}
        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap gap-1">
            <Link href={`/profile/${username}`} className="text-sm font-bold">
              {first_name} {last_name}
            </Link>
            <p className="text-sm text-stone-400">•</p>
            <p className="text-sm text-stone-400">{DateTime.fromISO(created_at).toRelative({ style: "short" })}</p>
          </div>
          <div className="mt-2">
            <p className="text-sm">{content}</p>
          </div>
          <div className="mt-4 flex items-center gap-2">
            {isPostLiked ? (
              <IoHeart className="cursor-pointer text-red-500" onClick={onPostRemoveReact} size={20} />
            ) : (
              <IoHeartOutline className="cursor-pointer" onClick={onPostReact} size={20} />
            )}
            <p>{postLikes}</p>
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
