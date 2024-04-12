import { DateTime } from "luxon";
import Image from "next/image";
import { IoHeartOutline, IoPersonCircle } from "react-icons/io5";

interface IPost {
  first_name: string;
  last_name: string;
  content: string;
  profile_photo: string | undefined;
  created_at: string;
}

const Post = ({ first_name, last_name, content, profile_photo, created_at }: IPost) => {
  return (
    <div className="flex w-full border-b py-4">
      {profile_photo ? (
        <Image
          src={profile_photo}
          className="mx-4 h-8 w-8 rounded-full sm:h-12 sm:w-12"
          alt="Profile Photo"
          width={500}
          height={500}
        />
      ) : (
        <IoPersonCircle className="mx-4 h-12 w-12 rounded-full sm:h-16 sm:w-16" />
      )}
      <div className="flex flex-col justify-center">
        <div className="flex flex-wrap gap-1">
          <h1 className="text-sm font-bold">
            {first_name} {last_name}
          </h1>
          <p className="text-sm text-stone-400">•</p>
          <p className="text-sm text-stone-400">{DateTime.fromISO(created_at).toRelative({ style: "short" })}</p>
        </div>
        <div className="mt-2">
          <p className="text-sm">{content}</p>
        </div>
        <div className="mt-4">
          <IoHeartOutline size={24} />
        </div>
      </div>
    </div>
  );
};

export default Post;
