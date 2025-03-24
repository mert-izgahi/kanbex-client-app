"use server";

import { SignInSchema } from "@/lib/zod";
import { auth, DEFAULT_REDIRECT, signIn, signOut } from "@/lib/auth";
import { IAccount } from "@/lib/types";
import { redirect } from "next/navigation";
export const signInAction = async (args: SignInSchema, redirectTo: string) => {
  try {
    console.log(args);

    await signIn("credentials", {
      ...args,
      redirect: true,
      redirectTo: redirectTo,
    });
  } catch (error) {
    throw new Error("Invalid credentials");
  }
};

export const signInWithGoogleAction = async (redirectTo: string) => {
  await signIn("google", {
    redirect: true,
    redirectTo: redirectTo,
  });
};

export const signInWithGithubAction = async (redirectTo: string) => {
  await signIn("github", {
    redirectTo: redirectTo,
  });
};

export const signOutAction = async () => {
  await signOut({
    redirect: true,
    redirectTo: "/",
  });
};

export const getAccessTokenAction = async () => {
  try {
    const session = await auth();
    const user = session?.user as IAccount;
    const accessToken = user?.accessToken;
    if (!accessToken) return redirect("/sign-in");
    return accessToken;
  } catch (error) {
    return null;
  }
};
