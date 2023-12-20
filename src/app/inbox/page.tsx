"use client";
import ComposeMessage from "@/components/inbox/compose_message";
import SideBar from "@/components/inbox/sidebar_chat";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

import { IUserJWT } from "@/zustand/types";
import axios, { AxiosError } from "axios";
import * as jwt from "jsonwebtoken";
import SidebarMenu from "@/components/inbox/sidebar_menu";
import {
  IAppInitState,
  IAppState,
  setAccessToken,
  setUser,
} from "@/redux/app.slice";
import { ISentInitState, setActiveChat } from "@/redux/sent.slice";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";

const InboxPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken } = useSelector<RootState, IAppInitState>(
    (state) => state.app,
  );
  const { active_chat } = useSelector<RootState, ISentInitState>(
    (state) => state.sent,
  );

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

        dispatch(setAccessToken(access_token));
        dispatch(setUser(user));
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          router.replace("/login");
        }
        return;
      }
    };

    if (accessToken === undefined) {
      refreshToken();
    }
  }, []);

  return (
    <>
      {accessToken && (
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
