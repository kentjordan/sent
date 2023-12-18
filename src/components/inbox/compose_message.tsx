"use client";
import { useEffect, useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { TbSend } from "react-icons/tb";
import { RiImageAddFill } from "react-icons/ri";
import ChatBubble from "./chat_bubble";
import axios from "axios";
import { Socket, io } from "socket.io-client";
import useGlobalStore from "@/zustand/store.global";

interface IMessage {
  id: string;
  created_at: string;
  updated_at: string;
  message: string;
  chat_id: string;
  user0_id: string;
  user1_id: string;
  is_seen: boolean;
}

let socket: Socket;

const ComposeMessage = () => {
  const textLineHieght = 24;
  const [composeInputHeight, setComposeInputHeight] = useState(textLineHieght);
  const { handleSubmit, register, reset } = useForm<{ message: string }>();
  const [messages, setMessages] = useState<IMessage[]>([]);

  const user = useGlobalStore((state) => state.user);
  const active_chat = useGlobalStore((state) => state.active_chat);
  const access_token = useGlobalStore((state) => state.access_token);

  useEffect(() => {
    socket = io(process.env.WS_GATEWAY_CHAT as string, {
      auth: {
        user_id: user.id as string,
        friend_id: active_chat.friend_id as string,
      },
    });

    const init = async () => {
      socket.on("receive_message", async (data: any) => {
        const res = await axios.get<IMessage[]>(
          `${process.env.API_HOSTNAME}/private-message/chat/${active_chat.friend_id}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          },
        );
        setMessages(res.data);
      });

      // Initialize messages on UI
      const res = await axios.get(
        `${process.env.API_HOSTNAME}/private-message/chat/${active_chat.friend_id}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
      setMessages(res.data);
    };
    init();

    return () => {
      socket.close();
    };
  }, [active_chat.chat_id]);

  useEffect(() => {
    const ref = document.getElementById("compose_message") as HTMLElement;
    ref.scrollTo(0, ref.scrollHeight);
  }, [messages]);

  return (
    <div className="flex max-h-screen w-full flex-1 flex-col">
      <div className="flex w-full justify-center border-b bg-white p-4">
        <h1 className="text-lg font-bold">
          {active_chat.first_name} {active_chat.last_name}
        </h1>
      </div>
      <div
        id="compose_message"
        className="flex h-full flex-col overflow-y-scroll scroll-smooth p-2"
      >
        {messages
          .map((e, i) => {
            const position = e.user0_id !== user.id ? "start" : "end";
            return (
              <ChatBubble key={e.id} position={position} message={e.message} />
            );
          })
          .reverse()}
      </div>
      <form
        onSubmit={handleSubmit((data) => {
          socket.emit(
            "send-private-message",
            JSON.stringify({
              ...data,
              user0_id: user.id,
              user1_id: active_chat.friend_id,
            }),
          );
          reset();
        })}
        className="flex items-center p-4"
      >
        {/* <RiImageAddFill size={34} className='cursor-pointer' /> */}
        <div className="flex-1">
          <Textarea
            {...register("message")}
            className="wrap resize-none p-2 text-sm"
            placeholder="Type your message here..."
            onChange={(target) => {
              const height = target.currentTarget.scrollHeight;

              if (composeInputHeight < 128) {
                setComposeInputHeight(height);
              }

              if (target.currentTarget.value.length <= 0) {
                setComposeInputHeight(textLineHieght);
              }
            }}
            style={{
              height: composeInputHeight,
            }}
          />
        </div>
        <button className="flex cursor-pointer items-center justify-center  font-bold text-slate-800">
          <TbSend className="m-2" size={28} />
        </button>
      </form>
    </div>
  );
};

export default ComposeMessage;
