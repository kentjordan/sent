"use client";
import Image from "next/image";
import { useState } from "react";
import { IChat } from "./types";
import useGlobalStore from "@/zustand/store.global";
import axios from "axios";

const SidebarChat = (chat: IChat) => {
  const [isSeen, setIsSeen] = useState(chat.is_seen);
  const setActiveChat = useGlobalStore((state) => state.setActiveChat);
  const active_chat = useGlobalStore((state) => state.active_chat);
  const user = useGlobalStore((state) => state.user);

  return (
    <div
      onClick={() => {
        setActiveChat({
          is_visible: true,
          chat_id: chat.chat_id,
          first_name: chat.first_name,
          last_name: chat.last_name,
          friend_id: chat.friend_id,
        });

        setIsSeen(true);

        // axios
        //   .patch(
        //     `http://localhost:3001/private_message/${active_chat.message_id}`,
        //     {
        //       is_seen: true,
        //     }
        //   )
        //   .then((res) => {
        //     setIsRead(true);
        //   });
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
          {chat.first_name} {chat.last_name}
        </h1>
        <span className={isSeen ? "font-normal" : "font-bold"}>
          {user.id === chat.friend_id ? "You: " : ""} {chat.message}
        </span>
      </div>
      {isSeen ? null : (
        <div className='bg-slate-700 w-4 h-4 rounded-full mx-4'></div>
      )}
    </div>
  );
};

export default SidebarChat;
