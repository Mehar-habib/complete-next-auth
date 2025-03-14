"use client";
import { FaGithub } from "react-icons/fa";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export default function Social() {
  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };
  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size="lg"
        className="w-[50%] cursor-pointer"
        variant="outline"
        onClick={() => onClick("google")}
      >
        <FcGoogle className="h-6 w-6" />
      </Button>

      <Button
        size="lg"
        className="w-[50%] cursor-pointer"
        variant="outline"
        onClick={() => onClick("github")}
      >
        <FaGithub className="h-6 w-6" />
      </Button>
    </div>
  );
}
