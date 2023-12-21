"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { BiMessageRounded } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { toggleSendMessage, toggleEditProfile } from "@/redux/profile.slice";

const MAX_CHAR_LENGTH = "56ch";

const ProfileContainer = () => {
  const dispatch = useDispatch();

  return (
    <div className="min-h-full w-full max-w-[56rem] border-l border-r border-l-stone-200 border-r-stone-200">
      <div className="h-40 w-full bg-stone-300"></div>
      <div className="flex items-start justify-between border-b p-3 sm:px-6 sm:py-4">
        <div>
          <Image
            className="mt-[-64px] rounded-full sm:h-32 sm:w-32"
            src="https://picsum.photos/500/500"
            alt={"Profile Photo"}
            width={96}
            height={96}
          />

          <h1 className="mt-4 text-xl font-bold">Kent Jordan</h1>
          <p
            className={`line-clamp-4 sm:line-clamp-2 max-w-[${MAX_CHAR_LENGTH}] my-2 text-sm`}
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
            tempora natus aspernatur id dolor hic
          </p>
        </div>
        <div className="flex items-center">
          <Button
            onClick={() => dispatch(toggleSendMessage())}
            className="mr-2 flex h-fit items-center justify-center rounded-full bg-slate-800 p-2"
          >
            <BiMessageRounded
              className="cursor-pointer"
              color="white"
              size={22}
            />
          </Button>
          <Button
            onClick={() => dispatch(toggleEditProfile())}
            className="flex h-fit items-center justify-center rounded-full bg-slate-800 px-3 py-2"
          >
            <p className="text-white">Edit profile</p>
          </Button>
        </div>
      </div>
      <div className="flex h-56 items-center justify-center">
        <h1>No posts yet</h1>
      </div>
    </div>
  );
};

export default ProfileContainer;
