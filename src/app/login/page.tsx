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

  const { error, mutateAsync, isPending } = useMutation({
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
    <div className='flex flex-col justify-center items-center h-screen'>
      <div className='flex flex-col justif items-center my-4'>
        <h1 className='font-bold text-xl'>Sent!</h1>
        <span className='text-stone-500 text-center'>
          An open source messaging app
        </span>
      </div>
      <form
        onSubmit={handleSubmit(async (data: PostLoginDto) => {
          try {
            await mutateAsync(data);
          } catch (error) {}
        })}
        className='flex flex-col border rounded p-4 w-full max-w-xs'>
        <Input
          {...register("email", { required: true })}
          className='my-2'
          placeholder='Email'
        />
        <Input
          {...register("password", { required: true })}
          className='my-2'
          type='password'
          placeholder='Password'
        />
        {isPending ? (
          <Button disabled type='submit' className='my-2'>
            <PulseLoader color='white' size={8} />
          </Button>
        ) : (
          <Button type='submit' className='my-2'>
            Login
          </Button>
        )}
      </form>
      {error instanceof AxiosError && (
        <div className='bg-red-100/50 max-w-xs w-full my-2 p-2 rounded'>
          <ul className='text-red-700'>
            <li className='text-xs my-2 font-bold text-center'>
              {error.response?.data.message}
            </li>
          </ul>
        </div>
      )}
      {Object.entries(errors).length > 0 && (
        <div className='bg-red-100/50 max-w-xs w-full my-2 p-2 rounded'>
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
  );
};

export default LoginPage;
