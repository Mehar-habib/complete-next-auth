"use client";
import { logout } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

const SettingsPage = () => {
  const session = useSession();
  const onClick = () => {
    logout();
  };
  return (
    <div>
      {JSON.stringify(session.data?.user)}
      <Button type="submit" onClick={onClick}>
        Sign out
      </Button>
    </div>
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
