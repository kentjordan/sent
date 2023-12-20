"use client";
import { RiChatNewLine } from "react-icons/ri";
import SidebarChat from "./chat";
import { Input } from "../../ui/input";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import axios from "axios";
import { IPrivateMessage } from "../types";
import useGlobalStore, { initial_state } from "@/zustand/store.global";
import NewMessage from "./new_message";
import { useRouter } from "next/navigation";
import { CiLogout } from "react-icons/ci";

const SideBar = () => {
  const [chatPrivateMessages, setChatPrivateMessages] = useState<
    IPrivateMessage[]
  >([]);
  const user = useGlobalStore((state) => state.user);
  const is_new_message_visible = useGlobalStore(
    (state) => state.is_new_message_visible,
  );
  const toggleNewMessage = useGlobalStore((state) => state.toggleNewMessage);
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

  const router = useRouter();
  const resetState = useGlobalStore((state) => state.resetState);

  return (
    <div className="relative flex h-full flex-col items-start p-0 sm:pr-4 sm:pt-4 md:min-w-[24rem] md:max-w-[24rem]">
      {is_new_message_visible ? (
        <NewMessage />
      ) : (
        <>
          <div className="mb-4 flex w-full items-center justify-between sm:py-0">
            <h1 className=" text-md ml-8 hidden font-bold sm:flex md:text-xl">
              Messages
            </h1>
            <div className="z-10 m-4 flex w-full justify-center sm:justify-end">
              <RiChatNewLine
                onClick={toggleNewMessage}
                size={24}
                className="cursor-pointer"
              />
            </div>
          </div>
          {/* <div className=' w-full flex justify-center items-center p-4'>
            <Input
              id='search_chat'
              className='w-full'
              placeholder='Search chat...'
            />
          </div> */}
          {chatPrivateMessages.length <= 0 ? (
            <div className="mt-[-64px]  flex h-full w-full flex-wrap items-center justify-center px-2">
              <span className="text-center text-xs">
                Click
                <RiChatNewLine
                  size={18}
                  className="mx-2 inline-block cursor-pointer text-stone-500"
                />
                above to start messaging
              </span>
            </div>
          ) : (
            <div className="flex w-full flex-col items-start px-2">
              {chatPrivateMessages.map(
                (private_message: IPrivateMessage, i) => {
                  return (
                    <SidebarChat
                      key={private_message.id}
                      {...private_message}
                    />
                  );
                },
              )}
            </div>
          )}
          <div
            onClick={() => {
              const logout = async () => {
                resetState(initial_state);
                await axios.get(`${process.env.API_HOSTNAME}/auth/logout`, {
                  withCredentials: true,
                });
                router.replace("/login");
              };
              logout();
            }}
            className="absolute bottom-0 flex w-full cursor-pointer flex-col items-center justify-center bg-stone-200 py-4 sm:hidden"
          >
            <CiLogout size={24} />
          </div>
        </>
      )}
    </div>
  );
};

export default SideBar;
