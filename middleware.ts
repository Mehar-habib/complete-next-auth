import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);
export default auth((req) => {
  console.log("Route ", req.nextUrl.pathname);
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)r"],
};
