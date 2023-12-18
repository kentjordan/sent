"use client";
import ComposeMessage from "@/components/inbox/compose_message";
import SideBar from "@/components/inbox/sidebar";
import useGlobalStore from "@/zustand/store.global";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

import { IUserJWT } from "@/zustand/types";
import axios, { AxiosError } from "axios";
import * as jwt from "jsonwebtoken";
import SidebarMenu from "@/components/inbox/sidebar_menu";

const InboxPage = () => {
  const setUser = useGlobalStore((state) => state.setUser);
  const setAccessToken = useGlobalStore((state) => state.setAccessToken);
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
          { withCredentials: true },
        );

        const { access_token } = refreshedTokens.data;
        const user = jwt.decode(access_token) as IUserJWT;

        setAccessToken(access_token);
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
        <div className="flex h-screen">
          <SidebarMenu />
          <SideBar />
          <div className="h-full w-[1px] bg-stone-200"></div>

          {active_chat.is_visible ? (
            <ComposeMessage />
          ) : (
            <div className="relative flex h-full w-full flex-col items-center justify-center bg-white">
              <h1 className="text-center font-bold">No selected chat</h1>
              <span className="absolute bottom-0 m-2 text-center text-sm text-stone-500">
                Made by Kent Jordan
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default InboxPage;
