"use client";
import ComposeMessage from "@/components/inbox/compose";
import SideBar from "@/components/inbox/sidebarChat";
import { useEffect } from "react";

import { setActivePath } from "@/redux/app.slice";
import { ISentInitState } from "@/redux/sent.slice";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
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
        <div className="flex h-full w-full justify-center">
          <SideBar />
          {active_chat.is_visible && <ComposeMessage />}
        </div>
      )}
    </>
  );
};

export default withAuth(InboxPage);
