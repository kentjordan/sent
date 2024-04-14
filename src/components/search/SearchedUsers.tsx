import Link from "next/link";
import { useEffect, useState } from "react";
import { IoPersonCircle } from "react-icons/io5";
import Image from "next/image";
import axios from "axios";
import useAppState from "@/hooks/useAppState";

interface IUser {
  user_id: string;
  first_name: string;
  last_name: string;
  bio: string | null;
  username: string;
  profile_photo: string | null;
  followers_count: null | number;
}

const SearchedUsers = ({ searchQuery }: { searchQuery: string }) => {
  const { accessToken } = useAppState();

  const [searchedUsers, setSearchedUsers] = useState<Array<IUser>>([]);

  useEffect(() => {
    const search = async () => {
      try {
        const res = await axios.get(`${process.env.API_HOSTNAME}/users/search?q=${searchQuery}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setSearchedUsers(res.data);
      } catch (error) {}
    };
    search();
  }, []);

  return (
    <div>
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
  );
};

export default SearchedUsers;
