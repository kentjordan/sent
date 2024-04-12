import useAppState from "@/hooks/useAppState";
import { toggleDeletePost } from "@/redux/profile.slice";
import { RootState } from "@/redux/store";
import axios, { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";

const DeletePost = () => {
  const dispatch = useDispatch();

  const { id, content } = useSelector((state: RootState) => state.profile.activePost);
  const { accessToken } = useAppState();

  return (
    <div className="absolute z-10 flex h-full w-full items-center justify-center bg-black/50">
      <div className="m-4 flex w-fit flex-col rounded-md bg-white p-4">
        <h1 className="text-xl font-bold">Delete post?</h1>
        <p className="my-2">This can’t be undone and it will be removed from your profile.</p>
        <div className="mt-8 flex flex-col gap-2">
          <button
            onClick={() => {
              const deleteUserPost = async () => {
                try {
                  const res = await axios.delete(`${process.env.API_HOSTNAME}/posts/${id}`, {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  });

                  if (res.status === 200) {
                    // Post deleted successfully
                    window.location.reload();
                  }
                } catch (error) {
                  if (error instanceof AxiosError) {
                    console.error(error.response);
                  }
                }
              };
              deleteUserPost();
            }}
            className="rounded-md bg-red-700 py-2 text-white"
          >
            Delete
          </button>
          <button className="rounded-md border py-2" onClick={() => dispatch(toggleDeletePost(false))}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePost;
;