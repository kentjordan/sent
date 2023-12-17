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
  const { handleSubmit, register } = useForm<{ message: string }>();
  const [messages, setMessages] = useState<IMessage[]>([]);

  const user = useGlobalStore((state) => state.user);
  const active_chat = useGlobalStore((state) => state.active_chat);

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
          `http://localhost:3001/private-message/${active_chat.chat_id}`
        );
        setMessages(res.data);
      });

      // Initialize messages on UI
      const res = await axios.get(
        `http://localhost:3001/private-message/${active_chat.chat_id}`
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
    <div className='flex-1 flex flex-col w-full max-h-screen'>
      <div className='bg-white w-full shadow-md p-4'>
        <h1 className='text-2xl font-bold'>
          {active_chat.first_name} {active_chat.last_name}
        </h1>
      </div>
      <div
        id='compose_message'
        className='flex flex-col p-2 overflow-y-scroll h-full scroll-smooth'>
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
            })
          );
        })}
        className='flex items-center p-4'>
        <RiImageAddFill size={34} className='cursor-pointer' />
        <div className='flex-1 mx-4'>
          <Textarea
            {...register("message")}
            placeholder='Type your message here...'
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
            className='resize-none wrap'
          />
        </div>
        <button className='flex justify-center items-center font-bold bg-slate-800 rounded-full text-white cursor-pointer'>
          <TbSend className='m-4' size={34} />
        </button>
      </form>
    </div>
  );
};

export default ComposeMessage;
