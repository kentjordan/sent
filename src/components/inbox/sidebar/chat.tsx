"use client";
import Image from "next/image";
import { useLayoutEffect, useState } from "react";
import { IPrivateMessage } from "../types";
import useGlobalStore from "@/zustand/store.global";
import axios from "axios";
import { io } from "socket.io-client";
import { DateTime } from "luxon";

const SidebarChat = (privateMessage: IPrivateMessage) => {
  const [isSeen, setIsSeen] = useState(true);
  const setActiveChat = useGlobalStore((state) => state.setActiveChat);
  const user = useGlobalStore((state) => state.user);
  const access_token = useGlobalStore((state) => state.access_token);

  useLayoutEffect(() => {
    const checkSeenStatus = async () => {
      const res = await axios.get<
        { user_id: string; private_message_id: string }[]
      >(`${process.env.API_HOSTNAME}/seen/${privateMessage.id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      setIsSeen(res.data.length > 0);
    };

    const socket = io(process.env.WS_GATEWAY_INBOX as string, {
      auth: {
        user_id: user.id as string,
      },
    });

    socket.on("inbox", () => {
      checkSeenStatus();
    });

    checkSeenStatus();
  }, []);

  return (
    <div
      className="relative my-3 flex w-full cursor-pointer items-center justify-start pr-4 sm:justify-between"
      onClick={() => {
        setActiveChat({
          is_visible: true,
          chat_id: privateMessage.chat_id,
          first_name: privateMessage.first_name,
          last_name: privateMessage.last_name,
          friend_id: privateMessage.friend_id,
        });

        const seenMessage = async () => {
          await axios.post(
            `${process.env.API_HOSTNAME}/seen/${privateMessage.id}`,
            {
              user_id: user.id,
            },
            {
              headers: {
                Authorization: `Bearer ${access_token}`,
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
        <Image
          width={40}
          height={40}
          alt="profile photo"
          src={"https://picsum.photos/56/56"}
          className="min-h-[3rem] min-w-[3rem] rounded-full"
        />
        <div className="mx-4 hidden flex-col justify-center text-xs sm:flex md:text-sm">
          <h1 className={`${isSeen ? "font-normal" : "font-bold"}`}>
            {privateMessage.first_name} {privateMessage.last_name}
          </h1>
          <span className={`${isSeen ? "font-normal" : "font-bold"}`}>
            {user.id === privateMessage.friend_id ? "You: " : ""}{" "}
            {privateMessage.message.slice(0, 24)}
            {privateMessage.message.length >= 24 ? "..." : ""}
          </span>
        </div>
      </div>
      <span className="ml-4 hidden w-fit text-[10px] text-stone-500 md:flex">
        {DateTime.fromISO(privateMessage.created_at).toRelative({
          style: "narrow",
        })}
      </span>
    </div>
  );
};

export default SidebarChat;
