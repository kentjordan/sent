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
    <div className="flex h-screen w-screen items-center">
      <div className="hidden h-full w-full flex-[0.5] flex-col items-center justify-center bg-slate-800 text-white sm:flex">
        <h1 className="my-2 text-4xl font-bold">Sent!</h1>
        <span className="my-2 text-center text-sm text-stone-300">
          An open source messaging app.
        </span>
      </div>
      <div className="flex flex-1 flex-col items-center">
        <div className="w-full max-w-lg">
          <h1 className="mx-2 my-4 text-2xl font-bold">Register</h1>
          <form
            className="flex w-full flex-col items-center px-2"
            onSubmit={handleSubmit((data: z.infer<typeof registerSchema>) => {
              mutateAsync(data);
            })}
          >
            <div className="flex w-full flex-col items-center">
              <Input
                className="m-2"
                {...register("email")}
                placeholder="Email"
              />
              {errors.email && (
                <div className="mx-2 p-1">
                  <span className="text-xs text-red-500">
                    * {errors.email?.message}
                  </span>
                </div>
              )}
            </div>
            <div className="flex w-full flex-col items-center">
              <Input
                className="m-2"
                {...register("first_name")}
                placeholder="First name"
              />
              {errors.first_name && (
                <div className="mx-2 p-1">
                  <span className="text-xs text-red-500">
                    * {errors.first_name?.message}
                  </span>
                </div>
              )}
            </div>
            <div className="flex w-full flex-col items-center">
              <Input
                className="m-2"
                {...register("last_name")}
                placeholder="Last name"
              />
              {errors.last_name && (
                <div className="mx-2 p-1">
                  <span className="text-xs text-red-500">
                    * {errors.last_name?.message}
                  </span>
                </div>
              )}
            </div>
            <div className="flex w-full flex-col items-center">
              <Input
                type="password"
                className="m-2"
                {...register("password")}
                placeholder="Password"
              />
              {errors.password && (
                <div className="mx-2 p-1">
                  <span className="text-xs text-red-500">
                    * {errors.password?.message}
                  </span>
                </div>
              )}
            </div>
            <div className="flex w-full flex-col items-center">
              <Input
                type="password"
                className="m-2"
                {...register("confirm_password", {
                  validate(val: string) {
                    const password = watch("password");
                    console.log(password);

                    return val;
                  },
                })}
                placeholder="Confirm password"
              />
              {errors.confirm_password && (
                <div className="mx-2 p-1">
                  <span className="text-xs text-red-500">
                    * {errors.confirm_password?.message}
                  </span>
                </div>
              )}
            </div>
            <div className="flex w-full">
              {isSuccess ? (
                <Button disabled className="my-4 w-full">
                  <PulseLoader color="white" size={8} />
                </Button>
              ) : (
                <Button className="my-4 w-full">Submit</Button>
              )}
            </div>
            <div className="my-2 flex w-full justify-start">
              <span className="m-2 text-sm">
                Have got an account?{" "}
                <Link className="font-bold" href="/login">
                  Login here.
                </Link>
              </span>
            </div>
            <span className="absolute bottom-0 my-8 text-center text-sm text-stone-500">
              Made by Kent Jordan with 💖
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
