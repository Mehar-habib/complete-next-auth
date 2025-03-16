"use client";

import { FaExclamationCircle } from "react-icons/fa";
import CardWrapper from "./card-wrapper";

export default function ErrorCard() {
  return (
    <CardWrapper
      headerLabel="Oops, something went wrong!"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="w-full flex flex-col items-center">
        <FaExclamationCircle className="text-destructive h-5 w-5" />
      </div>
    </CardWrapper>
  );
}
