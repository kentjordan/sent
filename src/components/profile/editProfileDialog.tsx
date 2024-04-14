import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { IoClose, IoPersonCircle } from "react-icons/io5";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { TbCameraPlus } from "react-icons/tb";
import { useDispatch } from "react-redux";

import { toggleEditProfile } from "@/redux/profile.slice";
import { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import useAppState from "@/hooks/useAppState";

const EditProfileDialog = () => {
  const { handleSubmit, register, setValue } = useForm();
  const dispatch = useDispatch();
  const { accessToken } = useAppState();
  const [profilePhotoToUpload, setProfilePhotoToUpload] = useState<File | undefined>(undefined);
  const { user } = useAppState();

  const [profile, setProfile] = useState({
    first_name: "Lorem",
    last_name: "Ipsum",
    bio: "Update your bio.",
    profilePhoto: undefined,
    coverPhoto: undefined,
  });

  useLayoutEffect(() => {
    const getProfile = async () => {
      const res = await axios.get(`${process.env.API_HOSTNAME}/profiles`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const profilePhoto = await axios.get(`${process.env.API_HOSTNAME}/images/profile-photo/${user?.id}`);

      setValue("first_name", res.data.first_name);
      setValue("last_name", res.data.last_name);
      setValue("bio", res.data.bio);
      setProfile({
        ...profile,
        profilePhoto: profilePhoto.data.url,
      });
    };
    getProfile();
  }, []);

  return (
    <div className="absolute z-10 flex h-full w-full items-center justify-center bg-black/50 sm:p-8">
      <div className="flex h-full w-full max-w-[40rem] flex-col bg-white p-4 text-black sm:rounded-lg">
        <div className="mb-4 flex justify-between">
          <h1 className="text-base font-bold">Edit profile</h1>
          <IoClose onClick={() => dispatch(toggleEditProfile())} className="cursor-pointer" size={24} />
        </div>
        <div className="relative flex w-full items-center justify-center">
          <div className="h-[200px] w-full bg-stone-300"></div>
          {/* <Image className="" src="https://picsum.photos/1500/500" alt={"Profile Photo"} width={1500} height={500} /> */}
          {/* <div className="absolute flex h-full w-full items-end justify-end ">
            <TbCameraPlus className="m-4 text-white" size={32} />
          </div> */}
        </div>
        <div className="relative m-4 mt-[-64px] flex w-fit cursor-pointer items-center justify-center rounded-full">
          {profilePhotoToUpload && (
            <Image
              className="h-24 w-24 rounded-full text-center sm:h-32 sm:w-32"
              src={URL.createObjectURL(profilePhotoToUpload as File)}
              alt={""}
              width={800}
              height={800}
            />
          )}
          {profile.profilePhoto && !profilePhotoToUpload && (
            <Image
              className="h-24 w-24 rounded-full text-center sm:h-32 sm:w-32"
              src={profile.profilePhoto}
              alt={""}
              width={96}
              height={96}
            />
          )}
          {!profile.profilePhoto && !profilePhotoToUpload && (
            <IoPersonCircle className="h-24 w-24 rounded-full bg-white sm:h-32 sm:w-32" />
          )}
          <input
            onChange={(e) => {
              const profilePhoto = e.currentTarget.files?.item(0) as File;
              setProfilePhotoToUpload(profilePhoto);
            }}
            accept="image/*"
            id="profile-photo-upload"
            type="file"
            className="hidden"
          />
          <label
            htmlFor="profile-photo-upload"
            className="absolute flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-black/20"
          >
            <TbCameraPlus className="text-white" size={32} />
          </label>
        </div>
        <form
          className="flex h-full flex-col justify-between"
          onSubmit={handleSubmit((data) => {
            const updateProfile = async () => {
              await axios.patch(`${process.env.API_HOSTNAME}/profiles`, data, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              });

              if (profilePhotoToUpload) {
                const formData = new FormData();
                formData.append("image", profilePhotoToUpload as File);

                const res = await axios.post(`${process.env.API_HOSTNAME}/images/profile-photo`, formData, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${accessToken}`,
                  },
                });
              }

              location.reload();
            };

            updateProfile();
          })}
        >
          <div>
            <div className="mr-2 flex w-full flex-wrap">
              <div
                style={{
                  flex: "1 1 200px",
                }}
                className="mx-1 my-3"
              >
                <p className="my-2 text-base">First name</p>
                <Input {...register("first_name")} className="text-black" defaultValue={profile.first_name}></Input>
              </div>
              <div
                style={{
                  flex: "1 1 200px",
                }}
                className="mx-1 my-3"
              >
                <p className="my-2 text-base">Last name</p>
                <Input {...register("last_name")} className="text-black" defaultValue={profile.last_name}></Input>
              </div>
            </div>
            <div className="mx-1 my-3">
              <p className="my-2 text-base">Bio</p>
              <Textarea {...register("bio")} className="resize-none text-sm" defaultValue={profile.bio}></Textarea>
            </div>
          </div>
          <Button className="mt-8" type="submit">
            Save
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileDialog;
