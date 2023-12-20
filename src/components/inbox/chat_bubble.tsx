"use client";
import Image from "next/image";
import { IMessage } from "./types";
import { getMessageTime } from "@/lib/inbox";

const ChatBubble = ({
  position,
  message,
  created_at,
}: {
  position: "start" | "end";
} & IMessage) => {
  return (
    <div
      style={{
        justifyContent: position,
      }}
      className=" my-2 flex w-full "
    >
      <div className="group flex items-center">
        {position === "end" ? (
          <span className="hidden w-fit text-[11px] text-stone-500 group-hover:flex">
            {getMessageTime(created_at)}
          </span>
        ) : null}
        <div className="flex items-center">
          {position === "start" ? (
            <Image
              width={40}
              height={40}
              alt="profile photo"
              src={"https://picsum.photos/56/56"}
              className="h-10 w-10 rounded-full"
            />
          ) : null}
          <div className="m-2 flex max-w-md items-center rounded-xl bg-slate-700 p-3 text-white">
            <p className="break-all text-sm">{message}</p>
          </div>
          {position === "end" ? (
            <Image
              width={40}
              height={40}
              alt="profile photo"
              src={"https://picsum.photos/40/40"}
              className="h-10 w-10 rounded-full"
            />
          ) : null}
        </div>
        {position === "start" ? (
          <span className="hidden w-fit text-[11px] text-stone-500 group-hover:flex">
            {getMessageTime(created_at)}
          </span>
        ) : null}
      </div>{" "}
    </div>
  );
};

export default ChatBubble;
