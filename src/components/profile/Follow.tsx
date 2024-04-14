"use client";
import axios, { AxiosError } from "axios";
import React, { useLayoutEffect, useState } from "react";
import { SlUserFollowing, SlUserFollow } from "react-icons/sl";
import { Button } from "../ui/button";
import useAppState from "@/hooks/useAppState";

interface IProfile {
  profile_id?: string;
}

const Follow = ({ profile_id }: IProfile) => {
  const { accessToken } = useAppState();

  const [isFollowingUser, setFollowingUser] = useState(false);
  useLayoutEffect(() => {
    const checkFollowState = async () => {
      try {
        const res = await axios.get(`${process.env.API_HOSTNAME}/followers/${profile_id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (res.data >= 1) {
          // The user is following
          setFollowingUser(true);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(error.response);
        }
      }
    };

    if (profile_id) checkFollowState();
  }, [profile_id]);

  const onFollow = () => {
    const followUser = async () => {
      try {
        const res = await axios.post(`${process.env.API_HOSTNAME}/followers/${profile_id}`, undefined, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (res.status === 201) {
          setFollowingUser(true);
        }
      } catch (error) {
        setFollowingUser(false);
        if (error instanceof AxiosError) {
          console.error(error.response);
        }
      }
    };

    followUser();
  };

  const onUnfollow = () => {
    const unfollowUser = async () => {
      try {
        const res = await axios.delete(`${process.env.API_HOSTNAME}/followers/${profile_id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (res.status === 200) {
          setFollowingUser(false);
        }
      } catch (error) {
        setFollowingUser(true);
        if (error instanceof AxiosError) {
          console.error(error.response);
        }
      }
    };

    unfollowUser();
  };

  return isFollowingUser ? (
    <Button
      onClick={onUnfollow}
      className="mx-1 flex h-fit items-center justify-center gap-x-2 rounded-full bg-slate-800 px-4 py-2"
    >
      <SlUserFollowing size={16} />
      <p className="text-white">Following</p>
    </Button>
  ) : (
    <Button
      onClick={onFollow}
      className="mx-1 flex h-fit items-center justify-center gap-x-2 rounded-full bg-slate-800 px-4 py-2"
    >
      <SlUserFollow size={16} />
      <p className="text-white">Follow</p>
    </Button>
  );
};

export default Follow;
