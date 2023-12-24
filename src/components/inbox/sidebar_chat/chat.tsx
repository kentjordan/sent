"use client";
import Image from "next/image";
import { useLayoutEffect, useState } from "react";
import { IPrivateMessage } from "../types";
import axios from "axios";
import { io } from "socket.io-client";
import { getInboxMessageTime } from "@/lib/inbox";
import useAppState from "@/hooks/useAppState";
import { useDispatch } from "react-redux";
import { setActiveChat } from "@/redux/sent.slice";
import { IoPersonCircle } from "react-icons/io5";

const SidebarChat = (privateMessage: IPrivateMessage) => {
  const [isSeen, setIsSeen] = useState(true);
  const dispatch = useDispatch();
  const { user, accessToken } = useAppState();
  const [profilePhoto, setProfilePhoto] = useState(undefined);

  useLayoutEffect(() => {
    const checkSeenStatus = async () => {
      const res = await axios.get<{ user_id: string; private_message_id: string }[]>(
        `${process.env.API_HOSTNAME}/seen/${privateMessage.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      setIsSeen(res.data.length > 0);
    };

    const socket = io(process.env.WS_GATEWAY_INBOX as string, {
      auth: {
        user_id: user?.id as string,
      },
    });

    socket.on("inbox", () => {
      checkSeenStatus();
    });

    checkSeenStatus();

    const getProfilePhoto = async () => {
      const res = await axios.get(`${process.env.API_HOSTNAME}/images/profile-photo/${privateMessage.friend_id}`);
      setProfilePhoto(res.data.url);
    };

    getProfilePhoto();
  }, []);

  return (
    <div
      className="relative my-3 flex w-full cursor-pointer items-center justify-start pr-4 sm:justify-between"
      onClick={() => {
        dispatch(
          setActiveChat({
            is_visible: true,
            chat_id: privateMessage.chat_id,
            first_name: privateMessage.first_name,
            last_name: privateMessage.last_name,
            friend_id: privateMessage.friend_id,
            username: privateMessage.username,
          }),
        );

        const seenMessage = async () => {
          await axios.post(
            `${process.env.API_HOSTNAME}/seen/${privateMessage.id}`,
            {
              user_id: user?.id,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );
          setIsSeen(true);
        };

        seenMessage();
      }}
    >
      <div className="flex items-center justify-start ">
        <div
          style={{
            opacity: isSeen ? 0 : 1,
          }}
          className="mx-2 min-h-[6px] min-w-[6px] rounded-full bg-slate-700 sm:flex"
        ></div>
        {profilePhoto && (
          <Image
            width={40}
            height={40}
            alt="profile photo"
            src={profilePhoto}
            className="h-[3rem] w-[3rem] rounded-full"
          />
        )}
        {!profilePhoto && <IoPersonCircle className="min-h-[3rem] min-w-[3rem] rounded-full" />}
        <div className="mx-4 hidden flex-col justify-center text-xs sm:flex md:text-sm">
          <h1 className={`${isSeen ? "font-normal" : "font-bold"}`}>
            {privateMessage.first_name} {privateMessage.last_name}
          </h1>
          <span
            className={`${
              isSeen ? "font-normal" : "font-bold"
            } max-w-[22ch] overflow-hidden overflow-ellipsis whitespace-nowrap`}
          >
            {user?.id === privateMessage.friend_id ? "You: " : ""}
            {privateMessage.message}
          </span>
        </div>
      </div>
      <span className="hidden w-fit text-[10px] text-stone-500 md:flex">
        {getInboxMessageTime(privateMessage.created_at)}
      </span>
    </div>
  );
};

export default SidebarChat;
