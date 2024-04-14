import { PulseLoader } from "react-spinners";

const PageLoading = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-y-4">
      <PulseLoader size={12} />
      <p className="text-sm font-bold">LOADING</p>
    </div>
  );
};

export default PageLoading;
