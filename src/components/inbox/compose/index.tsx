"use client";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Textarea } from "../../ui/textarea";
import { TbSend } from "react-icons/tb";
import ChatBubble from "./messageBubble";
import axios from "axios";
import { Socket, io } from "socket.io-client";
import { IMessage } from "../types";
import { useMutation } from "@tanstack/react-query";
import { PulseLoader } from "react-spinners";
import useAppState from "@/hooks/useAppState";
import useSentState from "@/hooks/useSentState";
import { GoLinkExternal } from "react-icons/go";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { useDispatch } from "react-redux";
import { setActiveChat } from "@/redux/sent.slice";

let socket: Socket;
const textLineHieght = 24;

const ComposeMessage = () => {
  const [composeInputHeight, setComposeInputHeight] = useState(textLineHieght);
  const { handleSubmit, register, reset } = useForm<{ message: string }>();
  const [messages, setMessages] = useState<IMessage[]>([]);

  const { user, accessToken } = useAppState();
  const { active_chat } = useSentState();
  const form_message = useRef<HTMLFormElement>(null);

  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async () =>
      axios.get<IMessage[]>(`${process.env.API_HOSTNAME}/private-message/chat/${active_chat.friend_id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
  });

  const dispatch = useDispatch();

  useEffect(() => {
    socket = io(process.env.WS_GATEWAY_CHAT as string, {
      auth: {
        user_id: user?.id as string,
        friend_id: active_chat.friend_id as string,
      },
      path: process.env.NODE_ENV === "production" ? "/sent/ws/socket.io" : "/socket.io",
    });

    const init = async () => {
      socket.on("receive_message", async (data: any) => {
        const res = await axios.get<IMessage[]>(
          `${process.env.API_HOSTNAME}/private-message/chat/${active_chat.friend_id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        setMessages(res.data);
      });

      // Initialize messages on UI
      const res = await mutateAsync();

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

  const router = useRouter();

  const onCloseChatCompose = () => {
    dispatch(
      setActiveChat({
        is_visible: false,
        chat_id: undefined,
        first_name: "",
        last_name: "",
        friend_id: undefined,
        message_id: undefined,
        username: undefined,
      }),
    );
  };
  return (
    <div className="fixed z-50 flex h-full max-h-screen w-full flex-1 flex-col bg-white">
      <div className="flex w-full flex-col justify-center border-b bg-white p-2">
        <div className="flex items-center">
          <IoIosArrowBack className="cursor-pointer" size={32} onClick={onCloseChatCompose} />
          <div className="ml-6">
            <h1 className="text-base font-bold">
              {active_chat.first_name} {active_chat.last_name}
            </h1>
            <div
              onClick={() => router.replace(`/profile/${active_chat.username}`)}
              className="flex cursor-pointer items-center"
            >
              <p className="text-sm">Visit profile</p>
              <GoLinkExternal className="mx-2" size={16} />
            </div>
          </div>
        </div>
      </div>
      <div id="compose_message" className="flex h-full flex-col overflow-y-scroll scroll-smooth p-2">
        {isPending && (
          <div className="flex h-full w-full items-center justify-center">
            <PulseLoader size={8} />
          </div>
        )}
        {isSuccess &&
          messages
            .map((e, i) => {
              const position = e.user0_id !== user?.id ? "start" : "end";
              return <ChatBubble key={e.id} {...{ position, ...e }} />;
            })
            .reverse()}
      </div>
      <form
        ref={form_message}
        onSubmit={handleSubmit((data) => {
          if (data.message.trim().length > 0) {
            socket.emit(
              "send-private-message",
              JSON.stringify({
                ...data,
                user0_id: user?.id,
                user1_id: active_chat.friend_id,
              }),
            );
            reset();
          }
        })}
        className="flex items-center p-4"
      >
        {/* <RiImageAddFill size={34} className='cursor-pointer' /> */}
        <div className="flex-1">
          <Textarea
            {...register("message")}
            className="wrap resize-none p-2 text-sm"
            placeholder="Type a message..."
            onKeyDown={(event) => {
              const height = event.currentTarget.scrollHeight;

              if (composeInputHeight < 128) {
                setComposeInputHeight(height);
              }

              if (event.currentTarget.value.trim().length <= 0) {
                setComposeInputHeight(textLineHieght);
              }

              if (event.key === "Enter" && event.currentTarget.value.trim().length <= 0) {
                event.preventDefault();
                return;
              }

              if (event.key === "Enter" && !event.shiftKey) {
                handleSubmit((data) => {
                  socket.emit(
                    "send-private-message",
                    JSON.stringify({
                      ...data,
                      user0_id: user?.id,
                      user1_id: active_chat.friend_id,
                    }),
                  );
                })();
                reset();
                event.preventDefault();
              }
            }}
            style={{
              height: composeInputHeight,
            }}
          />
        </div>
        <button className="flex cursor-pointer items-center justify-center font-bold text-slate-800">
          <TbSend className="ml-3" size={28} />
        </button>
      </form>
    </div>
  );
};

export default ComposeMessage;
