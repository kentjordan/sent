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
      className={`flex w-full`}>
      <div className='flex items-start'>
        {position === "start" ? (
          <Image
            width={40}
            height={40}
            alt='profile photo'
            src={"https://picsum.photos/56/56"}
            className='rounded-full h-12 w-12 m-2'
          />
        ) : null}
        <div className='m-2 p-4 rounded-3xl max-w-md bg-slate-700 flex text-white items-center'>
          <p className='break-all'>{message}</p>
        </div>
        {position === "end" ? (
          <Image
            width={40}
            height={40}
            alt='profile photo'
            src={"https://picsum.photos/40/40"}
            className='rounded-full h-12 w-12 m-2'
          />
        ) : null}
      </div>
    </div>
  );
};

export default ChatBubble;
