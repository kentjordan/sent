"use client";
import { RiChatNewLine } from "react-icons/ri";
import SidebarChat from "./chat";
import { Input } from "../../ui/input";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import axios from "axios";
import { IPrivateMessage } from "../types";
import useGlobalStore from "@/zustand/store.global";

const SideBar = () => {
  const [chatPrivateMessages, setChatPrivateMessages] = useState<
    IPrivateMessage[]
  >([]);
  const user = useGlobalStore((state) => state.user);

  const access_token = useGlobalStore((state) => state.access_token);

  useEffect(() => {
    const socket = io(process.env.WS_GATEWAY_INBOX as string, {
      auth: {
        user_id: user.id as string,
      },
    });

    socket.on("connect", () => {
      console.log("socket connected");
    });

    socket.on("inbox", (data) => {
      axios
        .get(`${process.env.API_HOSTNAME}/private-message/latest`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        .then((res) => {
          setChatPrivateMessages(res.data);
        });
    });

    axios
      .get(`${process.env.API_HOSTNAME}/private-message/latest`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((res) => {
        setChatPrivateMessages(res.data);
      });
  }, []);

  return (
    <div className='h-full max-w-[20rem] min-w-[20rem]'>
      <div className='flex justify-between items-center p-4'>
        <h1 className='text-2xl font-bold'>Messages</h1>
        <RiChatNewLine size={24} className='cursor-pointer' />
      </div>
      <div className=' w-full flex justify-center items-center p-4'>
        <Input
          id='search_chat'
          className='w-full'
          placeholder='Search chat...'
        />
      </div>
      <div className='flex flex-col my-2'>
        {chatPrivateMessages.map((private_message: IPrivateMessage, i) => {
          return <SidebarChat key={private_message.id} {...private_message} />;
        })}
      </div>
    </div>
  );
};

export default SideBar;
