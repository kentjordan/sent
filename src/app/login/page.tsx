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
    (state: IGlobalState) => state.setAccessToken
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
            "Can't reach the server. It might have an on-going maintenance."
          );
        }
      }
    },
  });

  return (
    <div className='flex w-screen h-screen items-center'>
      <div className='flex-[0.5] bg-slate-800 w-full h-full flex flex-col justify-center items-center text-white'>
        <h1 className='text-4xl font-bold my-2'>Sent!</h1>
        <span className='text-stone-300 my-2 text-sm text-center'>
          An open source messaging app.
        </span>
      </div>
      <div className='flex items-center flex-col p-2 flex-1'>
        <div>
          <h1 className='font-bold text-2xl my-4 mx-2'>Login</h1>
          <form
            onSubmit={handleSubmit(async (data: PostLoginDto) => {
              try {
                await mutateAsync(data);
              } catch (error) {}
            })}
            className='w-full max-w-lg flex flex-col items-center'>
            <Input
              {...register("email", { required: true })}
              className='w-96 m-2'
              placeholder='Email'
            />
            <Input
              {...register("password", { required: true })}
              className='w-96 m-2'
              type='password'
              placeholder='Password'
            />
            <div className='flex w-full'>
              {isSuccess ? (
                <Button disabled className='w-full m-2'>
                  <PulseLoader color='white' size={8} />
                </Button>
              ) : (
                <Button type='submit' className='w-full m-2'>
                  Submit
                </Button>
              )}
            </div>
            <div className='my-2 w-full flex justify-start'>
              <span className='text-sm m-2'>
                Don't have an account?{" "}
                <Link className='font-bold' href='/register'>
                  Register here.
                </Link>
              </span>
            </div>
          </form>
          {error instanceof AxiosError && error.code !== "ERR_NETWORK" && (
            <div className='bg-red-100/50 m-2 p-2 rounded'>
              <ul className='text-red-700'>
                <li className='text-xs my-2 font-bold text-center'>
                  {error.response?.data.message}
                </li>
              </ul>
            </div>
          )}
          {Object.entries(errors).length > 0 && (
            <div className='bg-red-100/50 m-2 p-2 rounded'>
              <ul className='text-red-700'>
                {Object.entries(errors).map((e, i) => {
                  return (
                    <li key={i} className='text-xs my-2'>
                      * <b>{e[0].toUpperCase()}</b>: {`${e[1]?.message}`}{" "}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        <span className='absolute bottom-0 my-8 text-sm text-stone-500 text-center'>
          Made by Kent Jordan with 💖
        </span>
      </div>
    </div>
  );
};

export default LoginPage;
