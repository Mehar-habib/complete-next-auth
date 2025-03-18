"use client";
import { BeatLoader } from "react-spinners";
import CardWrapper from "./card-wrapper";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

export default function NewVerificationForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const onSubmit = useCallback(() => {
    console.log(token);
  }, [token]);
  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="w-full flex items-center justify-center">
        <BeatLoader />
      </div>
    </CardWrapper>
  );
}
