"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/input/Input";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function Home() {
  const session = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/users");
    }
  }, [session?.status, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: { username: "", fullname: "", password: "" },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    signIn("credentials", {
      ...data,
      redirect: false,
    })
      .then(async (res) => {
        if (res?.error) {
          toast.error(
            "maybe username not exist or password not match"
          );
        }

        if (res?.ok && !res?.error) {
          toast.success("Entering app!");
          router.push("/users");
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <main className="flex justify-center min-h-screen items-center">
      <div className="">
        <h2 className="mt-6 text-center text-3xl font-bold text-blue-500 tracking-tight">
          Chat App!
        </h2>

        <div className="max-w-sm w-screen">
          <form
            className="mt-4 space-y-6 border shadow-lg p-4 rounded-lg"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              id="username"
              type="text"
              label="Username"
              register={register}
              errors={errors}
              disabled={isLoading}
            />
            <Input
              id="password"
              type="password"
              label="Password"
              register={register}
              errors={errors}
              disabled={isLoading}
            />

            <Button disabled={isLoading} type="submit" fullWidth>
              Sign In
            </Button>
          </form>
        </div>

        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <span>Not have an account?</span>

          <a
            className="underline text-blue-500 hover:text-blue-600"
            href="/register"
          >
            create account
          </a>
        </div>
      </div>
    </main>
  );
}
