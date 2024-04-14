"use client";
import PageLoading from "@/components/PageLoading";
import { setActivePath } from "@/redux/app.slice";
import { useState, useLayoutEffect, useEffect } from "react";
import { useDispatch } from "react-redux";
import { IoPersonCircle, IoSearch } from "react-icons/io5";
import withAuth from "@/hoc/withAuth";
import axios, { AxiosError } from "axios";
import useAppState from "@/hooks/useAppState";
import Link from "next/link";
import Image from "next/image";
import { SlUserFollowing } from "react-icons/sl";
import { IoPersonSharp } from "react-icons/io5";

export interface IUser {
  user_id: string;
  first_name: string;
  last_name: string;
  bio: string | null;
  username: string;
  profile_photo: string | null;
  followers_count: null | number;
}

let timeout_id: NodeJS.Timeout;
const timeout = 500; // milli-seconds

const Search = () => {
  const dispatch = useDispatch();
  const { accessToken } = useAppState();

  const [isPageLoading, setIsPageLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined);

  const [searchedUsers, setSearchedUsers] = useState<Array<IUser>>([]);

  useEffect(() => {
    dispatch(setActivePath("/search"));
    setIsPageLoading(false);
  }, []);

  useEffect(() => {
    const search = async () => {
      try {
        const res = await axios.get(`${process.env.API_HOSTNAME}/users/search?q=${searchQuery}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setSearchedUsers(res.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(error);
        }
      }
    };
    search();
  }, [searchQuery]);

  if (isPageLoading) return <PageLoading />;
  return (
    <div className="flex w-full justify-center overflow-auto">
      <div className="px-2">
        <div className="mb-8 mt-12 flex h-fit min-w-[300px] items-center gap-x-2">
          <input
            onChange={(e) => {
              clearTimeout(timeout_id);
              timeout_id = setTimeout(() => {
                setSearchQuery(e.target.value);
              }, timeout);
            }}
            className="stone-300 w-full rounded-lg border p-2 outline-slate-800"
            type="text"
            placeholder="Search user"
          />
        </div>
        {searchQuery && (
          <div>
            <p>Search results</p>
            {searchedUsers.map((user: IUser) => {
              return (
                <div key={user.user_id} className="my-2 flex rounded-md border px-4 py-3">
                  {user.profile_photo ? (
                    <Image
                      src={user.profile_photo}
                      className="mr-4 h-8 w-8 rounded-full sm:h-12 sm:w-12"
                      alt="Profile Photo"
                      width={64}
                      height={64}
                    />
                  ) : (
                    <div>
                      <IoPersonCircle className="mr-4 h-10 w-10 rounded-full text-stone-300 sm:h-14 sm:w-14" />
                    </div>
                  )}
                  <div>
                    <div className="flex flex-col">
                      <Link href={`/profile/${user.username}`} className="text-sm font-bold">
                        {user.first_name} {user.last_name}
                      </Link>
                      <div className="mt-2 flex items-center gap-x-2">
                        <IoPersonSharp className="text-stone-500" size={12} />
                        <p className="text-xs text-stone-500">
                          {user.followers_count ? user.followers_count : 0} followers
                        </p>
                      </div>
                      {user.bio ? (
                        <p className="mt-3 max-w-[24ch] overflow-hidden text-ellipsis text-xs text-stone-500">
                          {user.bio}
                        </p>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(Search);
