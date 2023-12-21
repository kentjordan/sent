import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { IoClose } from "react-icons/io5";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { TbCameraPlus } from "react-icons/tb";
import { useDispatch } from "react-redux";

import { toggleEditProfile } from "@/redux/profile.slice";

const EditProfileDialog = () => {
  return (
    <div className="absolute flex h-full w-full items-center justify-center bg-black/50">
      <DesktopEditProfileDialog />
      <ModileEditProfileDialog />
    </div>
  );
};

const DesktopEditProfileDialog = () => {
  const { handleSubmit, register } = useForm();
  const dispatch = useDispatch();

  return (
    <div className="hidden w-full max-w-[40rem] flex-col justify-between rounded-lg bg-white p-4 text-black md:flex">
      <div className="mb-4 flex justify-between">
        <h1 className="text-base font-bold">Edit profile</h1>
        <IoClose
          onClick={() => dispatch(toggleEditProfile())}
          className="cursor-pointer"
          size={24}
        />
      </div>
      <div className="relative flex w-full items-center justify-center">
        <Image
          src="https://picsum.photos/1500/500"
          alt={""}
          width={1500}
          height={500}
        />
        <div className="absolute flex h-full w-full items-end justify-end bg-black/50">
          <TbCameraPlus className="m-4 text-white" size={32} />
        </div>
      </div>
      <div className="relative m-4 mt-[-64px] flex w-fit items-center justify-center rounded-full">
        <Image
          className="rounded-full sm:h-32 sm:w-32"
          src="https://picsum.photos/500/500"
          alt={"Profile Photo"}
          width={96}
          height={96}
        />
        <div className="absolute flex h-full w-full items-center justify-center rounded-full bg-black/50">
          <TbCameraPlus className="text-white" size={32} />
        </div>
      </div>
      <form>
        <div className="mr-2 flex w-full flex-wrap">
          <div
            style={{
              flex: "1 1 200px",
            }}
            className="mx-1 my-3"
          >
            <p className="my-2 text-base">First name</p>
            <Input className="text-black"></Input>
          </div>
          <div
            style={{
              flex: "1 1 200px",
            }}
            className="mx-1 my-3"
          >
            <p className="my-2 text-base">Last name</p>
            <Input className="text-black"></Input>
          </div>
        </div>
        <div className="mx-1 my-3">
          <p className="my-2 text-base">Bio</p>
          <Textarea className="min-h-[150px] resize-none"></Textarea>
        </div>
      </form>
      <Button className="mt-8" type="submit">
        Save
      </Button>
    </div>
  );
};

const ModileEditProfileDialog = () => {
  const { handleSubmit, register } = useForm();

  const dispatch = useDispatch();

  return (
    <div className="flex h-full w-full flex-col justify-between  bg-white p-2 text-black md:hidden">
      <div>
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-base font-bold">Edit profile</h1>
          <IoClose
            onClick={() => dispatch(toggleEditProfile())}
            className="cursor-pointer"
            size={24}
          />
        </div>
        {/* Photo */}
        <div>
          <div className="relative flex w-full items-center justify-center ">
            <Image
              src="https://picsum.photos/1500/500"
              alt={""}
              width={1500}
              height={500}
            />
            <div className="absolute flex h-full w-full items-end justify-end bg-black/50">
              <TbCameraPlus className="m-4 text-white" size={32} />
            </div>
          </div>
          <div className="relative m-4 mt-[-64px] flex w-fit items-center justify-center rounded-full">
            <Image
              className="rounded-full sm:h-32 sm:w-32"
              src="https://picsum.photos/500/500"
              alt={"Profile Photo"}
              width={96}
              height={96}
            />
            <div className="absolute flex h-full w-full items-center justify-center rounded-full bg-black/50">
              <TbCameraPlus className="text-white" size={32} />
            </div>
          </div>
        </div>
        {/* Form */}
        <form>
          <div className="mr-2 flex w-full flex-wrap">
            <div
              style={{
                flex: "1 1 200px",
              }}
              className="mx-1 my-1"
            >
              <p className="my-2 text-sm">First name</p>
              <Input className="text-black"></Input>
            </div>
            <div
              style={{
                flex: "1 1 200px",
              }}
              className="mx-1 my-1"
            >
              <p className="my-2 text-sm">Last name</p>
              <Input className="text-black"></Input>
            </div>
          </div>
          <div className="mx-1 my-3">
            <p className="my-2 text-sm">Bio</p>
            <Textarea className="min-h-[150px] resize-none"></Textarea>
          </div>
        </form>
      </div>
      <Button className="mt-8" type="submit">
        Save
      </Button>
    </div>
  );
};

export default EditProfileDialog;
