import { toggleSendMessage } from "@/redux/profile.slice";
import React from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";

import { BiMessageRounded } from "react-icons/bi";
import { toggleNewMessage } from "@/redux/sent.slice";

const NewMessage = () => {
  const { handleSubmit, register } = useForm();
  const dispatch = useDispatch();
  return (
    <div className="absolute flex h-full w-full justify-center bg-black/50  sm:py-2">
      <div className="flex w-full max-w-[40rem] flex-col justify-between bg-white p-4 text-black sm:rounded">
        <div className="flex h-full flex-col justify-between">
          <div>
            <div className="mx-2 mb-4 flex items-center justify-between">
              <BiMessageRounded size={24} />
              <h1 className="text-sm font-bold md:text-base">Send a message</h1>
              <IoClose
                onClick={() => dispatch(toggleSendMessage())}
                className="cursor-pointer"
                size={24}
              />
            </div>
          </div>
          <form>
            <div className="my-4 flex items-center">
              <h1 className="text-center text-sm md:text-base">
                To: <b>Kent Jordan</b>
              </h1>
            </div>
            <Textarea
              className="min-h-[200px] resize-none text-sm"
              placeholder="Type a message..."
            ></Textarea>
          </form>
        </div>
        <Button className="mt-8" type="submit">
          Send
        </Button>
      </div>
    </div>
  );
};

export default NewMessage;
