"use client";
import { RiChatNewLine } from "react-icons/ri";
import SidebarChat from "./chat";
import { Input } from "../../ui/input";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import axios from "axios";
import { IPrivateMessage } from "../types";
import NewMessage from "./newMessage";
import { CiLogout } from "react-icons/ci";
import { useMutation } from "@tanstack/react-query";
import { PulseLoader } from "react-spinners";
import useAppState from "@/hooks/useAppState";
import useSentState from "@/hooks/useSentState";
import { useDispatch } from "react-redux";
import { toggleNewMessage } from "@/redux/sent.slice";
import useLogout from "@/hooks/useLogout";

const SideBar = () => {
  const [chatPrivateMessages, setChatPrivateMessages] = useState<IPrivateMessage[]>([]);

  const { user, accessToken } = useAppState();
  const { is_new_message_visible } = useSentState();
  const dispatch = useDispatch();
  const logout = useLogout();

  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async (access_token: string | undefined) =>
      axios.get(`${process.env.API_HOSTNAME}/private-message/latest`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }),
    onSuccess(res, variables, context) {
      setChatPrivateMessages(res.data);
    },
  });

  useEffect(() => {
    const socket = io(process.env.WS_GATEWAY_INBOX as string, {
      auth: {
        user_id: user?.id as string,
      },
      path: process.env.NODE_ENV === "production" ? "/sent/ws/socket.io" : "/socket.io",
    });

    socket.on("inbox", (data) => {
      mutateAsync(accessToken);
    });

    mutateAsync(accessToken);
  }, []);

  return (
    <div className="relative flex h-full w-full max-w-[800px] flex-col items-start overflow-auto border-x px-2">
      {is_new_message_visible ? (
        <NewMessage />
      ) : (
        <>
          <div className="flex w-full items-center justify-between px-3 py-6">
            <h1 className=" text-md flex text-xl font-bold">Messages</h1>
            <div className="z-10 flex justify-end">
              <RiChatNewLine onClick={() => dispatch(toggleNewMessage())} size={24} className="cursor-pointer" />
            </div>
          </div>
          {/* <div className=' w-full flex justify-center items-center p-4'>
            <Input
              id='search_chat'
              className='w-full'
              placeholder='Search chat...'
            />
          </div> */}

          {chatPrivateMessages.length <= 0 && isPending ? (
            <div className="flex h-full w-full flex-col items-center justify-center  px-2">
              <PulseLoader size={8} />
            </div>
          ) : null}
          {chatPrivateMessages.length <= 0 && isSuccess ? (
            <div className="mt-[-64px]  flex h-full w-full flex-wrap items-center justify-center px-2">
              <span className="text-center text-xs">
                Click
                <RiChatNewLine size={18} className="mx-2 inline-block cursor-pointer text-stone-500" />
                above to start messaging
              </span>
            </div>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-start overflow-y-auto">
              {chatPrivateMessages.map((private_message: IPrivateMessage, i) => {
                return <SidebarChat key={private_message.id} {...private_message} />;
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SideBar;
