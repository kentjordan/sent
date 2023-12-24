import Link from "next/link";

const NotFoundPage = () => {
  return (
    <div className="flex h-full w-full items-center justify-center bg-black text-white">
      <div className="flex flex-col gap-4">
        <h1>
          <b>404</b> | Page not found
        </h1>
        <Link href={"/"} className="w-full rounded-md bg-white p-2 text-center text-black">
          Return to home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
