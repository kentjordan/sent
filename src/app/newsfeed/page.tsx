"use client";
import PageLoading from "@/components/PageLoading";
import Post, { IPost } from "@/components/profile/Post";
import withAuth from "@/hoc/withAuth";
import useAppState from "@/hooks/useAppState";
import { setActivePath } from "@/redux/app.slice";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Newsfeed = () => {
  const dispatch = useDispatch();

  const [isPageLoading, setIsPageLoading] = useState(true);
  const { accessToken } = useAppState();

  const [newsfeed, setNewsfeed] = useState<Array<IPost>>([]);

  useEffect(() => {
    const getNewsfeed = async () => {
      try {
        const res = await axios.get(`${process.env.API_HOSTNAME}/newsfeed`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setIsPageLoading(false);
        setNewsfeed(res.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(error);
        }
      }
    };

    if (accessToken) getNewsfeed();

    dispatch(setActivePath("/newsfeed"));
  }, [accessToken]);

  if (isPageLoading) return <PageLoading />;
  return (
    <div className="flex h-full w-full flex-col items-center justify-start">
      <div className="h-fit w-full max-w-[56rem] border-l border-r border-l-stone-200 border-r-stone-200">
        <div className="border-b p-4">
          <h1 className="text-xl font-bold">Feed</h1>
        </div>
        {newsfeed.length <= 0 && (
          <div className="flex justify-center">
            <h1 className="m-4">Follow some people you know to get updates from them.</h1>
          </div>
        )}
        {newsfeed.map((post: IPost, i: number) => {
          return (
            <Post
              username={post.username}
              key={post.post_id}
              first_name={post.first_name}
              last_name={post.last_name}
              content={post.content}
              created_at={post.created_at}
              user_id={post.user_id}
              profile_photo={post.profile_photo}
              post_id={post.post_id}
            />
          );
        })}
      </div>
    </div>
  );
};

export default withAuth(Newsfeed);
