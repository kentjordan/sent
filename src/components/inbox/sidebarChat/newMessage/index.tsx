"use client";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import { PulseLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { toggleNewMessage, setActiveChat } from "@/redux/sent.slice";
import useAppState from "@/hooks/useAppState";
import FoundUser from "./foundUser";

interface IFoundUser {
  id: string;
  first_name: string;
  last_name: string;
}

let debounceTimerId: any;
let DEBOUNCE_TIMEOUT: number = 800;

const NewMessage = () => {
  const dispatch = useDispatch();
  const [foundUsers, setFounderUsers] = useState<Array<IFoundUser>>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  return (
    <div className="h-full w-full p-4 pl-8 sm:py-3">
      <div className="flex items-center justify-between">
        <h1 className="text-md flex font-bold md:text-xl">New Message</h1>
        <div onClick={() => dispatch(toggleNewMessage())}>
          <IoClose className="cursor-pointer" size={24} />
        </div>
      </div>
      <div className=" my-6 flex w-full items-center justify-center">
        <Input
          id="search_chat"
          className="w-full text-sm"
          placeholder="Find person (email or name)"
          onInput={(target) => {
            const q = target.currentTarget.value;

            if (q.length <= 0) {
              setIsSearching(false);
              return;
            }

            setIsSearching(true);

            const findPerson = async () => {
              const res = await axios.get(`${process.env.API_HOSTNAME}/users/search?q=${q}`);
              setFounderUsers(res.data);
              setIsSearching(false);
            };

            clearTimeout(debounceTimerId);

            debounceTimerId = setTimeout(() => {
              findPerson();
            }, DEBOUNCE_TIMEOUT);
          }}
        />
      </div>
      <div className="mb-1 flex min-h-[12px] w-full items-center justify-center">
        {isSearching && <PulseLoader size={8} />}
      </div>
      <div className="flex w-full flex-col">
        {foundUsers.map((e, i) => {
          return <FoundUser key={e.id} {...e} />;
        })}
      </div>
    </div>
  );
};

export default NewMessage;
