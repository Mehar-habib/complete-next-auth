"use client";

import { settings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useTransition } from "react";

const SettingsPage = () => {
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const onClick = () => {
    startTransition(() => {
      settings({ name: "Mehar Habib" }).then(() => {
        update();
      });
    });
  };
  return (
    <Card className="w-[600px]">
      <CardHeader className="text-2xl font-semibold text-center">
        <p>🛞 Settings</p>
      </CardHeader>
      <CardContent>
        <Button disabled={isPending} onClick={onClick}>
          Update name
        </Button>
      </CardContent>
    </Card>
  );
};

export default SettingsPage;

// "use client";
// import { Button } from "@/components/ui/button";
// import { signOut, useSession } from "next-auth/react";
// import { useEffect } from "react";

// const SettingsPage = () => {
//   const { data: session, status, update } = useSession();

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       update(); // 🔄 Manually refresh session when user logs in
//     }
//   }, [status, update]);

//   const onClick = () => {
//     signOut();
//   };

//   return (
//     <div>
//       {JSON.stringify(session)}
//       <Button type="submit" onClick={onClick}>
//         Sign out
//       </Button>
//     </div>
//   );
// };

// export default SettingsPage;
