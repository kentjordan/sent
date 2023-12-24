"use client";
import ComposeMessage from "@/components/inbox/compose_message";
import SideBar from "@/components/inbox/sidebar_chat";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";

import axios, { AxiosError } from "axios";
import * as jwt from "jsonwebtoken";
import SidebarMenu from "@/components/sidebar_menu";
import { IAppInitState, IAppState, IUserJWT, setAccessToken, setActivePath, setUser } from "@/redux/app.slice";
import { ISentInitState, setActiveChat } from "@/redux/sent.slice";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import withAuth from "@/hoc/withAuth";

const InboxPage = (args: { accessToken: string | undefined } | undefined) => {
  const { active_chat } = useSelector<RootState, ISentInitState>((state) => state.sent);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setActivePath("/inbox"));
  }, []);

  return (
    <>
      {args?.accessToken && (
        <>
          <SideBar />
          <div className="h-full w-[1px] bg-stone-200"></div>
          {active_chat.is_visible ? (
            <ComposeMessage />
          ) : (
            <div className="relative flex h-full w-full flex-col items-center justify-center bg-white">
              <h1 className="text-center font-bold">No selected chat</h1>
              <span className="absolute bottom-0 m-2 text-center text-sm text-stone-500">Made by Kent Jordan</span>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default withAuth(InboxPage);
