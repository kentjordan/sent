"use client";
import ComposeMessage from "@/components/inbox/compose_message";
import SideBar from "@/components/inbox/sidebar";
import useGlobalStore from "@/zustand/store.global";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

import { IUserJWT } from "@/zustand/types";
import axios, { AxiosError } from "axios";
import * as jwt from "jsonwebtoken";

const InboxPage = () => {
  const setUser = useGlobalStore((state) => state.setUser);
  const setTokens = useGlobalStore((state) => state.setTokens);
  const access_token = useGlobalStore((state) => state.access_token);

  const setActiveChat = useGlobalStore((state) => state.setActiveChat);
  const active_chat = useGlobalStore((state) => state.active_chat);

  const router = useRouter();

  useLayoutEffect(() => {
    const refreshToken = async () => {
      try {
        const refreshedTokens = await axios.patch(
          `${process.env.API_HOSTNAME}/auth/refresh`,
          undefined,
          { withCredentials: true }
        );

        const { access_token } = refreshedTokens.data;
        const user = jwt.decode(access_token) as IUserJWT;

        setTokens(access_token);
        setUser(user);
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          router.replace("/login");
        }
        return;
      }
    };

    if (access_token === undefined) {
      refreshToken();
    }
  }, []);

  return (
    <>
      {access_token && (
        <div className='flex h-screen'>
          <SideBar />
          <div className='h-full bg-stone-200 w-[1px]'></div>
          {active_chat.is_visible && <ComposeMessage />}
        </div>
      )}
    </>
  );
};

export default InboxPage;
