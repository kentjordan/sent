"use client";
import Image from "next/image";

const ChatBubble = ({
  position,
  message,
}: {
  position: "start" | "end";
  message: string;
}) => {
  return (
    <div
      style={{
        justifyContent: position,
      }}
      className={`flex w-full`}
    >
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
    </div>
  );
};

export default ChatBubble;
