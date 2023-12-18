"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerSchema } from "@/schemas/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useRegisterAccount from "../hooks/useRegister";
import PulseLoader from "react-spinners/PulseLoader";
import Link from "next/link";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  const router = useRouter();

  const { mutateAsync, isSuccess } =
    useRegisterAccount<z.infer<typeof registerSchema>>(router);

  return (
    <div className='flex w-screen h-screen items-center'>
      <div className='flex-[0.5] bg-slate-800 w-full h-full flex flex-col justify-center items-center text-white'>
        <h1 className='text-4xl font-bold my-2'>Sent!</h1>
        <span className='text-stone-300 my-2 text-sm text-center'>
          An open source messaging app.
        </span>
      </div>
      <div className='flex items-center flex-col p-2 flex-1'>
        <div className=''>
          <h1 className='font-bold text-2xl my-4 mx-2'>Register</h1>
          <form
            onSubmit={handleSubmit((data: z.infer<typeof registerSchema>) => {
              mutateAsync(data);
            })}
            className='w-full max-w-lg flex flex-col items-center'>
            <div className='flex flex-col w-full'>
              <Input
                className='w-96 m-2'
                {...register("email")}
                placeholder='Email'
              />
              {errors.email && (
                <div className='mx-2 p-1'>
                  <span className='text-xs text-red-500'>
                    * {errors.email?.message}
                  </span>
                </div>
              )}
            </div>
            <div className='flex flex-col w-full'>
              <Input
                className='w-96 m-2'
                {...register("first_name")}
                placeholder='First name'
              />
              {errors.first_name && (
                <div className='mx-2 p-1'>
                  <span className='text-xs text-red-500'>
                    * {errors.first_name?.message}
                  </span>
                </div>
              )}
            </div>

            <div className='flex flex-col w-full'>
              <Input
                className='w-96 m-2'
                {...register("last_name")}
                placeholder='Last name'
              />
              {errors.last_name && (
                <div className='mx-2 p-1'>
                  <span className='text-xs text-red-500'>
                    * {errors.last_name?.message}
                  </span>
                </div>
              )}
            </div>

            <div className='flex flex-col w-full'>
              <Input
                type='password'
                className='w-96 m-2'
                {...register("password")}
                placeholder='Password'
              />
              {errors.password && (
                <div className='mx-2 p-1'>
                  <span className='text-xs text-red-500'>
                    * {errors.password?.message}
                  </span>
                </div>
              )}
            </div>
            <div className='flex flex-col w-full'>
              <Input
                type='password'
                className='w-96 m-2'
                {...register("confirm_password", {
                  validate(val: string) {
                    const password = watch("password");
                    console.log(password);

                    return val;
                  },
                })}
                placeholder='Confirm password'
              />
              {errors.confirm_password && (
                <div className='mx-2 p-1'>
                  <span className='text-xs text-red-500'>
                    * {errors.confirm_password?.message}
                  </span>
                </div>
              )}
            </div>

            <div className='flex w-full'>
              {isSuccess ? (
                <Button disabled className='w-full m-2'>
                  <PulseLoader color='white' size={8} />
                </Button>
              ) : (
                <Button className='w-full m-2'>Submit</Button>
              )}
            </div>
            <div className='my-2 w-full flex justify-start'>
              <span className='text-sm m-2'>
                Have got an account?{" "}
                <Link className='font-bold' href='/login'>
                  Login here.
                </Link>
              </span>
            </div>
            <span className='absolute bottom-0 my-8 text-sm text-stone-500 text-center'>
              Made by Kent Jordan with 💖
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
