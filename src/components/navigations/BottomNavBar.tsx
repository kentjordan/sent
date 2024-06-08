import useAppState from "@/hooks/useAppState";
import { useRouter } from "next/navigation";
import { BiMessageRounded } from "react-icons/bi";
import { IoSearch, IoPersonCircleOutline } from "react-icons/io5";
import { LuNewspaper } from "react-icons/lu";

const BottomNavBar = () => {
  const { activePath } = useAppState();
  const router = useRouter();
  const { user } = useAppState();
  if (activePath === "/login" || activePath === "/signup") {
    return <></>;
  }
  return (
    <div className="fixed bottom-0 h-16 w-full border-t bg-white lg:hidden">
      <div className="flex h-full items-center justify-center gap-y-2 sm:m-0">
        <div
          onClick={() => router.replace("/newsfeed")}
          className={`flex flex-1 cursor-pointer justify-center  rounded-lg ${
            activePath === "/newsfeed" ? "bg-stone-200" : ""
          } m-2 p-1`}
        >
          <LuNewspaper className="flex flex-1 cursor-pointer justify-center " color="black" size={20} />
        </div>
        <div
          onClick={() => router.replace("/search")}
          className={`flex flex-1  cursor-pointer justify-center rounded-lg ${
            activePath === "/search" ? "bg-stone-200" : ""
          } m-2 p-1`}
        >
          <IoSearch className="flex flex-1 cursor-pointer justify-center " color="black" size={24} />
        </div>

        <div
          onClick={() => router.replace("/inbox")}
          className={`flex flex-1 cursor-pointer justify-center  rounded-lg ${
            activePath === "/inbox" ? "bg-stone-200" : ""
          } m-2 p-1`}
        >
          <BiMessageRounded className="flex flex-1 cursor-pointer justify-center " color="black" size={24} />
        </div>

        <div
          onClick={() => router.replace(`/profile/${user?.username}`)}
          className={`flex flex-1  cursor-pointer justify-center rounded-lg ${
            activePath === "/profile" ? "bg-stone-200" : ""
          } m-2 p-1`}
        >
          <IoPersonCircleOutline className="flex flex-1 cursor-pointer justify-center " size={24} />
        </div>
      </div>
    </div>
  );
};

export default BottomNavBar;
