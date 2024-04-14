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

interface IUser {
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
  }, [searchedUsers]);

  if (isPageLoading) return <PageLoading />;
  return (
    <div className="flex w-full justify-center overflow-auto">
      <div>
        <div className="mb-8 mt-12 flex h-fit min-w-[300px] items-center gap-x-2">
          <input
            onChange={(e) => {
              clearTimeout(timeout_id);
              timeout_id = setTimeout(() => {
                setSearchQuery(e.target.value);
              }, timeout);
            }}
            className="w-full rounded-lg border border-slate-800 p-2 outline-slate-800"
            type="text"
            placeholder="Search user"
          />
        </div>
        {searchQuery && (
          <div className="p-8">
            <p>Search results</p>
            {searchedUsers.map((user: IUser) => {
              return (
                <div key={user.user_id} className="my-3 flex rounded-md border p-6">
                  {user.profile_photo ? (
                    <Image
                      src={user.profile_photo}
                      className="mr-6 h-8 w-8 rounded-full sm:h-12 sm:w-12"
                      alt="Profile Photo"
                      width={500}
                      height={500}
                    />
                  ) : (
                    <IoPersonCircle className="mr-6 h-12 w-12 rounded-full text-stone-300" />
                  )}
                  <div>
                    <div className="flex flex-col">
                      <Link href={`/profile/${user.username}`} className="font-bold">
                        {user.first_name} {user.last_name}
                      </Link>
                      <p className="text-sm text-stone-500">{user.bio}</p>
                    </div>
                    <p className="mt-2 text-sm">{user.followers_count ? user.followers_count : 0} followers</p>
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
