"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginSchema } from "@/schemas/login";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PulseLoader } from "react-spinners";
import useGlobalStore from "@/zustand/store.global";
import { IGlobalState, IUserJWT } from "@/zustand/types";
import { useRouter } from "next/navigation";
import * as jwt from "jsonwebtoken";
import Link from "next/link";

type PostLoginDto = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const setTokens = useGlobalStore(
    (state: IGlobalState) => state.setAccessToken,
  );
  const setUser = useGlobalStore((state) => state.setUser);

  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PostLoginDto>({ resolver: zodResolver(loginSchema) });

  const { error, mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async (credentials: PostLoginDto) =>
      axios.post(`${process.env.API_HOSTNAME}/auth/login`, credentials, {
        withCredentials: true,
      }),
    onSuccess(data: AxiosResponse<{ access_token: string }>) {
      const { access_token } = data.data;
      const user = jwt.decode(access_token) as IUserJWT;

      setTokens(access_token);
      setUser(user);

      router.replace("/inbox");
    },
    onError(error) {
      if (error instanceof AxiosError) {
        if (error.code === "ERR_NETWORK") {
          alert(
            "Can't reach the server. It might have an on-going maintenance.",
          );
        }
      }
    },
  });

  return (
    <div className="flex h-screen w-screen items-center">
      <div className="hidden h-full w-full flex-[0.5] flex-col items-center justify-center bg-slate-800 text-white sm:flex">
        <h1 className="my-2 text-4xl font-bold">Sent!</h1>
        <span className="my-2 text-center text-sm text-stone-300">
          An open source messaging app.
        </span>
      </div>
      <div className="flex flex-1 flex-col items-center p-2">
        <div className="w-full max-w-md">
          <h1 className="mx-2 my-4 text-2xl font-bold">Login</h1>
          <form
            onSubmit={handleSubmit(async (data: PostLoginDto) => {
              try {
                await mutateAsync(data);
              } catch (error) {}
            })}
            className="flex flex-col items-center"
          >
            <Input
              {...register("email", { required: true })}
              className="m-2 w-full"
              placeholder="Email"
            />
            <Input
              {...register("password", { required: true })}
              className="m-2 w-full"
              type="password"
              placeholder="Password"
            />
            <div className="flex w-full">
              {isSuccess ? (
                <Button disabled className="my-4 w-full">
                  <PulseLoader color="white" size={8} />
                </Button>
              ) : (
                <Button type="submit" className="my-4 w-full">
                  Submit
                </Button>
              )}
            </div>
            <div className="my-2 flex w-full justify-start">
              <span className="m-2 text-sm">
                Don&apos;t have an account?{" "}
                <Link className="font-bold" href="/register">
                  Register here.
                </Link>
              </span>
            </div>
          </form>
          {error instanceof AxiosError && error.code !== "ERR_NETWORK" && (
            <div className="m-2 rounded bg-red-100/50 p-2">
              <ul className="text-red-700">
                <li className="my-2 text-center text-xs font-bold">
                  {error.response?.data.message}
                </li>
              </ul>
            </div>
          )}
          {Object.entries(errors).length > 0 && (
            <div className="m-2 rounded bg-red-100/50 p-2">
              <ul className="text-red-700">
                {Object.entries(errors).map((e, i) => {
                  return (
                    <li key={i} className="my-2 text-xs">
                      * <b>{e[0].toUpperCase()}</b>: {`${e[1]?.message}`}{" "}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        <span className="absolute bottom-0 my-8 text-center text-sm text-stone-500">
          Made by Kent Jordan with 💖
        </span>
      </div>
    </div>
  );
};

export default LoginPage;
