"use client";
import { IMessage } from "../types";
import { getMessageTime } from "@/lib/inbox";

interface IMessageBuble extends IMessage {
  position: "start" | "end";
}

const MessageBubble = ({ position, message, created_at }: IMessageBuble) => {
  return (
    <div
      style={{
        justifyContent: position,
      }}
      className=" my-2 flex w-full cursor-default"
    >
      <div className={`group group flex flex-col ${position === "end" ? "items-end" : "items-start"}`}>
        <div className="flex items-center">
          <div
            className={`m-2 flex max-w-xs items-center rounded-xl p-3 md:max-w-md ${
              position === "end" ? "bg-slate-700 text-white" : `bg-stone-200 text-black`
            }`}
          >
            <p className="break-all text-sm">{message}</p>
          </div>
        </div>
        <span className=" mx-2 hidden w-fit text-[11px] text-stone-500 group-hover:flex">
          {getMessageTime(created_at)}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
