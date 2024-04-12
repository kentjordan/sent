import { IoMdClose } from "react-icons/io";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import useAppState from "@/hooks/useAppState";
import { PulseLoader } from "react-spinners";

interface ICreatePost {
  setVisibility: Dispatch<SetStateAction<boolean>>;
}

const CreatePost = ({ setVisibility }: ICreatePost) => {
  const { register, handleSubmit } = useForm();
  const { accessToken } = useAppState();
  const [isPosting, setIsPosting] = useState(false);

  const onSubmit = handleSubmit(
    (data) => {
      const postUserContent = async () => {
        try {
          setIsPosting(true);
          const res = await axios.post(`${process.env.API_HOSTNAME}/posts`, data, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          if (res.status === 201) {
            // Post created successfully
            window.location.reload();
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            console.error(error.response);
          }
        }
      };

      postUserContent();
    },
    (error) => {
      if (error["content"]?.type === "required") {
        alert("Can't post with empty content.");
      }
    },
  );

  return (
    <div className="absolute flex h-full w-full items-center justify-center bg-black/50">
      <div className="flex flex-col rounded-md border border-stone-300 bg-white p-3">
        <div className="mb-4 flex justify-between border-b pb-2">
          <h1 className="font-bold">Post</h1>
          <IoMdClose className="cursor-pointer" size={24} onClick={() => setVisibility(false)}>
            Close
          </IoMdClose>
        </div>
        <form className="flex flex-col" onSubmit={onSubmit}>
          <textarea
            {...register("content", { required: true })}
            rows={8}
            className="resize-none p-2 sm:w-[500px]"
            placeholder="What's happening?"
          />
          <div className="w-full">
            <button
              disabled={isPosting}
              type="submit"
              className="mt-4 w-full rounded-md bg-slate-800 p-2 font-bold text-white"
            >
              {isPosting ? <PulseLoader size={8} color="white" /> : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
