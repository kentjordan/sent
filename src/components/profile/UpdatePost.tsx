import useAppState from "@/hooks/useAppState";
import { toggleUpdatePost } from "@/redux/profile.slice";
import { RootState } from "@/redux/store";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { PulseLoader } from "react-spinners";

const UpdatePost = () => {
  const { register, handleSubmit } = useForm();
  const { id, content } = useSelector((state: RootState) => state.profile.activePost);

  const dispatch = useDispatch();
  const [isPostUpdating, setIsPostUpdating] = useState(false);

  const { accessToken } = useAppState();

  const onSubmit = (e: any) => {
    handleSubmit(
      (data) => {
        const updateUserPost = async () => {
          setIsPostUpdating(true);
          const res = await axios.patch(`${process.env.API_HOSTNAME}/posts/${id}`, data, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (res.status === 200) {
            // Post updated successfully
            window.location.reload();
          }
        };
        updateUserPost();
      },
      (error) => {
        if (error["content"]?.type === "required") {
          alert("Can't update post with empty content.");
        }
      },
    )(e);
  };

  return (
    <div className="absolute z-10 flex h-full w-full items-center justify-center bg-black/50">
      <div className="flex w-fit flex-col rounded-md bg-white p-4">
        <div className="mb-4 flex justify-between border-b pb-2">
          <h1 className="font-bold">Update post</h1>
          <IoMdClose className="cursor-pointer" size={24} onClick={() => dispatch(toggleUpdatePost(false))}>
            Close
          </IoMdClose>
        </div>
        <textarea
          {...register("content", { required: true })}
          className="mb-4 h-64 resize-none p-2 sm:w-[500px]"
          defaultValue={content}
        ></textarea>
        <button disabled={isPostUpdating} onClick={onSubmit} className="rounded-md bg-slate-800 p-2 text-white">
          {isPostUpdating ? <PulseLoader size={8} color="white" /> : "Update"}
        </button>
      </div>
    </div>
  );
};

export default UpdatePost;
