import useAppState from "@/hooks/useAppState";
import { setActiveChat, toggleNewMessage } from "@/redux/sent.slice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { IUser } from "@/app/search/page";
import { IoPersonCircle } from "react-icons/io5";

const FoundUser = (user: IUser) => {
  const [profilePhoto, setProfilePhoto] = useState(undefined);
  const { accessToken } = useAppState();

  useEffect(() => {
    const getProfilePhoto = async () => {
      const res = await axios.get(`${process.env.API_HOSTNAME}/images/profile-photo/${user.user_id}`);

      if (res.data.url) {
        setProfilePhoto(res.data.url);
      }
    };
    getProfilePhoto();
  });

  const dispatch = useDispatch();

  return (
    <div
      onClick={async () => {
        try {
          const res = await axios.post<{
            created_at: Date;
            first_name: string;
            last_name: string;
            chat_id: string;
            user0_id: string;
            user1_id: string;
            username: string;
          }>(
            `${process.env.API_HOSTNAME}/chats/initialize`,
            {
              friend_id: user.user_id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

          dispatch(
            setActiveChat({
              is_visible: true,
              chat_id: res.data.chat_id,
              friend_id: res.data.user1_id,
              first_name: res.data.first_name,
              last_name: res.data.last_name,
              username: res.data.username,
            }),
          );

          toggleNewMessage();
        } catch (error) {
          console.log(error);
        }
      }}
      key={user.user_id}
      className="my-3 flex flex-1 cursor-pointer items-center justify-start "
    >
      {user.profile_photo ? (
        <Image
          src={user.profile_photo}
          className="ml-1 mr-3 h-8 w-8 rounded-full sm:h-12 sm:w-12"
          alt="Profile Photo"
          width={500}
          height={500}
        />
      ) : (
        <IoPersonCircle className="mr-3 h-14 w-14 rounded-full text-stone-300" />
      )}
      <h1 className="mx-4 font-normal">
        {user.first_name} {user.last_name}
      </h1>
    </div>
  );
};

export default FoundUser;
