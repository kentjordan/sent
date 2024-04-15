"use client";
import useAppState from "@/hooks/useAppState";
import { toggleFollowersDialog } from "@/redux/profile.slice";
import axios, { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoClose, IoPersonCircle } from "react-icons/io5";
import { useDispatch } from "react-redux";

interface IUserFollower {
  first_name: string;
  last_name: string;
  username: string;
  profile_photo: string | null;
}

interface IFollowersProps {
  username: string;
}

const Followers = ({ username }: IFollowersProps) => {
  const { accessToken } = useAppState();
  const [followers, setFollowers] = useState<Array<IUserFollower>>([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const getUserFollowers = async () => {
      try {
        const res = await axios.get(`${process.env.API_HOSTNAME}/followers/${username}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (res.status === 200) {
          setFollowers(res.data);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(error);
        }
      }
    };
    if (accessToken) getUserFollowers();
  }, [accessToken]);

  return (
    <div className="absolute z-10 flex h-full  w-full items-center justify-center bg-black/50">
      <div className="m-2 w-full max-w-xs rounded-md border bg-white p-2">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between border-b pb-1">
          <h1 className="font-bold">Followers</h1>
          <IoClose onClick={() => dispatch(toggleFollowersDialog(false))} className="cursor-pointer" size={20} />
        </div>
        {/* Followers */}
        <div className="max-h-96 overflow-auto">
          {followers.length <= 0 && <p>There is no followers. ☹️</p>}

          {followers.map((follower: IUserFollower, i: number) => {
            return (
              <div key={follower.username} className="flex items-center gap-x-2 p-2">
                {follower.profile_photo ? (
                  <Image
                    src={follower.profile_photo}
                    className="mr-1 h-10 w-10 rounded-full p-[2px]"
                    alt="Profile Photo"
                    width={24}
                    height={24}
                  />
                ) : (
                  <IoPersonCircle size={40} className="mr-1 rounded-full text-stone-300" />
                )}

                <Link
                  href={`/profile/${follower.username}`}
                  onClick={() => dispatch(toggleFollowersDialog(false))}
                  className="text-base font-medium"
                >
                  {follower.first_name} {follower.last_name}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Followers;
