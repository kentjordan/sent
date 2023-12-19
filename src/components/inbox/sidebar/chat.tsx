"use client";
import Image from "next/image";
import { useLayoutEffect, useState } from "react";
import { IPrivateMessage } from "../types";
import useGlobalStore from "@/zustand/store.global";
import axios from "axios";
import { io } from "socket.io-client";

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
      className="bg-red relative my-3 flex w-full cursor-pointer items-center justify-start sm:justify-between"
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
      <div className="flex">
        <Image
          width={40}
          height={40}
          alt="profile photo"
          src={"https://picsum.photos/56/56"}
          className="min-h-[3rem] min-w-[3rem] rounded-full"
        />
        <div className="mx-4 hidden flex-col justify-center text-sm sm:flex">
          <h1 className={isSeen ? "font-normal" : "font-bold"}>
            {privateMessage.first_name} {privateMessage.last_name}
          </h1>
          <span className={isSeen ? "font-normal" : "font-bold"}>
            {user.id === privateMessage.friend_id ? "You: " : ""}{" "}
            {privateMessage.message.slice(0, 28)}
            {privateMessage.message.length >= 28 ? "..." : ""}
          </span>
        </div>
      </div>
      {isSeen ? null : (
        <div className="ml-3 h-3 w-3 rounded-full bg-slate-700 sm:flex"></div>
      )}
    </div>
  );
};

export default SidebarChat;
