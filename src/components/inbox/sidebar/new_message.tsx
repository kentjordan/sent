"use client";
import { Input } from "@/components/ui/input";
import useGlobalStore from "@/zustand/store.global";
import axios from "axios";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import { PulseLoader } from "react-spinners";

const NewMessage = () => {
  const toggleNewMessage = useGlobalStore((state) => state.toggleNewMessage);

  const [foundUsers, setFounderUsers] = useState<
    Array<{ id: string; first_name: string; last_name: string }>
  >([]);

  const [isSearching, setIsSearching] = useState<boolean>(false);

  const setActiveChat = useGlobalStore((state) => state.setActiveChat);
  const user = useGlobalStore((state) => state.user);
  const access_token = useGlobalStore((state) => state.access_token);

  return (
    <div className="h-full w-full p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">New Message</h1>
        <div onClick={toggleNewMessage}>
          <IoClose className="cursor-pointer" size={24} />
        </div>
      </div>
      <div className=" my-8 flex w-full items-center justify-center">
        <Input
          onInput={(target) => {
            const q = target.currentTarget.value;

            if (q.length <= 0) {
              setIsSearching(false);
              return;
            }

            const findPerson = async () => {
              setIsSearching(true);
              const res = await axios.get(
                `${process.env.API_HOSTNAME}/users/search?q=${q}`,
              );
              setFounderUsers(res.data);
              setIsSearching(false);
            };
            findPerson();
          }}
          id="search_chat"
          className="w-full"
          placeholder="Find person (email or name)"
        />
      </div>
      <div className="flex min-h-[12px] w-full items-center justify-center">
        {isSearching && <PulseLoader size={8} />}
      </div>
      <div className="flex w-full flex-col">
        {foundUsers.map((e, i) => {
          return (
            <div
              onClick={async () => {
                try {
                  const res = await axios.post<{
                    created_at: Date;
                    first_name: string;
                    last_name: string;
                    chat_id: string;
                    user0_id: string;
                    user1_id: string;
                  }>(
                    `${process.env.API_HOSTNAME}/chats/initialize`,
                    {
                      friend_id: e.id,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${access_token}`,
                      },
                    },
                  );

                  setActiveChat({
                    is_visible: true,
                    chat_id: res.data.chat_id,
                    friend_id: res.data.user1_id,
                    first_name: res.data.first_name,
                    last_name: res.data.last_name,
                  });
                } catch (error) {
                  console.log(error);
                }
              }}
              key={e.id}
              className="my-2 flex flex-1 cursor-pointer items-center justify-start p-2 "
            >
              <Image
                width={40}
                height={40}
                alt="profile photo"
                src={"https://picsum.photos/56/56"}
                className="h-12 w-12 rounded-full"
              />
              <h1 className="mx-4 font-normal">
                {e.first_name} {e.last_name}
              </h1>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewMessage;
