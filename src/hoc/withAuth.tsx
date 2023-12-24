"use client";
import { IAppInitState, IUserJWT, setAccessToken, setUser } from "@/redux/app.slice";
import { AppDispatch, RootState } from "@/redux/store";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as jwt from "jsonwebtoken";

const withAuth = (Page: (args: { accessToken: string | undefined }) => JSX.Element) => {
  // eslint-disable-next-line react/display-name
  return (next: any) => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const { accessToken } = useSelector<RootState, IAppInitState>((state) => state.app);

    useLayoutEffect(() => {
      const refreshToken = async () => {
        try {
          const refreshedTokens = await axios.patch(`${process.env.API_HOSTNAME}/auth/refresh`, undefined, {
            withCredentials: true,
          });

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

    return <Page accessToken={accessToken} {...next} />;
  };
};

withAuth.displayName = "withAuth";

export default withAuth;
