"use server";

import { SignInSchema } from "@/lib/zod";
import { auth, signIn, signOut } from "@/lib/auth";
import { IAccount } from "@/lib/types";
import { redirect } from "next/navigation";
export const signInAction = async (args: SignInSchema) => {
  try {
    await signIn("credentials", {
      ...args,
      redirect: false,
    });
  } catch (error) {
    throw new Error("Invalid credentials");
  }
};

export const signInWithGoogleAction = async () => {
  await signIn("google", {
    redirect: true,
    redirectTo: process.env.NEXT_PUBLIC_RIDRECT_AUTH_URL,
  });
};

export const signInWithGithubAction = async () => {
  await signIn("github", {
    redirect: true,
    redirectTo: process.env.NEXT_PUBLIC_RIDRECT_AUTH_URL,
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
