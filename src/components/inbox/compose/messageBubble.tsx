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
      className=" my-2 flex w-full "
    >
      <div className="group flex items-center">
        {/* My Message */}
        {position === "end" ? (
          <span className="hidden w-fit text-[11px] text-stone-500 group-hover:flex">{getMessageTime(created_at)}</span>
        ) : null}
        <div className="flex items-center">
          <div
            className={`m-2 flex max-w-md items-center rounded-xl p-3 ${
              position === "end" ? "bg-slate-700 text-white" : `bg-stone-200 text-black`
            }`}
          >
            <p className="break-all text-sm">{message}</p>
          </div>
        </div>
        {/* Friend's Message */}
        {position === "start" ? (
          <span className="hidden w-fit text-[11px] text-stone-500 group-hover:flex">{getMessageTime(created_at)}</span>
        ) : null}
      </div>
    </div>
  );
};

export default MessageBubble;
