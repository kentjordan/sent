import { toggleSendMessage } from "@/redux/profile.slice";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

import { BiMessageRounded } from "react-icons/bi";
import useProfileState from "@/hooks/useProfileState";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import useAppState from "@/hooks/useAppState";

const NewMessage = () => {
  const { handleSubmit, register } = useForm<{ message: string }>();
  const dispatch = useDispatch();

  const { activeProfile } = useProfileState();
  const { accessToken } = useAppState();

  const { mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async (data: { message: string; receiverId: string }) =>
      axios.post(`${process.env.API_HOSTNAME}/sent/send-message`, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
  });

  useEffect(() => {
    if (isSuccess) {
      dispatch(toggleSendMessage());
    }
  }, [isSuccess]);

  return (
    <div className="absolute z-10 flex h-full w-full justify-center bg-black/50 sm:p-8">
      <div className="flex w-full max-w-[40rem] flex-col justify-between bg-white p-4 text-black sm:rounded-lg">
        <div className="flex h-full flex-col justify-between">
          <div>
            <div className="mx-2 mb-4 flex items-center justify-between">
              <BiMessageRounded size={24} />
              <h1 className="text-sm font-bold md:text-base">Send a message</h1>
              <IoClose onClick={() => dispatch(toggleSendMessage())} className="cursor-pointer" size={24} />
            </div>
          </div>
          <form
            className="flex flex-col"
            onSubmit={handleSubmit(async (data) => {
              if (activeProfile.userId) {
                mutateAsync({ ...data, receiverId: activeProfile.userId });
              }
            })}
          >
            <div className="my-4 flex items-center">
              <h1 className="text-center text-sm md:text-base">
                To:{" "}
                <b>
                  {activeProfile.first_name} {activeProfile.last_name}
                </b>
              </h1>
            </div>
            <Textarea
              {...register("message")}
              className="min-h-[200px] resize-none text-sm"
              placeholder="Type a message..."
            ></Textarea>
            {isPending ? (
              <Button disabled className="mt-8" type="submit">
                Sending...
              </Button>
            ) : (
              <Button className="mt-8" type="submit">
                Send
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewMessage;
