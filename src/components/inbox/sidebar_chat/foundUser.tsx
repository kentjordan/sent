import useAppState from "@/hooks/useAppState";
import { setActiveChat, toggleNewMessage } from "@/redux/sent.slice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";

interface IFoundUser {
  id: string;
  first_name: string;
  last_name: string;
}

const FoundUser = (user: IFoundUser) => {
  const [profilePhoto, setProfilePhoto] = useState(undefined);
  const { accessToken } = useAppState();

  useEffect(() => {
    const getProfilePhoto = async () => {
      const res = await axios.get(`${process.env.API_HOSTNAME}/images/profile-photo/${user.id}`);

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
              friend_id: user.id,
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
      key={user.id}
      className="my-3 flex flex-1 cursor-pointer items-center justify-start "
    >
      {profilePhoto && (
        <Image width={40} height={40} alt="profile photo" src={profilePhoto} className="h-12 w-12 rounded-full" />
      )}
      <h1 className="mx-4 font-normal">
        {user.first_name} {user.last_name}
      </h1>
    </div>
  );
};

export default FoundUser;
