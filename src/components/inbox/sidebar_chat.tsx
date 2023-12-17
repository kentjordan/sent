"use client";
import Image from "next/image";
import { useState } from "react";
import { IPrivateMessage } from "./types";
import useGlobalStore from "@/zustand/store.global";
import axios from "axios";

const SidebarChat = (privateMessage: IPrivateMessage) => {
  const [isSeen, setIsSeen] = useState(privateMessage.is_seen);
  const setActiveChat = useGlobalStore((state) => state.setActiveChat);
  const user = useGlobalStore((state) => state.user);

  return (
    <div
      onClick={() => {
        setActiveChat({
          is_visible: true,
          chat_id: privateMessage.chat_id,
          first_name: privateMessage.first_name,
          last_name: privateMessage.last_name,
          friend_id: privateMessage.friend_id,
        });
      }}
      className='flex p-2 cursor-pointer items-center'>
      <Image
        width={40}
        height={40}
        alt='profile photo'
        src={"https://picsum.photos/56/56"}
        className='rounded-full h-12 w-12 m-2'
      />
      <div className='flex flex-col justify-center mx-2 flex-1'>
        <h1 className={isSeen ? "font-normal" : "font-bold"}>
          {privateMessage.first_name} {privateMessage.last_name}
        </h1>
        <span className={isSeen ? "font-normal" : "font-bold"}>
          {user.id === privateMessage.friend_id ? "You: " : ""}{" "}
          {privateMessage.message}
        </span>
      </div>
      {isSeen ? null : (
        <div className='bg-slate-700 w-4 h-4 rounded-full mx-4'></div>
      )}
    </div>
  );
};

export default SidebarChat;
